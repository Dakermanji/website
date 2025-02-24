//! utils/friends/followNotificationsHelper.js

import FollowNotification from '../../models/FollowNotification.js';
import FollowRequest from '../../models/FollowRequest.js';
import Follow from '../../models/Follow.js';
import { blockUser, unfollowUser, unfollowBothUsers } from './friendsHelper.js';
// General function to handle notification actions
export const handleFollowNotificationAction = async (
	notificationId,
	userId,
	action
) => {
	const notification = await FollowNotification.getNotificationById(
		notificationId
	);

	if (!notification) {
		throw { status: 404, message: 'Notification not found.' };
	}

	if (userId !== notification.user_id) {
		throw {
			status: 401,
			message:
				'Unauthorized: User does not match notification recipient.',
		};
	}

	if (notification.type === 'follow_request') {
		await FollowRequest.deleteFollowRequest(
			notification.sender_id,
			notification.user_id
		);
	}

	await FollowNotification.deleteNotification(notificationId);

	if (action === 'accept') {
		await Follow.createFollow(notification.sender_id, notification.user_id);
		await FollowNotification.createFollowNotification(
			notification.sender_id,
			notification.user_id,
			'follow_accepted'
		);
	}

	if (action === 'follow_back') {
		await Follow.createMutualFollow(
			notification.sender_id,
			notification.user_id
		);
		await FollowNotification.createFollowNotification(
			notification.sender_id,
			notification.user_id,
			'follow_back'
		);
	}

	if (action === 'block') {
		await blockUser(notification.user_id, notification.sender_id);
	}

	if (action === 'unfollow') {
		await unfollowUser(notification.user_id, notification.sender_id);
	}

	if (action === 'unfollow_both') {
		await unfollowBothUsers(notification.user_id, notification.sender_id);
	}
};
