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
