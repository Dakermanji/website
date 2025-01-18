//! middlewares/authMiddleware.js

export const ensureAuthenticated = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}
	res.redirect('/?auth=true'); // Redirect to `/` and include `auth=true` to trigger the popup
};

export const injectUser = (req, res, next) => {
	res.locals.user = req.user || null; // Pass user object or null
	next();
};
