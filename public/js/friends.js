//! public/js/friends.js

const friendsModal = document.getElementById('friends-modal');
const triggerButton = document.getElementById('trigger-friends-modal');
const addFriendButton = document.getElementById('add-friend-btn');
const friendEmailInput = document.getElementById('friend-email');
const followMessage = document.getElementById('follow-message');
const errorMessages = {
	removeNotification: 'Failed to remove notification',
	acceptFollowRequest: 'Failed to accept follow request',
	acceptRequestAndFollowFollowBack:
		'Failed to accept follow request and follow back',
	block: 'Failed to block user',
	unfollow: 'Failed to unfollow user',
	unfollowBoth: 'Failed to unfollow both users',
	notsure: 'Sorry, something went wrong.',
};

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

// Function to restore the friends panel state on page load
document.addEventListener('DOMContentLoaded', () => {
	if (sessionStorage.getItem('friendsPanelOpen') === 'true') {
		document.getElementById('friends-modal').classList.add('active');
		sessionStorage.removeItem('friendsPanelOpen'); // Reset state after applying
	}
});

// Function to reload the page while keeping the friends panel open
function refreshWithFriendsPanel() {
	sessionStorage.setItem('friendsPanelOpen', 'true');
	location.reload();
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

// Function to remove a notification
async function removeNotification(notificationId) {
	if (
		await handleRequest(
			`/followNotifications/remove/${notificationId}`,
			'DELETE'
		)
	) {
		refreshWithFriendsPanel();
	} else {
		console.error(errorMessages.removeNotification);
	}
}

async function followNotificationsAction(action, notificationId) {
	if (
		[
			'accept',
			'acceptAndFollow',
			'block',
			'unfollow',
			'unfollowBoth',
		].includes(action)
	) {
		if (
			await handleRequest(
				`/followNotifications/${action}/${notificationId}`,
				'POST'
			)
		) {
			refreshWithFriendsPanel();
		} else {
			console.log(errorMessages[action] || errorMessages.notsure);
		}
	} else {
		console.error(errorMessages.notsure);
	}
}

async function followsAction(action, followId) {
	if (['unfollow', 'unfollowBoth', 'block'].includes(action)) {
		if (await handleRequest(`/follows/${action}/${followId}`, 'POST')) {
			refreshWithFriendsPanel();
		} else {
			console.log(errorMessages[action] || errorMessages.notsure);
		}
	} else {
		console.error(errorMessages.notsure);
	}
}

async function followersAction(action, followId) {
	if (['followBack', 'unfollowBoth', 'block'].includes(action)) {
		if (await handleRequest(`/followers/${action}/${followId}`, 'POST')) {
			refreshWithFriendsPanel();
		} else {
			console.log(errorMessages[action] || errorMessages.notsure);
		}
	} else {
		console.error(errorMessages.notsure);
	}
}
