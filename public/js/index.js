//! public/js/index.js
// Mouse move effect to adjust transparency around cursor within the hero section
const main = document.querySelector('main');

main.addEventListener('mousemove', (event) => {
	const overlay = main.querySelector('.background-overlay');
	const { clientX: x, clientY: y } = event;

	// Update the position of the radial gradient based on the cursor's position within the hero section
	overlay.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0, 0, 0, 0) 0%, rgba(100, 100, 255, 0.4) 50%)`;
});

// Handle tab switching for the About section
document.querySelectorAll('.tab-links').forEach((tabLink) => {
	tabLink.addEventListener('click', function () {
		// Remove 'active' class from all tab-links and tab-contents
		document
			.querySelectorAll('.tab-links')
			.forEach((link) => link.classList.remove('active'));
		document
			.querySelectorAll('.tab-contents')
			.forEach((content) => content.classList.remove('active-tab'));

		// Add 'active' class to the clicked tab and its content
		this.classList.add('active');
		const targetTab = document.getElementById(this.dataset.tab);
		if (targetTab) {
			targetTab.classList.add('active-tab');
		}
	});
});
