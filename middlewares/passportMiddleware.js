//! middlewares/passportMiddleware.js

import passport from '../config/passport.js';

export const initializePassport = (app) => {
	// Initialize Passport
	app.use(passport.initialize());
	app.use(passport.session());
};
