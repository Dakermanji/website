//! controllers/indexController.js
export const getIndex = (req, res) => {
	res.render('index', {
		title: 'Home - Dakermanji Web Dev',
	});
};
