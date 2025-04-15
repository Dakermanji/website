//! public/js/flash.js

setTimeout(() => {
	document.querySelectorAll('.flash-message').forEach((msg) => {
		// Skip if message isn't visible (e.g., modal is closed)
		if (!msg.offsetParent) return;

		// Add fade class
		msg.classList.add('fade');

		// Remove after fade completes
		msg.addEventListener(
			'transitionend',
			() => {
				msg.remove();
			},
			{ once: true }
		);

		// Fallback removal if transitionend doesn't fire
		setTimeout(() => {
			if (document.body.contains(msg)) msg.remove();
		}, 1000);
	});
}, 4000);
