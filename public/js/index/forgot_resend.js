//! public/js/index/forgot_resend.js

// Event Listeners
openUtilityModalBtn?.addEventListener('click', () =>
	openModal(authUtilityModal)
);
closeUtilityModalBtn?.addEventListener('click', () =>
	closeModal(authUtilityModal)
);

// Close modal when clicking outside
authUtilityModal?.addEventListener('click', (e) => {
	if (e.target === authUtilityModal) {
		closeModal(authUtilityModal);
	}
});
