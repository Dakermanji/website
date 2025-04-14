//! utils/friends/followersHelper.js

import Follow from '../../models/Follow.js';
import {
	blockUser,
	followBackUser,
	unfollowBothUsers,
} from './friendsHelper.js';

// General function to handle follower actions
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

	switch (action) {
		case 'block':
			await blockUser(follow.followed_id, follow.follower_id);
			break;

		case 'followBack':
			await followBackUser(follow.followed_id, follow.follower_id);
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
