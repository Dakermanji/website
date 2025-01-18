//! config/transporter.js

import nodemailer from 'nodemailer';
import env from './dotenv.js';

export const transporter = nodemailer.createTransport({
	service: env.EMAIL_SERVICE,
	auth: {
		user: env.EMAIL_USER,
		pass: env.EMAIL_PASS,
	},
});

export default transporter;
