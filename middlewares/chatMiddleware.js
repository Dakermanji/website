//! middlewares/chatMiddleware.js

import Follow from '../models/Follow.js';
import ChatRoom from '../models/ChatRoom.js';
import ChatRoomMember from '../models/ChatRoomMember.js';
import Project from '../models/Project.js';
import Collaboration from '../models/Collaboration.js';
import errorHandler from './errorHandler.js';

export async function validateChatAccess(req, res, next) {
	const userId = req.user.id;
	const { projectName, friend_id, room_id, project_id } = req.body;

	try {
		if (projectName === 'chat') {
			const isFriend = await Follow.isMutual(userId, friend_id);
			if (!isFriend) {
				req.flash('error', 'You are not friends with this user.');
				return res.redirect('/chat');
			}
		} else if (projectName === 'room') {
			const room = await ChatRoom.fetchById(room_id);
			if (!room) {
				req.flash('error', 'Room not found.');
				return res.redirect('/chat');
			}
			if (room.creator_id !== userId) {
				const member = await ChatRoomMember.fetchMember(
					room_id,
					userId
				);
				if (!member || !member.accepted_at) {
					req.flash('error', 'You are not a member of this room.');
					return res.redirect('/chat');
				}
			}
		} else if (projectName === 'taskmanager') {
			const isOwner = await Project.isOwner(project_id, userId);
			const isCollaborator = await Collaboration.isCollaborator(
				project_id,
				userId
			);
			if (!isOwner && !isCollaborator) {
				req.flash('error', 'You do not have access to this project.');
				return res.redirect('/chat');
			}
		}

		next();
	} catch (err) {
		req.flash('error', 'Failed to validate chat access.');
		errorHandler(err, req, res, next);
		res.redirect('/chat');
	}
}

export async function validateRoomInviteAccess(req, res, next) {
	const { roomId } = req.params;
	const userId = req.user.id;

	try {
		const room = await ChatRoom.fetchById(roomId);
		if (!room) {
			req.flash('error', 'Room not found.');
			return res.redirect('/chat');
		}

		// Allow creator
		if (room.creator_id === userId) {
			return next();
		}

		// Allow accepted member only
		const member = await ChatRoomMember.fetchMember(roomId, userId);
		if (member && member.accepted_at) {
			return next();
		}

		req.flash(
			'error',
			'You are not allowed to invite members to this room.'
		);
		return res.redirect('/chat');
	} catch (err) {
		errorHandler(err, req, res, next);
		req.flash('error', 'Failed to validate invitation permissions.');
		res.redirect('/chat');
	}
}
