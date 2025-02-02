//! utils/friendsHelper.js

import User from '../models/User.js';
import FollowRequest from '../models/FollowRequest.js';
import Block from '../models/Block.js';
import Follow from '../models/Follow.js';
import FollowNotification from '../models/FollowNotification.js';

// Validate email format
export const validateEmail = (email) => {
	if (!email || !validator.isEmail(email)) {
		return 'Invalid email format.';
	}
	return null;
};

// Get recipient by email
export const getRecipient = async (email) => {
	try {
		return await User.findByEmail(email);
	} catch (error) {
		console.error('Database error fetching user:', error);
		throw new Error('Internal Server Error');
	}
};

// Check if a user has blocked another user
export const checkBlockStatus = async (blockerId, blockedId) => {
	return await Block.checkBlockStatus(blockerId, blockedId);
};

// Check follow status and return an error message if applicable
export const checkFollowStatus = async (requesterId, recipientId) => {
	const followStatus = await Follow.checkFollowStatus(
		requesterId,
		recipientId
	);
	if (followStatus === 'mutual')
		return 'You are already following each other.';
	if (followStatus === 'following')
		return 'You are already following this user.';

	const recipientFollowStatus = await FollowRequest.checkFollowStatus(
		recipientId,
		requesterId
	);
	if (recipientFollowStatus === 'following')
		return 'This user is already following you.';

	const alreadyRequestedFollow = await FollowRequest.checkFollowStatus(
		requesterId,
		recipientId
	);
	if (alreadyRequestedFollow === 'pending')
		return 'You have already sent a request to this user.';

	return null;
};

// Handle mutual follow scenario
export const handleMutualFollow = async (requesterId, recipientId) => {
	const alreadyAPendingFollow = await FollowRequest.checkFollowStatus(
		recipientId,
		requesterId
	);
	if (alreadyAPendingFollow === 'pending') {
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
		return true;
	}
	return false;
};

// Create a new follow request
export const createFollowRequest = async (requesterId, recipientId) => {
	await FollowRequest.createFollowRequest(requesterId, recipientId);
};
