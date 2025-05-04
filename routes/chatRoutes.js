//! routes/chatRoutes.js

import express from 'express';
import {
	renderChatPage,
	fetchMessages,
	sendMessage,
	renderChatHome,
} from '../controllers/chatController.js';

const router = express.Router();

// Main route
router.get('/', renderChatHome);

// Friends chat
router.get('/friends/:friendId', renderChatPage);
router.get('/friends/:friendId/messages', fetchMessages);
router.post('/friends/:friendId/messages', sendMessage);

// Rooms chat
router.get('/rooms/:roomId', renderChatPage);
router.get('/rooms/:roomId/messages', fetchMessages);
router.post('/rooms/:roomId/messages', sendMessage);

// Tasks chat
router.get('/tasks/:taskId', renderChatPage);
router.get('/tasks/:taskId/messages', fetchMessages);
router.post('/tasks/:taskId/messages', sendMessage);

export default router;
