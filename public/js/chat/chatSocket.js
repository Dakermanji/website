//! public/js/chat/chatSocket.js

socket.on('connect', () => {
	const actualRoomId = isFriendChat
		? getFriendRoomId(window.chatConfig.userId, roomId)
		: roomId;
	socket.emit('joinRoom', actualRoomId); // join room after socket is actually ready
});

// On message received (via socket.io)
socket.on('chatMessage', (data) => {
	const existing = Array.from(messagesDiv.children).some((msgEl) =>
		msgEl.textContent.includes(data.message)
	);

	if (!existing) {
		const isOwn = data.user_id === window.chatConfig.userId;
		addMessage(
			data.username,
			data.message,
			data.created_at || data.time,
			isOwn
		);
	}
});

function getFriendRoomId(userId, friendId) {
	return userId < friendId
		? `friend-${userId}-${friendId}`
		: `friend-${friendId}-${userId}`;
}
