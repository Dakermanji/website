//! utils/friends/followsHelper.js

import Follow from '../../models/Follow.js';
import { blockUser, unfollowUser, unfollowBothUsers } from './friendsHelper.js';

// General function to handle notification actions
export const handleFollowsAction = async (followId, userId, action) => {
	const follow = await Follow.getFollowById(followId);

	if (!follow) {
		throw { status: 404, message: 'This follow not found.' };
	}

	if (userId !== follow.follower_id) {
		throw {
			status: 400,
			message: 'Unauthorized: User does not match the follower.',
		};
	}

	switch (action) {
		case 'block':
			await blockUser(follow.follower_id, follow.followed_id);
			break;

		case 'unfollow':
			await unfollowUser(follow.follower_id, follow.followed_id);
			break;

		case 'unfollow_both':
			await unfollowBothUsers(follow.followed_id, follow.follower_id);
			break;

		default:
			throw {
				status: 400,
				message: `Unsupported action: ${action}`,
			};
	}
};
