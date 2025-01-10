//! controllers/indexController.js

import { navBar } from '../data/navBar.js';
import { aboutData } from '../data/aboutData.js';
export const getIndex = (req, res) => {
	try {
		res.render('index', {
			title: 'Home - Dakermanji Web Dev',
			navBar: navBar.index,
			about: aboutData,
			styles: ['index'],
		});
	} catch (error) {
		console.error('Error loading data:', error);
		res.status(500).send('Error loading data');
	}
};
