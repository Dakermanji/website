//! public/js/chat/chatSocket.js

socket.on('connect', () => {
	const actualRoomId = isFriendChat
		? getFriendRoomId(window.chatConfig.userId, roomId)
		: roomId;
	socket.emit('joinRoom', actualRoomId); // join room after socket is actually ready
});

// On message received
socket.on('chatMessage', (data) => {
	const existing = Array.from(messagesDiv.children).some((msgEl) =>
		msgEl.textContent.includes(data.message)
	);

	if (!existing) {
		const isOwn = data.user_id === window.chatConfig.userId;
		const blockedMembers = window.chatConfig.blockedMembers || [];
		const isBlocked = blockedMembers.includes(data.user_id);

		// DOM-based check: was the last message from the same user?
		const lastMessage = messagesDiv.querySelector('.message:last-child');
		const lastSenderId = lastMessage?.dataset.userId;
		const shouldShowSender =
			projectName !== 'chat' && !isOwn && data.user_id !== lastSenderId;

		addMessage(
			data.user_id,
			data.username,
			data.message,
			data.created_at || data.time,
			isOwn,
			isBlocked,
			shouldShowSender
		);
	}
});

// Show typing indicator on client
socket.on('typing', ({ users }) => {
	if (!users || users.length === 0) {
		typingIndicator.textContent = '';
		return;
	}

	const otherUsers = users.filter((u) => u !== user);
	if (otherUsers.length === 0) {
		typingIndicator.textContent = '';
		return;
	}

	let text = '';
	if (otherUsers.length === 1) {
		text = `${otherUsers[0]} is typing...`;
	} else if (otherUsers.length === 2) {
		text = `${otherUsers[0]} and ${otherUsers[1]} are typing...`;
	} else {
		text = `${otherUsers.length} people are typing...`;
	}

	typingIndicator.textContent = `✍🏻 ${text}`;
});
