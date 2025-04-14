//! middlewares/sessionMiddleware.js

import session from 'express-session';
import env from '../config/dotenv.js';

export const initializeSession = (app) => {
	app.use(
		session({
			secret: env.SESSION_SECRET, // Use your environment variable for the session secret
			resave: false, // Prevent saving session if nothing changes
			saveUninitialized: false, // Don't create session until something is stored
			cookie: {
				maxAge: 1000 * 60 * 60 * 24, // Set session expiration time (adjust as needed)
				secure: env.NODE_ENV === 'production', // Only secure in production
				httpOnly: true, // Prevent client-side JavaScript access to cookies
			},
		})
	);
};
