//! public/js/index/login.js

// Handle modal open/close from query parameters
const handleModalFromQuery = () => {
	if (urlParams.get('auth') === 'true') {
		openModal(authModal);
	} else if (urlParams.get('reset') === 'true') {
		openModal(resetPasswordModal);
	}
};

// Handle Tab Switching
const handleTabSwitching = () => {
	tabs.forEach((tab) => {
		tab.addEventListener('click', () => {
			// Deactivate all tabs and contents
			tabs.forEach((t) => t.classList.remove('active'));
			tabContents.forEach((content) =>
				content.classList.remove('active')
			);

			// Activate current tab and corresponding content
			tab.classList.add('active');
			const target = document.getElementById(
				tab.getAttribute('data-tab')
			);
			if (target) {
				target.classList.add('active');
			}
		});
	});
};

// Event Listeners
openModalBtn?.addEventListener('click', () => openModal(authModal));
closeModalBtn?.addEventListener('click', () => closeModal(authModal));

// Handle query parameters
handleModalFromQuery();

// Tab switching logic
handleTabSwitching();
