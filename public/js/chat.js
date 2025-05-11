//! public/js/chat.js

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

// Toggle sidebar sections
toggles.forEach((toggle) => {
	toggle.addEventListener('click', () => {
		const targetId = toggle.getAttribute('data-target');
		const targetList = document.getElementById(targetId);
		if (targetList) {
			targetList.classList.toggle('d-none');
		}
	});
});

// auto-expand "active" section
links.forEach((link) => {
	if (link.href === window.location.href) {
		link.classList.add('active');
		const parentList = link.closest('ul.sidebar-items');
		if (parentList) parentList.classList.remove('d-none');
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
function addMessage(sender, message, time) {
	const div = document.createElement('div');
	div.classList.add('message');
	div.innerHTML = `<strong>${sender}:</strong> ${message} <small>${new Date(
		time
	).toLocaleTimeString()}</small>`;
	messagesDiv.appendChild(div);
	messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// On message received (via socket.io)
socket.on('chatMessage', (data) => {
	addMessage(data.username, data.message, data.time);
});

// On form submit
form.addEventListener('submit', async (e) => {
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

if (!document.getElementById('messages')) return; // no chat selected

function projectNameToUrl(name) {
	if (name === 'chat_app') return 'friends';
	if (name === 'chat_app_room') return 'rooms';
	if (name === 'taskmanager') return 'tasks';
	return '';
}
