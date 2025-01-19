//! utils/resendHelper.js

import validator from 'validator';

import User from '../models/User.js';
import { generateToken, sendEmail } from './authUtilHelper.js';

/**
 * Validates and checks email existence.
 * @param {string} email - The email to validate.
 * @param {object} req - The request object for flashing messages.
 * @param {object} res - The response object for redirection.
 * @returns {object|null} - The user object if validation passes, otherwise null.
 */
export const validateAndFindUser = async (email, req, res) => {
	if (!email || !validator.isEmail(email)) {
		req.flash('error', 'Invalid email address.');
		return res.redirect('/?auth=true');
	}

	const user = await User.findByEmail(email);
	if (!user) {
		req.flash('error', 'No account found with this email.');
		return res.redirect('/?auth=true');
	}

	return user;
};

/**
 * Resend a confirmation email to the user.
 * @param {object} user - The user object to process.
 * @param {string} host - The request host for generating the confirmation URL.
 */
export const resendConfirmationEmail = async (user, host) => {
	const { token, tokenExpiry } = generateToken();
	await User.updateToken(user.id, token, tokenExpiry);

	const confirmUrl = `http://${host}/auth/confirm-email?token=${token}`;
	const emailContent = `
        <h1>Email Confirmation</h1>
        <p>Please click the link below to confirm your email:</p>
        <a href="${confirmUrl}">Confirm Email</a>
    `;

	await sendEmail(user.email, 'Confirm Your Email', emailContent);
};
