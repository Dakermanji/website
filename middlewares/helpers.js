//! middlewares/helpers.js
export const logMiddlewareErrors = (middleware) => {
	return (req, res, next) => {
		try {
			middleware(req, res, next);
		} catch (err) {
			console.error(`[Middleware Error]: ${err.message}`);
			next(err);
		}
	};
};
