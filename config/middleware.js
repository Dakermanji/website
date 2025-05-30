//! config/middleware.js

import { bodyParsers } from '../middlewares/bodyParsers.js';
import { staticFiles } from '../middlewares/staticFiles.js';
import { viewEngine } from '../middlewares/viewEngine.js';
import { initializeSession } from '../middlewares/sessionMiddleware.js';
import { initializeFlash } from '../middlewares/flashMiddleware.js';
import { customMiddlewares } from '../middlewares/customMiddlewares.js';
import { initializePassport } from '../middlewares/passportMiddleware.js';
import { injectUser } from '../middlewares/authMiddleware.js';
import { ensureAuthenticated } from '../middlewares/authMiddleware.js';

const applyMiddlewares = (app) => {
	bodyParsers(app);
	staticFiles(app);
	viewEngine(app);
	initializeSession(app);
	initializeFlash(app);
	initializePassport(app);
	customMiddlewares(app);
	app.use(injectUser);
	app.use(ensureAuthenticated);
};

export default applyMiddlewares;
