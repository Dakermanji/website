// Open Modal
openUtilityModalBtn.addEventListener('click', () => {
	authUtilityModal.classList.add('active');
});

// Close Modal
closeUtilityModalBtn.addEventListener('click', () => {
	authUtilityModal.classList.remove('active');
});

// Close modal when clicking outside of content
authUtilityModal.addEventListener('click', (e) => {
	if (e.target === authUtilityModal) {
		authUtilityModal.classList.remove('active');
	}
});
