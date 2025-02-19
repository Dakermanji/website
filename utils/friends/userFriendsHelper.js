//! utils/friends/userFriendsHelper.js

import FollowNotification from '../../models/FollowNotification.js';
import Follow from '../../models/Follow.js';
import Block from '../../models/Block.js';

export const getUserFriends = async (userId) => {
	if (!userId) {
		return {
			notifications: [],
			follows: [],
			followers: [],
			blocks: [],
		};
	}

	// Fetch all user-related data in parallel for better performance
	const [notifications, follows, followers, blocks] = await Promise.all([
		FollowNotification.getNotifications(userId),
		Follow.getFollows(userId),
		Follow.getFollowers(userId),
		Block.getBlocked(userId),
	]);

	return { notifications, follows, followers, blocks };
};
