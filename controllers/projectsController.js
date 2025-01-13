//! controllers/projectsController.js

export const renderProjects = (req, res) => {
	try {
		res.render('projects', {
			title: 'Projects - Dakermanji Web Dev',
			navBar: [],
		});
	} catch (error) {
		console.error('Error rendering projects page:', error);
		res.status(500).send('Internal Server Error');
	}
};
