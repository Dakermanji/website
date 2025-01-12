//! middlewares/sessionFlash.js

import session from 'express-session';
import flash from 'express-flash';
import env from '../config/dotenv.js';

export const sessionFlash = (app) => {
	app.use(
		session({
			secret: env.SESSION_SECRET, // Use your environment variable for the session secret
			resave: false, // Prevent saving session if nothing changes
			saveUninitialized: false, // Don't create session until something is stored
			cookie: {
				maxAge: 60000, // Set session expiration time (adjust as needed)
				secure: false, // Set true if using HTTPS
				httpOnly: true, // Prevent client-side JavaScript access to cookies
			},
		})
	);

	// Initialize flash middleware
	app.use(flash());

	// Add flash messages to response locals for rendering in views
	app.use((req, res, next) => {
		res.locals.success = req.flash('success'); // Success messages
		res.locals.error = req.flash('error'); // Error messages
		next();
	});
};
