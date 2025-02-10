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

async function removeNotification(notificationId) {
	try {
		// Send DELETE request to backend
		const response = await fetch(
			`/notifications/remove/${notificationId}`,
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);

		if (response.ok) {
			// Remove the notification from the DOM
			const notificationElement = document.getElementById(
				`notif-${notificationId}`
			);
			if (notificationElement) {
				notificationElement.remove();
			}

			// Check if there are any remaining notifications
			const notificationsList =
				document.getElementById('notifications-list');
			if (notificationsList.children.length === 0) {
				// If no notifications remain, insert "No new notifications"
				const emptyNotification = document.createElement('li');
				emptyNotification.classList.add('dropdown-item', 'text-center');
				emptyNotification.textContent = 'No new notifications';
				notificationsList.appendChild(emptyNotification);
			}
		} else {
			console.error('Failed to remove notification');
		}
	} catch (error) {
		console.error('Error removing notification:', error);
	}
}
