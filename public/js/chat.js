//! public/js/chat.js

const socket = io();
const roomModal = document.getElementById('room-modal');
const openModalBtn = document.getElementById('open-room-modal');
const closeModalBtn = document.querySelector('.close-modal');
const roomForm = document.getElementById('room-form');
const roomNameInput = document.getElementById('room-name');
const form = document.getElementById('messageForm');
const input = document.getElementById('messageInput');
const messagesDiv = document.getElementById('messages');
const roomId = window.chatConfig?.roomId;
const projectName = window.chatConfig?.projectName;
const username = window.chatConfig?.username;
const links = document.querySelectorAll('.sidebar-item a');
const toggles = document.querySelectorAll('.toggle-section');
const isFriendChat = projectName === 'chat';
const actualRoomId = isFriendChat
	? getFriendRoomId(window.chatConfig.userId, roomId)
	: roomId;

socket.on('connect', () => {
	socket.emit('joinRoom', actualRoomId); // join room after socket is actually ready
});

// Virtual RoomId for friends
function getFriendRoomId(userId, friendId) {
	return userId < friendId
		? `friend-${userId}-${friendId}`
		: `friend-${friendId}-${userId}`;
}

// Toggle sidebar sections
toggles.forEach((toggle) => {
	toggle.addEventListener('click', () => {
		const targetId = toggle.getAttribute('data-target');
		const targetList = document.getElementById(targetId);
		if (targetList) {
			targetList.classList.toggle('expanded');
		}
	});
});

document.querySelectorAll('.sidebar-item form').forEach((form) => {
	const projectInput = form.querySelector('input[name="projectName"]');
	const receiverInput =
		form.querySelector('input[name="friend_id"]') ||
		form.querySelector('input[name="room_id"]') ||
		form.querySelector('input[name="project_id"]');

	if (
		projectInput?.value === projectName &&
		receiverInput?.value === roomId
	) {
		form.querySelector('button')?.classList.add('active');

		// Expand the parent section too
		const parentList = form.closest('ul.sidebar-items');
		if (parentList) parentList.classList.add('expanded');
	}
});

openModalBtn.addEventListener('click', () => {
	roomModal.classList.remove('d-none');
});

closeModalBtn.addEventListener('click', () => {
	roomModal.classList.add('d-none');
});

roomForm.addEventListener('submit', async (e) => {
	e.preventDefault();
	const name = roomNameInput.value.trim();
	if (!name) return;

	try {
		const response = await fetch('/chat/rooms/create', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name }),
		});

		const result = await response.json();
		if (response.ok) {
			const newRoom = result.room;

			// Close modal
			roomModal.classList.add('d-none');
			roomNameInput.value = '';

			// Expand list if collapsed
			const roomList = document.getElementById('rooms-list');
			roomList.classList.remove('d-none');

			// Add new room to DOM
			const li = document.createElement('li');
			li.classList.add('sidebar-item');
			const link = document.createElement('a');
			link.href = `/chat/rooms/${newRoom.id}`;
			link.textContent = newRoom.name;
			li.appendChild(link);
			roomList.appendChild(li);
		} else {
			alert(result.error || 'Failed to create room');
		}
	} catch (err) {
		console.error(err);
		alert('Something went wrong.');
	}
});

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

// On form submit
form?.addEventListener('submit', async (e) => {
	e.preventDefault();
	const message = input.value.trim();
	if (!message) return;

	await fetch(`/chat/${projectNameToUrl(projectName)}/${roomId}/messages`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ message }),
	});
	input.value = '';
});

function projectNameToUrl(name) {
	if (name === 'chat') return 'friends';
	if (name === 'room') return 'rooms';
	if (name === 'taskmanager') return 'tasks';
	return '';
}

if (form) {
	// Fetch and display previous messages
	(async () => {
		try {
			const response = await fetch(
				`/chat/${projectNameToUrl(projectName)}/${roomId}/messages`
			);

			const messages = await response.json();
			messages.forEach((msg) => {
				const isOwn = msg.user_id === window.chatConfig.userId;
				addMessage(msg.username, msg.message, msg.created_at, isOwn);
			});
		} catch (err) {
			console.error('Failed to load messages:', err);
		}
	})();
}
