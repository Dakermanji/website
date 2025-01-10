//! config/middleware.js
import express from 'express';
import expressLayouts from 'express-ejs-layouts';

// Helper function to log middleware errors
function logMiddlewareErrors(middleware) {
	return (req, res, next) => {
		try {
			middleware(req, res, next);
		} catch (err) {
			console.error(`[Middleware Error]: ${err.message}`);
			next(err); // Forward the error to the error handler
		}
	};
}

const applyMiddlewares = (app) => {
	// Body parsing middlewares
	app.use(logMiddlewareErrors(express.urlencoded({ extended: true }))); // For form submissions

	app.use(logMiddlewareErrors(express.json())); // For JSON payloads

	// Static files
	app.use(logMiddlewareErrors(express.static('public'))); // Serve static files

	// EJS Layouts
	app.use(logMiddlewareErrors(expressLayouts)); // Enable EJS layouts

	// Set the view engine
	app.set('view engine', 'ejs');
	app.set('views', './views');

	// Custom middlewares:
	app.use((req, res, next) => {
		res.locals.currentRoute = req.path;
		next();
	});
};

export default applyMiddlewares;
