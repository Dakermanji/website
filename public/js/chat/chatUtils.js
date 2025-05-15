//! public/js/chat/chatUtils.js

// Virtual RoomId for friends
function getFriendRoomId(userId, friendId) {
	return userId < friendId
		? `friend-${userId}-${friendId}`
		: `friend-${friendId}-${userId}`;
}

// auto-scroll to bottom on new message
function addMessage(sender, message, timestamp, isOwn = false) {
	const div = document.createElement('div');
	div.classList.add('message');
	div.classList.add(isOwn ? 'own' : 'friend');

	const bubble = document.createElement('div');
	bubble.classList.add('message-bubble');
	bubble.textContent = message;

	const time = document.createElement('div');
	time.classList.add('message-time');
	time.textContent = new Date(timestamp).toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit',
	});

	if (isOwn) {
		div.appendChild(time);
		div.appendChild(bubble);
	} else {
		div.appendChild(bubble);
		div.appendChild(time);
	}

	messagesDiv.appendChild(div);
	messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function projectNameToUrl(name) {
	if (name === 'chat') return 'friends';
	if (name === 'room') return 'rooms';
	if (name === 'taskmanager') return 'tasks';
	return '';
}
