//! utils/friends/followNotificationsHelper.js

import FollowNotification from '../../models/FollowNotification.js';
import FollowRequest from '../../models/FollowRequest.js';
import Follow from '../../models/Follow.js';
import { blockUser, unfollowUser, unfollowBothUsers } from './friendsHelper.js';

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

	// Clean up follow request if applicable
	if (notification.type === 'follow_request') {
		await FollowRequest.deleteFollowRequest(
			notification.sender_id,
			notification.user_id
		);
	}

	// Always delete the notification
	await FollowNotification.deleteNotification(notificationId);

	// Handle specific actions
	switch (action) {
		case 'accept':
			await Follow.createFollow(
				notification.sender_id,
				notification.user_id
			);
			await FollowNotification.createFollowNotification(
				notification.sender_id,
				notification.user_id,
				'follow_accepted'
			);
			break;

		case 'follow_back':
			await Follow.createMutualFollow(
				notification.sender_id,
				notification.user_id
			);
			await FollowNotification.createFollowNotification(
				notification.sender_id,
				notification.user_id,
				'follow_back'
			);
			break;

		case 'block':
			await blockUser(notification.user_id, notification.sender_id);
			break;

		case 'unfollow':
			await unfollowUser(notification.user_id, notification.sender_id);
			break;

		case 'unfollow_both':
			await unfollowBothUsers(
				notification.user_id,
				notification.sender_id
			);
			break;

		default:
			throw {
				status: 400,
				message: `Unsupported action: ${action}`,
			};
	}
};
