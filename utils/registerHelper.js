//! utils/registerHelper.js

import { generateToken, sendEmail } from './authUtilHelper.js';
import User from '../models/User.js';

/**
 * Handle registration logic and email confirmation.
 * @param {object} user - The user object to process.
 * @param {string} host - The request host for generating the confirmation URL.
 */
export const handleRegistration = async (user, host) => {
	const { token, tokenExpiry } = generateToken();
	await User.updateToken(user.id, token, tokenExpiry);

	const confirmUrl = `https://${host}/auth/confirm-email?token=${token}`;
	const emailContent = `
        <h1>Welcome to Dakermanji Web Dev</h1>
        <p>Please confirm your email address by clicking the link below:</p>
        <a href="${confirmUrl}">Confirm Email</a>
    `;

	await sendEmail(user.email, 'Confirm Your Email', emailContent);
};

export const handleExistingUser = (existingUser, req, res) => {
	let registrationMethods = [];
	if (existingUser.hashed_password) registrationMethods.push('locally');
	if (existingUser.google_id) registrationMethods.push('Google');
	if (existingUser.github_id) registrationMethods.push('GitHub');

	const methodsMessage = registrationMethods.join(' and ');
	let suggestion = '';

	if (
		registrationMethods.includes('Google') ||
		registrationMethods.includes('GitHub')
	) {
		suggestion = '<br />Please log in using the appropriate method.';
	} else if (registrationMethods.includes('locally')) {
		suggestion = '<br />Please log in using your email and password.';
	}

	req.flash(
		'error',
		`This email is already registered via ${methodsMessage}.${suggestion}<br />If you want to set a password, please use forgot password.`
	);
	return res.redirect('/?auth=true');
};
