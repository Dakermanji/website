//! config/express.js

import './instrument.js'; // Initialize Sentry as early as possible
import express from 'express';
import applyMiddlewares from './middleware.js';
import router from './routes.js';
import errorHandler from '../middlewares/errorHandler.js';

// Initialize the Express application
const app = express();

// Step 1: Apply all middlewares
// This includes body parsers, static file serving, and custom middlewares
applyMiddlewares(app);

// Step 2: Register routes
// All application routes are defined and linked here
app.use('/', router);

// Step 3: Apply error handler
// Handles errors globally, including 404 and server errors
app.use(errorHandler);

// Default exports for app ensures consistency in imports across the project
export default app;
