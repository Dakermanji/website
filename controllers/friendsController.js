//! controllers/friendsController.js

import User from '../models/User.js';
import FollowRequest from '../models/FollowRequest.js';
import Block from '../models/Block.js';
import Follow from '../models/Follow.js';
import FollowNotification from '../models/FollowNotification.js';

import validator from 'validator';

const GENERIC_MESSAGE =
	'If email is in our database, your request was sent successfully!';

export const addFriend = async (req, res) => {
	try {
		const { email } = req.body;

		// Validate email format
		if (!email || !validator.isEmail(email)) {
			return res.status(400).json({ error: 'Invalid email format.' });
		}

		const requesterId = req.user.id;

		// Check if user exists in the database
		let recipient;
		try {
			recipient = await User.findByEmail(email);
		} catch (err) {
			console.error('Database error fetching user:', err);
			return res.status(500).json({ error: 'Internal Server Error' });
		}

		if (!recipient) {
			return res.status(200).json({ message: GENERIC_MESSAGE });
		}

		const recipientId = recipient.id;

		if (requesterId === recipientId) {
			return res
				.status(400)
				.json({ error: 'You cannot follow yourself.' });
		}

		// Check if the recipient has blocked the requester
		const isBlockedByRecipient = await Block.checkBlockStatus(
			recipientId,
			requesterId
		);
		if (isBlockedByRecipient) {
			return res.status(200).json({ message: GENERIC_MESSAGE });
		}

		// Check if the requester has blocked the recipient
		const hasBlockedRecipient = await Block.checkBlockStatus(
			requesterId,
			recipientId
		);
		if (hasBlockedRecipient) {
			return res.status(403).json({
				error: 'You have blocked this user. Unblock them first.',
			});
		}

		// Check current follow status
		const followStatus = await Follow.checkFollowStatus(
			requesterId,
			recipientId
		);

		if (followStatus === 'mutual') {
			return res
				.status(400)
				.json({ error: 'You are already following each other.' });
		}
		if (followStatus === 'following') {
			return res
				.status(400)
				.json({ error: 'You are already following this user.' });
		}

		const recipientFollowStatus = await FollowRequest.checkFollowStatus(
			recipientId,
			requesterId
		);

		if (recipientFollowStatus === 'following') {
			return res
				.status(400)
				.json({ error: 'This user is already following you.' });
		}

		const alreadyRequestedFollow = await FollowRequest.checkFollowStatus(
			requesterId,
			recipientId
		);

		if (alreadyRequestedFollow === 'pending') {
			return res.status(400).json({
				error: 'You have already sent a request to this user.',
			});
		}

		const alreadyAPendingFollow = await FollowRequest.checkFollowStatus(
			recipientId,
			requesterId
		);

		if (alreadyAPendingFollow === 'pending') {
			// Convert to mutual follow
			await Follow.createMutualFollow(requesterId, recipientId);
			await FollowRequest.updateFollowRequestStatus(
				recipientId,
				requesterId,
				'mutual request'
			);
			await FollowNotification.createFollowNotification(
				recipientId,
				requesterId,
				'follow_back'
			);

			return res.status(200).json({
				message: 'You are now following each other!',
			});
		}

		// If all checks pass, create a follow request
		await FollowRequest.createFollowRequest(requesterId, recipientId);
		return res.status(200).json({ message: GENERIC_MESSAGE });
	} catch (error) {
		console.error('Error processing friend request:', error);
		return res.status(500).json({
			error: 'An error occurred while processing your request.',
		});
	}
};
