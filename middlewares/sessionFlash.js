//! middlewares/sessionFlash.js
import session from 'express-session';
import flash from 'connect-flash';
import env from '../config/dotenv.js';

export const sessionFlash = (app) => {
	app.use(
		session({
			secret: env.SESSION_SECRET,
			resave: false,
			saveUninitialized: false,
			cookie: {
				maxAge: 60000,
				secure: false,
				httpOnly: true,
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
