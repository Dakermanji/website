//! config/middleware.js

import { bodyParsers } from '../middlewares/bodyParsers.js';
import { staticFiles } from '../middlewares/staticFiles.js';
import { viewEngine } from '../middlewares/viewEngine.js';
import { sessionFlash } from '../middlewares/sessionFlash.js';
import { customMiddlewares } from '../middlewares/customMiddlewares.js';
import { initializePassport } from '../middlewares/passportMiddleware.js';

const applyMiddlewares = (app) => {
	bodyParsers(app);
	staticFiles(app);
	viewEngine(app);
	sessionFlash(app);
	initializePassport(app);
	customMiddlewares(app);
};

export default applyMiddlewares;
