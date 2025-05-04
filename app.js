//! app.js

import app from './config/express.js';
import env from './config/dotenv.js';
import http from 'http';
import { initSocket } from './config/socket.js';

// Catch uncaught exceptions
process.on('uncaughtException', (err) => {
	console.error('Uncaught Exception:', err);
	import('./config/instrument.js').then(({ default: Sentry }) => {
		Sentry.captureException(err);
		process.exit(1); // Optional: crash for safety
	});
});

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
	console.error('Unhandled Rejection:', reason);
	import('./config/instrument.js').then(({ default: Sentry }) => {
		Sentry.captureException(reason);
	});
});

// Function to start the server
const startServer = () => {
	try {
		// Create HTTP server
		const server = http.createServer(app);

		// Init Socket.io
		initSocket(server);

		// Start server
		server.listen(env.PORT, () => {
			console.log(`Server is running on ${env.HOST}:${env.PORT}`);

			if (!process.env.PORT) {
				console.warn(
					'[Warning]: PORT is not defined in .env. Using default: 3000'
				);
			}
		});
	} catch (error) {
		console.error(
			`[Server Error]: Failed to start the server. ${error.message}`
		);
		process.exit(1);
	}
};

// Graceful shutdown handler
const handleShutdown = (signal) => {
	console.log(`Received ${signal}. Shutting down gracefully...`);
	// Perform any cleanup tasks (e.g., closing database connections)
	process.exit(0); // Exit the process with a success code
};

// Handle termination signals for graceful shutdown
process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));

// Start the server
startServer();
