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
