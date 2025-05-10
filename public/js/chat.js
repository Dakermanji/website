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
