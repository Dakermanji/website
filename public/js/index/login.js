//! public/js/login.js

// Open Modal
const openModal = () => {
	authModal.classList.add('active');
};

// Close Modal
closeModalBtn.addEventListener('click', () => {
	authModal.classList.remove('active');
});

// Handle query parameter to auto-open modal
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('auth') === 'true') {
	openModal();
}

// Open modal when the button is clicked
openModalBtn.addEventListener('click', openModal);

// Tab Switching
tabs.forEach((tab) => {
	tab.addEventListener('click', () => {
		// Remove active class from all tabs and contents
		tabs.forEach((t) => t.classList.remove('active'));
		tabContents.forEach((content) => content.classList.remove('active'));

		// Activate current tab and corresponding content
		tab.classList.add('active');
		const target = document.getElementById(tab.getAttribute('data-tab'));
		target.classList.add('active');
	});
});

// Colorize Password Requirements
const passwordInput = document.getElementById('register-password');
const requirements = {
	lower: /[a-z]/,
	upper: /[A-Z]/,
	digit: /\d/,
	symbol: /[!@$%^&*()\[\]{}\-_=<>.,:;'"\~`#\\|\/+]/,
	length: /.{8,}/,
};

const updateRequirementState = (input, pattern, elementId) => {
	const requirementElement = document.getElementById(elementId);
	if (pattern.test(input)) {
		requirementElement.classList.add('valid');
		requirementElement.classList.remove('invalid');
	} else {
		requirementElement.classList.remove('valid');
		requirementElement.classList.add('invalid');
	}
};

passwordInput.addEventListener('input', () => {
	const passwordValue = passwordInput.value;

	// Check each requirement
	updateRequirementState(passwordValue, requirements.lower, 'lower');
	updateRequirementState(passwordValue, requirements.upper, 'upper');
	updateRequirementState(passwordValue, requirements.digit, 'digit');
	updateRequirementState(passwordValue, requirements.symbol, 'symbol');
	updateRequirementState(passwordValue, requirements.length, 'psw-length');
});
