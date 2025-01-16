//! middlewares/customMiddlewares.js

export const customMiddlewares = (app) => {
	app.use((req, res, next) => {
		res.locals.currentRoute = req.path;
		next();
	});
};
