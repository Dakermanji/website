//! controllers/chatController.js

import { v4 as uuidv4 } from 'uuid';
import { getIO } from '../config/socket.js';
import { navBar } from '../data/navBar.js';
import errorHandler from '../middlewares/errorHandler.js';
import ChatMessage from '../models/ChatMessage.js';
import ChatRoom from '../models/ChatRoom.js';
import Collaboration from '../models/Collaboration.js';
import ChatRoomMember from '../models/ChatRoomMember.js';
import Follow from '../models/Follow.js';
import Notification from '../models/Notification.js';
import Project from '../models/Project.js';
import {
	canSendMessage,
	formatMessage,
	getSocketRoom,
} from '../utils/chatHelper.js';
import { getUserFriends } from '../utils/friends/userFriendsHelper.js';

export const renderChatHome = async (req, res, next) => {
	const userId = req.user?.id;
	try {
		const projectName = req.method === 'POST' ? req.body.projectName : null;
		let receiverId = null;
		let friend = null;

		if (req.method === 'POST') {
			if (projectName === 'chat') {
				receiverId = req.body.friend_id;
			} else if (projectName === 'room') {
				receiverId = req.body.room_id;
			} else if (projectName === 'taskmanager') {
				receiverId = req.body.project_id;
			}
		}

		const userFriends = await getUserFriends(userId);
		const notifications = await Notification.getUnreadNotiifcationsForUser(
			userId
		);
		const unreadCount = await Notification.countUnread(req.user.id);

		const chat_friends = await Follow.fetchMutualFollowers(userId);
		const chat_rooms = await ChatRoomMember.fetchUserRooms(userId);
		const ownedProjects = await Project.getProjectsByOwner(userId);
		const collaborationsProjects = await Collaboration.getProjectsForUser(
			userId
		);
		const chat_projects = [
			...ownedProjects.map((p) => ({
				id: p.id,
				name: p.name,
				type: 'Owner',
			})),
			...collaborationsProjects.map((c) => ({
				id: c.project_id,
				name: c.name,
				type: 'Collaborator',
			})),
		];

		res.render('chat/index', {
			title: 'Chat - DWD',
			navBar: navBar.projects,
			chat_friends,
			chat_rooms,
			chat_projects,
			userFriends,
			notifications,
			unreadCount,
			projectName,
			friend,
			receiverId,
			success_msg: res.locals.success,
			error_msg: res.locals.error,
			styles: ['chat'],
			scripts: ['chat'],
		});
	} catch (error) {
		errorHandler(error, req, res, next);
	}
};

export const fetchMessages = async (req, res) => {
	const { friendId, roomId, taskId } = req.params;

	let projectName = 'chat';
	let receiverId = friendId;

	if (roomId) {
		projectName = 'room';
		receiverId = roomId;
	}

	if (taskId) {
		projectName = 'taskmanager';
		receiverId = taskId;
	}

	try {
		const messages = await ChatMessage.fetchByReceiver(
			projectName,
			receiverId,
			req.user.id
		);
		res.json(messages);
	} catch (err) {
		res.status(500).json({ error: 'Failed to fetch messages.' });
	}
};

export const sendMessage = async (req, res) => {
	const { friendId, roomId, taskId } = req.params;
	const { message } = req.body;
	const userId = req.user.id;

	let projectName = 'chat';
	let receiverId = friendId;

	if (roomId) {
		projectName = 'room';
		receiverId = roomId;
	}

	if (taskId) {
		projectName = 'taskmanager';
		receiverId = taskId;
	}

	try {
		const allowed = await canSendMessage(projectName, receiverId, userId);

		if (!allowed) {
			return res
				.status(403)
				.json({ error: 'Not allowed to send message.' });
		}

		const newMessage = {
			id: uuidv4(),
			project_name: projectName,
			receiver_id: receiverId,
			user_id: userId,
			message,
		};

		await ChatMessage.create(newMessage);

		// Fetch saved message including created_at and joined user info
		const savedMessage = await ChatMessage.fetchById(newMessage.id);

		// emit + response
		const formattedMessage = formatMessage(savedMessage, req.user);

		// Emit via socket.io
		const io = getIO();
		const socketRoom = getSocketRoom(projectName, userId, receiverId);

		io.to(socketRoom).emit('chatMessage', formattedMessage);

		res.status(201).json(formattedMessage);
	} catch (err) {
		console.error('Send message error:', err);
		res.status(500).json({ error: 'Failed to send message.' });
	}
};

export const joinRoom = async (req, res) => {
	const { roomId } = req.params;
	const userId = req.user.id;

	try {
		await ChatRoomMember.addMember(roomId, userId);
		res.status(201).json({ message: 'Joined room successfully.' });
	} catch (err) {
		res.status(500).json({ error: 'Failed to join room.' });
	}
};

export const createRoom = async (req, res, next) => {
	const { name } = req.body;
	const creator_id = req.user.id;

	if (!name || name.trim().length < 2) {
		return res.status(400).json({ error: 'Room name is too short' });
	}

	try {
		const room = {
			id: uuidv4(),
			name: name.trim(),
			creator_id,
			is_locked: false,
		};
		await ChatRoom.create(room);
		await ChatRoomMember.addMember(room.id, creator_id);

		res.status(201).json({ message: 'Room created', room });
	} catch (error) {
		errorHandler(error, req, res, next);
		res.status(500).json({ error: 'Failed to create room' });
	}
};
