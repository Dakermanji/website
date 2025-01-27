//! public/js/helpers/modalHelper.js

/**
 * Opens the specified modal.
 * @param {HTMLElement} modal - The modal to open.
 */
const openModal = (modal) => {
	modal.classList.add('active');
};

/**
 * Closes the specified modal.
 * @param {HTMLElement} modal - The modal to close.
 */
const closeModal = (modal) => {
	modal.classList.remove('active');
};

/**
 * Adds click event to close modal when clicking outside of its content.
 * @param {HTMLElement} modal - The modal to attach the event.
 */
const closeModalOnOutsideClick = (modal) => {
	modal?.addEventListener('click', (e) => {
		if (e.target === modal) {
			closeModal(modal);
		}
	});
};
