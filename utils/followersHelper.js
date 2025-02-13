//! utils/followersHelper.js

import Follow from '../models/Follow.js';
import {
	blockUser,
	followBackUser,
	unfollowBothUsers,
} from './friendsHelper.js';

// General function to handle notification actions
export const handleFollowersAction = async (followId, userId, action) => {
	const follow = await Follow.getFollowById(followId);

	if (!follow) {
		throw { status: 404, message: 'This follow not found.' };
	}

	if (userId !== follow.followed_id) {
		throw {
			status: 400,
			message: 'Unauthorized: User does not match the followed.',
		};
	}

	if (action === 'block') {
		await blockUser(follow.followed_id, follow.follower_id);
	}

	if (action === 'followBack') {
		await followBackUser(follow.followed_id, follow.follower_id);
	}

	if (action === 'unfollow_both') {
		await unfollowBothUsers(follow.followed_id, follow.follower_id);
	}
};
