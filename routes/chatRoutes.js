//! routes/chatRoutes.js

import express from 'express';
import {
	validateChatAccess,
	validateRoomInviteAccess,
} from '../middlewares/chatMiddleware.js';
import {
	renderChatHome,
	fetchMessages,
	sendMessage,
	createRoom,
	leaveRoom,
	deleteRoom,
} from '../controllers/chat/chatController.js';
import {
	addRoomMember,
	acceptRoomInvite,
	declineRoomInvite,
} from '../controllers/chat/chatMemberController.js';

const router = express.Router();

// Main routes
router.route('/').get(renderChatHome).post(validateChatAccess, renderChatHome);

// Friends chat
router.get('/friends/:friendId/messages', fetchMessages);
router.post('/friends/:friendId/messages', validateChatAccess, sendMessage);

// Rooms chat
router.get('/rooms/:roomId/messages', fetchMessages);
router.post('/rooms/:roomId/messages', validateChatAccess, sendMessage);
router.post('/rooms/create', createRoom);
router.post('/rooms/:roomId/delete', deleteRoom);

// Room members
router.post('/rooms/:roomId/members', validateRoomInviteAccess, addRoomMember);
router.post('/rooms/:roomId/accept', acceptRoomInvite);
router.post('/rooms/:roomId/decline', declineRoomInvite);
router.post('/rooms/:roomId/leave', leaveRoom);

// Tasks chat
router.get('/tasks/:taskId/messages', fetchMessages);
router.post('/tasks/:taskId/messages', sendMessage);

export default router;
