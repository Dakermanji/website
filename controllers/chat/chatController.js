//! controllers/chat/chatController.js

import { v4 as uuidv4 } from 'uuid';
import { getIO } from '../../config/socket.js';
import { navBar } from '../../data/navBar.js';
import errorHandler from '../../middlewares/errorHandler.js';
import ChatMessage from '../../models/ChatMessage.js';
import ChatRoom from '../../models/ChatRoom.js';
import ChatRoomMember from '../../models/ChatRoomMember.js';
import Follow from '../../models/Follow.js';
import User from '../../models/User.js';
import Notification from '../../models/Notification.js';
import {
	formatMessage,
	getChatProjects,
	getSocketRoom,
	getChatTarget,
} from '../../utils/chatHelper.js';
import { getUserFriends } from '../../utils/friends/userFriendsHelper.js';

export const renderChatHome = async (req, res, next) => {
	const userId = req.user?.id;
	try {
		const { projectName, receiverId } = getChatTarget(req);

		const userFriends = await getUserFriends(userId);
		const notifications = await Notification.getUnreadNotiifcationsForUser(
			userId
		);
		const unreadCount = await Notification.countUnread(req.user.id);

		const chat_friends = await Follow.fetchMutualFollowers(userId);
		const memberRooms = await ChatRoomMember.fetchUserRooms(userId);
		const ownedRooms = await ChatRoom.fetchOwnedRooms(userId);
		const chat_rooms = [...ownedRooms, ...memberRooms];

		const chat_projects = await getChatProjects(userId);

		let friend = null;
		let room = null;
		if (projectName === 'chat') {
			friend = await User.findById(receiverId);
		} else if (projectName === 'room' && receiverId) {
			room = await ChatRoom.fetchById(receiverId);
			const roomMembers = await ChatRoomMember.fetchMembers(receiverId);
			room.roomMembers = roomMembers;
		}

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
			room,
			receiverId,
			success_msg: res.locals.success,
			error_msg: res.locals.error,
			styles: ['chat'],
			scripts: [
				'chat/chatConstants',
				'chat/chatSocket',
				'chat/chatUtils',
				'chat/chatEvents',
			],
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

		res.status(201).json({ message: 'Room created', room });
	} catch (error) {
		errorHandler(error, req, res, next);
		res.status(500).json({ error: 'Failed to create room' });
	}
};

export const leaveRoom = async (req, res) => {
	const { roomId } = req.params;
	const userId = req.user.id;

	try {
		const room = await ChatRoom.fetchById(roomId);
		if (!room) {
			req.flash('error', 'Room not found.');
			return res.redirect('/chat');
		}

		if (room.creator_id === userId) {
			req.flash('error', 'You cannot leave a room you created.');
			return res.redirect('/chat');
		}

		const member = await ChatRoomMember.fetchMember(roomId, userId);
		if (!member || !member.accepted_at) {
			req.flash('error', 'You are not an active member of this room.');
			return res.redirect('/chat');
		}

		await ChatRoomMember.removeMember(roomId, userId);
		req.flash('success', 'You have left the room.');
		res.redirect('/chat');
	} catch (err) {
		console.error('Leave room error:', err);
		req.flash('error', 'Failed to leave the room.');
		res.redirect('/chat');
	}
};

export const deleteRoom = async (req, res) => {
	const { roomId } = req.params;
	const userId = req.user.id;

	try {
		const room = await ChatRoom.fetchById(roomId);
		if (!room) {
			req.flash('error', 'Room not found.');
			return res.redirect('/chat');
		}

		if (room.creator_id !== userId) {
			req.flash('error', 'You cannot delete a room you did not create.');
			return res.redirect('/chat');
		}

		await ChatRoom.delete(roomId, userId);
		req.flash('success', 'You successfully delete the room.');
		res.redirect('/chat');
	} catch (err) {
		console.error('Leave room error:', err);
		req.flash('error', 'Failed to delete the room.');
		res.redirect('/chat');
	}
};
