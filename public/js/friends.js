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

		if (response.ok) {
			followMessage.textContent =
				'If email is in our database, your request was sent successfully!';
			followMessage.className = 'alert alert-success';
			friendEmailInput.value = '';
		} else {
			followMessage.textContent =
				'If email is in our database, your request was sent successfully!';
			followMessage.className = 'alert alert-success';
			friendEmailInput.value = '';
		}
	} catch (error) {
		followMessage.textContent =
			'Failed to send friend request. Please try again later.';
		followMessage.className = 'alert alert-danger';
		console.error('Error sending friend request:', error);
	}
});
