//! controllers/chatController.js

import ChatMessage from '../models/ChatMessage.js';
import ChatRoomMember from '../models/ChatRoomMember.js';
import { v4 as uuidv4 } from 'uuid';
import { canSendMessage, formatMessage } from '../utils/chatHelper.js';
import { getIO } from '../config/socket.js';
import { navBar } from '../data/navBar.js';
import Notification from '../models/Notification.js';
import { getUserFriends } from '../utils/friends/userFriendsHelper.js';

export const renderChatHome = async (req, res) => {
	const userId = req.user?.id;
	const userFriends = await getUserFriends(userId);
	const notifications = await Notification.getUnreadNotiifcationsForUser(
		userId
	);
	const unreadCount = await Notification.countUnread(req.user.id);
	res.render('chat/index', {
		title: 'Chat - DWD',
		navBar: navBar.projects,
		userFriends,
		notifications,
		unreadCount,
		success_msg: res.locals.success,
		error_msg: res.locals.error,
		user: userId,
		styles: ['chat'],
		// scripts: [],
	});
};

export const renderChatPage = async (req, res) => {
	const { friendId, roomId, taskId } = req.params;

	let projectName = 'chat_app';
	let receiverId = friendId;

	if (roomId) {
		projectName = 'chat_app_room';
		receiverId = roomId;
	}

	if (taskId) {
		projectName = 'taskmanager';
		receiverId = taskId;
	}

	const userId = req.user?.id;
	const userFriends = await getUserFriends(userId);
	const notifications = await Notification.getUnreadNotiifcationsForUser(
		userId
	);
	const unreadCount = await Notification.countUnread(req.user.id);

	res.render('chat/chat', {
		title: 'Chat - DWD',
		navBar: navBar.projects,
		userFriends,
		notifications,
		unreadCount,
		success_msg: res.locals.success,
		error_msg: res.locals.error,
		projectName,
		receiverId,
		user: userId,
		styles: ['chat'],
		// scripts: ['chat'],
	});
};

export const fetchMessages = async (req, res) => {
	const { friendId, roomId, taskId } = req.params;

	let projectName = 'chat_app';
	let receiverId = friendId;

	if (roomId) {
		projectName = 'chat_app_room';
		receiverId = roomId;
	}

	if (taskId) {
		projectName = 'taskmanager';
		receiverId = taskId;
	}

	try {
		const messages = await ChatMessage.fetchByReceiver(
			projectName,
			receiverId
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

	let projectName = 'chat_app';
	let receiverId = friendId;

	if (roomId) {
		projectName = 'chat_app_room';
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

		const formattedMessage = formatMessage(newMessage, req.user);

		// Emit via socket.io
		const io = getIO();
		io.to(receiverId).emit('chatMessage', formattedMessage);

		res.status(201).json(formattedMessage);
	} catch (err) {
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
