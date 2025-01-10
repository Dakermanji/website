//! config/express.js
import express from 'express';
import router from './routes.js';

// Initialize the Express application
const app = express();

// Step 1: Apply all middlewares
// This includes body parsers, static file serving, and custom middlewares

// Step 2: Register routes
// All application routes are defined and linked here
app.use('/', router);

// Step 3: Apply error handler
// Handles errors globally, including 404 and server errors

// Exporting the app and env
// Default export for app ensures consistency in imports across the project
export default app;
