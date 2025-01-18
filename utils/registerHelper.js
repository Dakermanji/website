import crypto from 'crypto';
import transporter from '../config/transporter.js';

export const generateToken = () => {
	const token = crypto.randomBytes(32).toString('hex');
	const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24-hour expiry
	return { token, tokenExpiry };
};

export const sendConfirmationEmail = async (email, confirmUrl) => {
	const mailOptions = {
		to: email,
		subject: 'Confirm Your Email',
		html: `
            <h1>Email Confirmation</h1>
            <p>Please click the link below to confirm your email:</p>
            <a href="${confirmUrl}">Confirm Email</a>
        `,
	};

	return transporter.sendMail(mailOptions);
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
