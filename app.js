//! app.js
import app from './config/express.js';
import env from './config/dotenv.js';

// Function to start the server
const startServer = () => {
	try {
		// Start listening on the defined port
		app.listen(env.PORT, () => {
			console.log(`Server is running on http://${env.HOST}:${env.PORT}`);

			// Warn if the default port is being used
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
		process.exit(1); // Exit the process with failure code
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
