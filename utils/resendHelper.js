//! utils/resendHelper.js

import crypto from 'crypto';
import transporter from '../config/transporter.js';
import validator from 'validator';
import User from '../models/User.js';

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
 * Sends a confirmation email to the user.
 * @param {object} user - The user object.
 * @param {string} host - The request host for generating the confirmation URL.
 */
export const resendConfirmationEmail = async (user, host) => {
	const token = crypto.randomBytes(32).toString('hex');
	const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24-hour expiry

	await User.updateToken(user.id, token, tokenExpiry);

	const confirmUrl = `http://${host}/auth/confirm-email?token=${token}`;
	const mailOptions = {
		to: user.email,
		subject: 'Confirm Your Email',
		html: `
            <h1>Email Confirmation</h1>
            <p>Please click the link below to confirm your email:</p>
            <a href="${confirmUrl}">Confirm Email</a>
        `,
	};

	return transporter.sendMail(mailOptions);
};
