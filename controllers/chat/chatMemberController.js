//! controllers/chat/chatMemberController.js

import ChatRoom from '../../models/ChatRoom.js';
import ChatRoomMember from '../../models/ChatRoomMember.js';
import Notification from '../../models/Notification.js';
import { createNotification } from '../../utils/notificationHelper.js';

export const addRoomMember = async (req, res) => {
	const { roomId } = req.params;
	const { memberId } = req.body;
	const userId = req.user.id;

	try {
		const room = await ChatRoom.fetchById(roomId);

		if (!room) {
			return res.status(404).json({ error: 'Room not found.' });
		}

		// Prevent inviting the creator
		if (room.creator_id === memberId) {
			return res.status(400).json({
				error: 'The room creator is already part of the room.',
			});
		}

		// Prevent inviting existing member
		const existing = await ChatRoomMember.isMember(roomId, memberId);
		if (existing) {
			return res.status(400).json({
				error: 'User is already a member or already invited.',
			});
		}

		// Insert invitation (pending acceptance)
		await ChatRoomMember.addMember(roomId, memberId);

		// Create the notification
		await createNotification({
			project: 'chat_room_invite',
			notifierId: userId,
			notifiedId: memberId,
			description: `You have been invited to join room <strong>${room.name}</strong>.`,
			link: `/chat/rooms/${room.id}`,
		});

		res.status(201).json({ message: 'Invitation sent successfully.' });
	} catch (err) {
		console.error('Error sending room invitation:', err);
		res.status(500).json({ error: 'Failed to send invitation.' });
	}
};

export const acceptRoomInvite = async (req, res) => {
	const { notificationId } = req.body;
	const { roomId } = req.params;
	const userId = req.user.id;

	try {
		const notification = await Notification.getNotificationByIdForAUser(
			notificationId,
			userId
		);

		if (
			!notification ||
			notification.project !== 'chat_room_invite' ||
			notification.notified_id !== userId
		) {
			req.flash('error', 'Invalid or unauthorized room invite.');
			return res.redirect('/chat');
		}

		// Update accepted_at for this user in that room
		await ChatRoomMember.acceptMember(roomId, userId);

		await Notification.markAsRead(notificationId);

		req.flash('success', 'You have joined the room.');
		res.redirect('/chat');
	} catch (err) {
		console.error('Error accepting room invite:', err);
		req.flash('error', 'Failed to join the room.');
		res.redirect('/chat');
	}
};

export const declineRoomInvite = async (req, res) => {
	const { notificationId } = req.body;
	const { roomId } = req.params;
	const userId = req.user.id;

	try {
		const notification = await Notification.getNotificationByIdForAUser(
			notificationId,
			userId
		);

		if (
			!notification ||
			notification.project !== 'chat_room_invite' ||
			notification.notified_id !== userId
		) {
			req.flash('error', 'Invalid or unauthorized decline.');
			return res.redirect('/chat');
		}

		// Delete the row from chat_room_members
		await ChatRoomMember.removeMember(roomId, userId);

		await Notification.markAsRead(notificationId);

		req.flash('success', 'You declined the room invitation.');
		res.redirect('/chat');
	} catch (err) {
		console.error('Error declining room invite:', err);
		req.flash('error', 'Failed to decline the invitation.');
		res.redirect('/chat');
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

		if (member.blocked) {
			req.flash('error', 'Room not found.');
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

export const toggleRoomBlock = async (req, res) => {
	const { roomId } = req.params;
	const { user_id, block } = req.body;
	const userId = req.user.id;

	try {
		const room = await ChatRoom.fetchById(roomId);

		if (!room) {
			req.flash('error', 'Room not found.');
			return res.redirect('/chat');
		}

		// Only the creator can block/unblock members
		if (room.creator_id !== userId) {
			req.flash('error', 'Only the room creator can block members.');
			return res.redirect('/chat');
		}

		if (user_id === userId) {
			req.flash('error', 'You cannot block yourself.');
			return res.redirect('/chat');
		}

		const member = await ChatRoomMember.fetchMember(roomId, user_id);
		if (!member || !member.accepted_at) {
			req.flash(
				'error',
				'That user is not an accepted member of this room.'
			);
			return res.redirect('/chat');
		}

		await ChatRoomMember.setBlocked(roomId, user_id, block === '1' ? 1 : 0);

		req.flash(
			'success',
			`User has been ${
				block === '1' ? 'blocked' : 'unblocked'
			} successfully.`
		);
		res.redirect('/chat');
	} catch (err) {
		console.error('Block/unblock error:', err);
		req.flash('error', 'Failed to update block status.');
		res.redirect('/chat');
	}
};

export const removeRoomMember = async (req, res) => {
	const { roomId } = req.params;
	const { user_id } = req.body;
	const userId = req.user.id;

	try {
		const room = await ChatRoom.fetchById(roomId);

		if (!room) {
			req.flash('error', 'Room not found.');
			return res.redirect('/chat');
		}

		// Only the creator can remove members
		if (room.creator_id !== userId) {
			req.flash('error', 'Only the room creator can remove members.');
			return res.redirect('/chat');
		}

		if (user_id === userId) {
			req.flash(
				'error',
				'You cannot remove yourself from your own room.'
			);
			return res.redirect('/chat');
		}

		const member = await ChatRoomMember.fetchMember(roomId, user_id);
		if (!member) {
			req.flash('error', 'That user is not a member of this room.');
			return res.redirect('/chat');
		}

		await ChatRoomMember.removeMember(roomId, user_id);

		req.flash('success', 'User has been removed from the room.');
		res.redirect('/chat');
	} catch (err) {
		console.error('Remove member error:', err);
		req.flash('error', 'Failed to remove user.');
		res.redirect('/chat');
	}
};
