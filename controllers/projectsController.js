//! controllers/projectsController.js

import { navBar } from '../data/navBar.js';

export const renderProjects = (req, res) => {
	try {
		res.render('projects', {
			title: 'Projects - Dakermanji Web Dev',
			navBar: navBar.projects,
			styles: ['friends'],
			scripts: ['helpers/modalHelper', 'friends'],
		});
	} catch (error) {
		console.error('Error rendering projects page:', error);
		res.status(500).send('Internal Server Error');
	}
};
