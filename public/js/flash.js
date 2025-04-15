//! public/js/flash.js

setTimeout(() => {
	document.querySelectorAll('.flash-message').forEach((msg) => {
		if (!document.body.contains(msg)) return;

		msg.classList.add('fade');

		msg.addEventListener(
			'transitionend',
			() => {
				msg.remove();
			},
			{ once: true }
		);

		// Fallback in case transitionend doesn’t fire
		setTimeout(() => {
			if (document.body.contains(msg)) {
				msg.remove();
			}
		}, 1000);
	});
}, 4000);

// Reusable flash message creator for AJAX
function showFlashMessage(type, message) {
	const flash = document.createElement('div');
	flash.className = `flash-message alert alert-${type} alert-dismissible show text-center`;
	flash.setAttribute('role', 'alert');
	flash.innerHTML = `
		${message}
		<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
	`;

	document.body.appendChild(flash);

	setTimeout(() => {
		flash.classList.add('fade');
		flash.addEventListener('transitionend', () => flash.remove(), {
			once: true,
		});

		setTimeout(() => {
			if (document.body.contains(flash)) flash.remove();
		}, 1000);
	}, 4000);
}
