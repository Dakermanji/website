//! controllers/indexController.js

import { navBar } from '../data/navBar.js';
import { aboutData } from '../data/aboutData.js';
import { servicesData } from '../data/servicesData.js';
import { projects } from '../data/projectsData.js';
import Message from '../models/Message.js';

// Handle Get Index Page
export const getIndex = (req, res) => {
	try {
		res.render('index', {
			title: 'Home - Dakermanji Web Dev',
			navBar: navBar.index,
			about: aboutData,
			services: servicesData,
			projects,
			success_msg: res.locals.success,
			error_msg: res.locals.error,
			styles: ['index'],
			scripts: ['index'],
		});
	} catch (error) {
		console.error('Error loading data:', error);
		res.status(500).send('Error loading data');
	}
};

// Handle Contact Form Submission
export const postMessage = async (req, res) => {
	try {
		const { name, email, message } = req.body;

		// Save the sanitized and validated data to the database
		await Message.create({ name, email, message });

		req.flash('success', 'Your message has been sent successfully!');
		res.redirect('/');
	} catch (error) {
		console.error('Error handling message submission:', error);
		req.flash('error', 'Something went wrong. Please try again.');
		res.redirect('/');
	}
};
