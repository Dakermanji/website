//! routes/chatRoutes.js

import express from 'express';
import {
	renderChatHome,
	fetchMessages,
	sendMessage,
	createRoom,
	addRoomMember,
} from '../controllers/chatController.js';

const router = express.Router();

// Main routes
router.route('/').get(renderChatHome).post(renderChatHome);

// Friends chat
router.get('/friends/:friendId/messages', fetchMessages);
router.post('/friends/:friendId/messages', sendMessage);

// Rooms chat
router.get('/rooms/:roomId/messages', fetchMessages);
router.post('/rooms/:roomId/messages', sendMessage);
router.post('/rooms/create', createRoom);
router.post('/rooms/:roomId/members', addRoomMember);

// Tasks chat
router.get('/tasks/:taskId/messages', fetchMessages);
router.post('/tasks/:taskId/messages', sendMessage);

export default router;
