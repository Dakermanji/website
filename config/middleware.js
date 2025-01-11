//! config/middleware.js
import express from 'express';
import expressLayouts from 'express-ejs-layouts';
import session from 'express-session';
import flash from 'connect-flash';
import env from './dotenv.js';

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

	app.use(
		session({
			secret: env.SESSION_SECRET, // Replace with a strong, unique secret
			resave: false, // Avoid saving unchanged sessions
			saveUninitialized: false, // Avoid saving empty sessions
			cookie: {
				maxAge: 60000, // Session expires after 1 minute (adjust as needed)
				secure: false, // Set to true if using HTTPS
				httpOnly: true, // Helps prevent XSS attacks
			},
		})
	);

	app.use(flash());

	app.use((req, res, next) => {
		res.locals.success = req.flash('success');
		res.locals.error = req.flash('error');
		next();
	});
};

export default applyMiddlewares;
