//! utils/friends/blockersHelper.js

import Blocks from '../../models/Block.js';
import { createFollowRequest } from './friendsHelper.js';

// General function to handle notification actions
export const handleBlockersAction = async (blockId, userId, action) => {
	const block = await Blocks.getBlockById(blockId);

	if (!block) {
		throw { status: 404, message: 'This block not found.' };
	}

	if (userId !== block.blocker_id) {
		throw {
			status: 400,
			message: 'Unauthorized: User does not match the blcoker.',
		};
	}

	await Blocks.unblockUser(userId, block.blocked_id);

	if (action === 'unblock_follow') {
		createFollowRequest(userId, block.blocked_id);
	}
};
