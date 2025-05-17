//! public/js/chat/chatEvents.js

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

sidebarItemsForms.forEach((form) => {
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

// Room Modal
openRoomModalBtn.addEventListener('click', () => {
	roomModal.classList.remove('d-none');
});
closeRoomModalBtn.addEventListener('click', () => {
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

			const form = document.createElement('form');
			form.method = 'POST';
			form.action = '/chat';
			form.classList.add('d-inline');

			form.innerHTML = `
			<input type="hidden" name="projectName" value="room" />
			<input type="hidden" name="room_id" value="${newRoom.id}" />
			<button type="submit" class="btn btn-sub">${newRoom.name}</button>
			`;

			li.appendChild(form);
			roomList.appendChild(li);
		} else {
			alert(result.error || 'Failed to create room');
		}
	} catch (err) {
		console.error(err);
		alert('Something went wrong.');
	}
});

// Member Modal
openMembersBtn?.addEventListener('click', () => {
	membersModal.classList.remove('d-none');
});
closeMembersBtn?.addEventListener('click', () => {
	membersModal.classList.add('d-none');
});
addMemberForm?.addEventListener('submit', async (e) => {
	e.preventDefault();
	const memberId = document.getElementById('memberId').value;
	const roomId = window.chatConfig.roomId;

	try {
		const res = await fetch(`/chat/rooms/${roomId}/members`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ memberId }),
		});
		const json = await res.json();
		if (res.ok) {
			membersModal.classList.add('d-none');
			addMemberForm.reset();
			// Optionally update UI or reload
			location.reload();
		} else {
			alert(json.error || 'Failed to send invitation.');
		}
	} catch (error) {
		console.error(error);
	}
});

// Message
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

// Leave Modal
openLeaveModalBtn?.addEventListener('click', () => {
	leaveModal?.classList.remove('d-none');
});
closeLeaveModalBtn?.addEventListener('click', () => {
	leaveModal?.classList.add('d-none');
});

// Delete Modal
openDeleteModalBtn?.addEventListener('click', () => {
	deleteModal?.classList.remove('d-none');
});
closeDeleteModalBtn?.addEventListener('click', () => {
	deleteModal?.classList.add('d-none');
});
