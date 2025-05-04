//! utils/chatHelper.js

export const canSendMessage = async (projectName, receiverId, userId) => {
	if (projectName === 'chat_app') {
		// TODO: Validate friendship
		return true;
	}

	if (projectName === 'chat_app_room') {
		// TODO: Validate if user is a member in the chat room
		return true;
	}

	if (projectName === 'taskmanager') {
		// TODO: Validate if user is owner or collaborator
		return true;
	}

	return false;
};

export const formatMessage = (message, user) => {
	return {
		id: message.id,
		user_id: message.user_id,
		username: user.display_name, // assuming user has display_name
		message: message.message,
		created_at: message.created_at || new Date(),
	};
};
