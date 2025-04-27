//! public/js/navbar.js

// Initialize tooltips
const tooltipTriggerList = Array.from(
	document.querySelectorAll('[data-bs-toggle="tooltip"]')
);
const tooltips = tooltipTriggerList.map((el) => new bootstrap.Tooltip(el));

// Target all collapsible navbars (in case you have more than one)
const navbarCollapses = document.querySelectorAll('.navbar-collapse');

// Collapse each navbar when clicking anywhere (if open)
document.addEventListener('click', (event) => {
	// Check if clicked inside the Notifications trigger or dropdown
	const isNotificationClick =
		event.target.closest('#notifications-trigger') ||
		event.target.closest('#notifications li');

	if (isNotificationClick) return;

	setTimeout(() => {
		navbarCollapses.forEach((collapseEl) => {
			if (collapseEl.classList.contains('show')) {
				const collapseInstance =
					bootstrap.Collapse.getInstance(collapseEl);
				collapseInstance?.hide();
			}
		});
	}, 10); // Small delay to let Bootstrap animations finish
});
