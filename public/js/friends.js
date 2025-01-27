//! public/js/friends.js

const friendsModal = document.getElementById('friends-modal');
const triggerButton = document.getElementById('trigger-friends-modal');

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
