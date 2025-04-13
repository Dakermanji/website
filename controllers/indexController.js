//! controllers/indexController.js

import { navBar } from '../data/navBar.js';
import { aboutData } from '../data/aboutData.js';
import { servicesData } from '../data/servicesData.js';
import { projects } from '../data/projectsData.js';
import Message from '../models/Message.js';
import { sanitizeInput } from '../middlewares/sanitizeForm.js';
import env from '../config/dotenv.js';

// Handle Get Index Page
export const getIndex = (req, res) => {
	try {
		const token = req.query.token;
		res.render('index', {
			title: `${env.HOST}`,
			navBar: navBar.index,
			about: aboutData,
			services: servicesData,
			projects,
			success_msg: res.locals.success,
			error_msg: res.locals.error,
			resetToken: token,
			styles: ['index/main', 'index/login', 'index/forgot_resend'],
			scripts: [
				'helpers/modalHelper',
				'index/selectors',
				'index/main',
				'index/login',
				'index/forgot_resend',
			],
		});
	} catch (error) {
		console.error('Error loading index page:', error);
		res.status(500).render('error', {
			title: 'Error',
			message: 'Failed to load the homepage.',
		});
	}
};

// Handle Contact Form Submission
export const postMessage = async (req, res) => {
	try {
		const { subject, message } = req.body;

		// Sanitize inputs
		const sanitizedSubject = sanitizeInput(subject);
		const sanitizedMessage = sanitizeInput(message);

		if (!req.isAuthenticated()) {
			req.flash('error', 'Please log in or register to send a message.');
			return res.redirect('/?auth=true');
		}

		await Message.create({
			user_id: req.user.id,
			subject: sanitizedSubject,
			message: sanitizedMessage,
		});

		req.flash('success', 'Your message has been sent successfully!');
		res.redirect('/');
	} catch (error) {
		console.error('Error handling message submission:', error);
		req.flash('error', 'Something went wrong. Please try again.');
		res.redirect('/');
	}
};
