//! middlewares\flashMiddleware.js

import flash from 'express-flash';

export const initializeFlash = (app) => {
	// Initialize flash middleware
	app.use(flash());

	// Add flash messages to response locals for rendering in views
	app.use((req, res, next) => {
		res.locals.success = req.flash('success'); // Success messages
		res.locals.error = req.flash('error'); // Error messages
		next();
	});
};
