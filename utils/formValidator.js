//! middlewares/formValidators.js

import validator from 'validator';

export const validateSubject = (subject) => {
	if (validator.isEmpty(subject) || subject.length > 100) {
		return 'Subject is required and must be under 100 characters.';
	}
	return null;
};

export const validateMessage = (message) => {
	if (validator.isEmpty(message) || message.length > 1000) {
		return 'Message is required and must be under 1000 characters.';
	}
	return null;
};

export const validateEmail = (email) => {
	if (!validator.isEmail(email)) {
		return 'Invalid email address.';
	}
	return null;
};

export const validateUsername = (username) => {
	if (validator.isEmpty(username) || username.length < 3) {
		return 'Username must be at least 3 characters long.';
	}
	if (!/^[A-Za-z0-9_.-]+$/.test(username)) {
		return 'Username can only contain letters, numbers, underscores, dots, and hyphens.';
	}
	return null;
};

export const validatePassword = (password) => {
	const passwordStrengthRegex =
		/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@$%^&*()\[\]{}\-_=<>.,:;'"\~`#\\|\/+])[A-Za-z\d!@$%^&*()\[\]{}\-_=<>.,:;'"\~`#\\|\/+]{8,}$/;

	if (!passwordStrengthRegex.test(password)) {
		return 'Password Requirements:<br>- at least 8 characters long.<br>- has one uppercase letter.<br>- has one lowercase letter.<br>- has one number.<br>- has one special character.';
	}
	return null;
};
