//! public/js/navbar.js
const tooltipTriggerList = Array.from(
	document.querySelectorAll('[data-bs-toggle="tooltip"]')
);

const tooltips = tooltipTriggerList.map(
	(tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl)
);
