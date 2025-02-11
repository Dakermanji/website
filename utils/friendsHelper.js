//! utils/friendsHelper.js

import User from '../models/User.js';
import FollowRequest from '../models/FollowRequest.js';
import Block from '../models/Block.js';
import Follow from '../models/Follow.js';
import FollowNotification from '../models/FollowNotification.js';
import validator from 'validator';

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
	// Check if the requester is already following the recipient
	const followStatus = await Follow.checkFollowStatus(
		requesterId,
		recipientId
	);

	if (followStatus === 'mutual')
		// If both users follow each other, return mutual status
		return 'You are already following each other.';

	if (followStatus === 'following')
		// If requester is already following the recipient, return message
		return 'You are already following this user.';

	// Check if requester has already sent a follow request to the recipient
	const alreadyRequestedFollow = await FollowRequest.isRequestExists(
		requesterId,
		recipientId
	);
	if (alreadyRequestedFollow)
		// If there's an there is an existing follow request, notify the user
		return 'You have already sent a request to this user.';

	// If no relationship exists, return null (meaning the request can proceed)
	return null;
};

// Handle mutual follow scenario
export const handleMutualFollow = async (requesterId, recipientId) => {
	const alreadyAPendingFollow = await FollowRequest.isRequestExists(
		recipientId,
		requesterId
	);
	if (alreadyAPendingFollow) {
		await Follow.createMutualFollow(requesterId, recipientId);
		await FollowRequest.deleteFollowRequest(recipientId, requesterId);
		await FollowNotification.deleteNotificationByUserAndSenderIds(
			requesterId,
			recipientId
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
	await FollowNotification.createFollowNotification(
		recipientId,
		requesterId,
		'follow_request'
	);
};

// Create a new follow request
export const blockUser = async (blockerId, blockedId) => {
	// Ddlete follows
	await Follow.removeFollow(blockerId, blockedId);
	await Follow.removeFollow(blockedId, blockerId);

	// Delete notifications
	await FollowNotification.deleteNotificationByUserAndSenderIds(
		blockedId,
		blockerId
	);
	await FollowNotification.deleteNotificationByUserAndSenderIds(
		blockerId,
		blockedId
	);

	// Create a block
	await Block.blockUser(blockerId, blockedId);
};
