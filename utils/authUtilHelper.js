//! utils/authUtilHelper.js

import crypto from 'crypto';
import transporter from '../config/transporter.js';

/**
 * Generate a secure token and expiry date.
 * @returns {object} - The generated token and expiry.
 */
export const generateToken = () => {
	const token = crypto.randomBytes(32).toString('hex');
	const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24-hour expiry
	return { token, tokenExpiry };
};

/**
 * Send an email using the transporter.
 * @param {string} to - Recipient email address.
 * @param {string} subject - Email subject.
 * @param {string} html - Email content in HTML format.
 */
export const sendEmail = async (to, subject, html) => {
	const mailOptions = { to, subject, html };
	await transporter.sendMail(mailOptions);
};
