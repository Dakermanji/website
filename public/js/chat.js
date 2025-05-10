//! public/js/chat.js

document.addEventListener('DOMContentLoaded', () => {
	console.log('Chat index page loaded');

	// Example: highlight current active chat link
	const links = document.querySelectorAll('.sidebar-item a');
	links.forEach((link) => {
		if (link.href === window.location.href) {
			link.classList.add('active');
		}
	});
});

//! public/js/chat.js

document.addEventListener('DOMContentLoaded', () => {
	console.log('Chat index page loaded');

	// Toggle sidebar sections
	const toggles = document.querySelectorAll('.toggle-section');
	toggles.forEach((toggle) => {
		toggle.addEventListener('click', () => {
			const targetId = toggle.getAttribute('data-target');
			const targetList = document.getElementById(targetId);
			if (targetList) {
				targetList.classList.toggle('d-none');
			}
		});
	});

	// Optional: auto-expand "active" section
	const links = document.querySelectorAll('.sidebar-item a');
	links.forEach((link) => {
		if (link.href === window.location.href) {
			link.classList.add('active');
			const parentList = link.closest('ul.sidebar-items');
			if (parentList) parentList.classList.remove('d-none');
		}
	});
});

//! Add to chat.js (inside DOMContentLoaded)

const roomModal = document.getElementById('room-modal');
const openModalBtn = document.getElementById('open-room-modal');
const closeModalBtn = document.querySelector('.close-modal');
const roomForm = document.getElementById('room-form');
const roomNameInput = document.getElementById('room-name');

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
