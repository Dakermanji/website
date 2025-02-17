//! public/js/flash.js

// Flash Auto-Fade Out
setTimeout(() => {
	document.querySelectorAll('.flash-message').forEach((msg) => {
		msg.classList.add('fade');
		setTimeout(() => msg.remove(), 500);
	});
}, 4000);
