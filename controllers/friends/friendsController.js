//! controllers/friends/friendsController.js

import {
	validateEmail,
	getRecipient,
	checkBlockStatus,
	checkFollowStatus,
	handleMutualFollow,
	createFollowRequest,
} from '../../utils/friends/friendsHelper.js';
import errorHandler from '../../middlewares/errorHandler.js';

const GENERIC_MESSAGE =
	'If email is in our database, your request was sent successfully!';

export const addFriend = async (req, res, next) => {
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
		next(errorHandler(error, req, res, next));
	}
};
