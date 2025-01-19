//! public/js/navbar.js
const tooltipTriggerList = Array.from(
	document.querySelectorAll('[data-bs-toggle="tooltip"]')
);
const navbarCollapse = document.querySelector('.navbar-collapse');
const navLinks = document.querySelectorAll('.nav-link');

const tooltips = tooltipTriggerList.map(
	(tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
);

// Close the navbar on small screens when a nav-link is clicked
navLinks.forEach((link) => {
	link.addEventListener('click', () => {
		if (navbarCollapse.classList.contains('show')) {
			const bootstrapCollapse =
				bootstrap.Collapse.getInstance(navbarCollapse);
			bootstrapCollapse.hide();
		}
	});
});
