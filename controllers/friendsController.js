//! controllers/friendsController.js

import User from '../models/User.js';
import FollowRequest from '../models/FollowRequest.js';
import Block from '../models/Block.js';
import Follow from '../models/Follow.js';
import FollowNotification from '../models/FollowNotification.js';

import validator from 'validator';
import {
	validateEmail,
	getRecipient,
	checkBlockStatus,
	checkFollowStatus,
	handleMutualFollow,
	createFollowRequest,
} from '../utils/friendsHelper.js';

const GENERIC_MESSAGE =
	'If email is in our database, your request was sent successfully!';

export const addFriend = async (req, res) => {
	try {
		const { email } = req.body;
		const requesterId = req.user.id;

		// Validate email format
		const emailValidationError = validateEmail(email);
		if (emailValidationError)
			return res.status(400).json({ error: emailValidationError });

		// Get recipient
		const recipient = await getRecipient(email);
		if (!recipient)
			return res.status(200).json({ message: GENERIC_MESSAGE });

		const recipientId = recipient.id;
		if (requesterId === recipientId) {
			return res
				.status(400)
				.json({ error: 'You cannot follow yourself.' });
		}

		// Check blocking status
		if (await checkBlockStatus(requesterId, recipientId)) {
			return res.status(403).json({
				error: 'You have blocked this user. Unblock them first.',
			});
		}
		if (await checkBlockStatus(recipientId, requesterId)) {
			return res.status(200).json({ message: GENERIC_MESSAGE });
		}

		// Check follow status
		const followStatus = await checkFollowStatus(requesterId, recipientId);
		if (followStatus) return res.status(400).json({ error: followStatus });

		// Handle mutual follow scenario
		if (await handleMutualFollow(requesterId, recipientId)) {
			return res
				.status(200)
				.json({ message: 'You are now following each other!' });
		}

		// Create follow request
		await createFollowRequest(requesterId, recipientId);
		return res.status(200).json({ message: GENERIC_MESSAGE });
	} catch (error) {
		console.error('Error processing friend request:', error);
		return res.status(500).json({
			error: 'An error occurred while processing your request.',
		});
	}
};
