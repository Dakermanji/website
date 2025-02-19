//! middlewares/authMiddleware.js

export const ensureAuthenticated = (req, res, next) => {
	if (req.path === '/' || req.path.startsWith('/auth')) {
		return next(); // Skip authentication for these routes
	}
	if (req.isAuthenticated()) {
		return next();
	}
	req.flash(
		'error',
		'You need to be logged in to preview the requested page.'
	);
	res.redirect('/?auth=true'); // Redirect to `/` and include `auth=true` to trigger the popup
};

export const injectUser = (req, res, next) => {
	res.locals.user = req.user || null; // Pass user object or null
	next();
};
