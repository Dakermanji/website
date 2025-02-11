//! public/js/friends.js

const friendsModal = document.getElementById('friends-modal');
const triggerButton = document.getElementById('trigger-friends-modal');
const addFriendButton = document.getElementById('add-friend-btn');
const friendEmailInput = document.getElementById('friend-email');
const followMessage = document.getElementById('follow-message');

// Toggle modal visibility
triggerButton.addEventListener('click', () => {
	friendsModal.classList.toggle('active');
});

// Close modal when clicking outside its content
friendsModal.addEventListener('click', (e) => {
	if (e.target === friendsModal) {
		friendsModal.classList.remove('active');
	}
});

// Handle Add Friend button click
addFriendButton.addEventListener('click', async () => {
	const email = friendEmailInput.value.trim();

	if (!email) {
		followMessage.textContent = 'Please enter an email address.';
		followMessage.className = 'alert alert-warning';
		return;
	}

	try {
		const response = await fetch('/friends/add', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ email }),
		});

		const result = await response.json();

		if (response.ok) {
			followMessage.textContent =
				result.message || 'Request sent successfully!';
			followMessage.className = 'alert alert-success';
		} else {
			followMessage.textContent = result.error || 'An error occurred.';
			followMessage.className = 'alert alert-danger';
		}

		friendEmailInput.value = '';
	} catch (error) {
		followMessage.textContent =
			'Failed to send friend request. Please try again later.';
		followMessage.className = 'alert alert-danger';
		console.error('Error sending friend request:', error);
	}
});

// Function to check if notifications list is empty and insert placeholder
function checkEmptyNotifications() {
	const notificationsList = document.getElementById('notifications-list');
	if (notificationsList.children.length === 0) {
		const emptyNotification = document.createElement('li');
		emptyNotification.classList.add('dropdown-item', 'text-center');
		emptyNotification.textContent = 'No new notifications';
		notificationsList.appendChild(emptyNotification);
	}
}

// Generic function to handle API requests
async function handleRequest(url, method, body = null) {
	try {
		const options = {
			method,
			headers: { 'Content-Type': 'application/json' },
		};
		if (body) options.body = JSON.stringify(body);
		const response = await fetch(url, options);
		return response.ok;
	} catch (error) {
		console.error(`Error with request to ${url}:`, error);
		return false;
	}
}

// Function to remove a notification from the DOM
function removeNotificationElement(notificationId) {
	const notificationElement = document.getElementById(
		`notif-${notificationId}`
	);
	if (notificationElement) {
		notificationElement.remove();
		checkEmptyNotifications();
	}
}

// Function to remove a notification
async function removeNotification(notificationId) {
	if (
		await handleRequest(
			`/followNotifications/remove/${notificationId}`,
			'DELETE'
		)
	) {
		removeNotificationElement(notificationId);
	} else {
		console.error('Failed to remove notification');
	}
}

// Function to accept a follow request
async function acceptFollow(notificationId) {
	if (
		await handleRequest(
			`/followNotifications/accept/${notificationId}`,
			'POST'
		)
	) {
		removeNotificationElement(notificationId);
	} else {
		console.error('Failed to accept follow request');
	}
}

// Function to accept follow request and follow back
async function acceptAndFollowBack(notificationId) {
	if (
		await handleRequest(
			`/followNotifications/acceptAndFollow/${notificationId}`,
			'POST'
		)
	) {
		removeNotificationElement(notificationId);
	} else {
		console.error('Failed to accept follow request');
	}
}
