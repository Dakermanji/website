//! config/dotenv.js

import dotenv from 'dotenv';
dotenv.config();

// Helper function to log warnings for default values
function warnIfUsingDefault(variable, defaultValue) {
	if (process.env[variable] === undefined) {
		console.warn(
			`[Warning]: Using default value for ${variable}. Check your .env file to ensure proper configuration.`
		);
	}
}

// Define environment variables with default values and warnings
const env = {
	PORT: process.env.PORT || (warnIfUsingDefault('PORT', 3000), 3000),
	HOST:
		process.env.HOST ||
		(warnIfUsingDefault('HOST', 'localhost'), 'localhost'),
	SESSION_SECRET:
		process.env.SESSION_SECRET ||
		(() => {
			throw new Error(
				'SESSION_SECRET is not defined. Please set it in your environment variables.'
			);
		})(),

	SENTRY_DSN:
		process.env.SENTRY_DSN ||
		(() => {
			throw new Error(
				'SENTRY_DSN is not defined. Please set it in your environment variables.'
			);
		})(),
	SENTRY_PROJECT_ID:
		process.env.SENTRY_PROJECT_ID ||
		(() => {
			throw new Error(
				'SENTRY_PROJECT_ID is not defined. Please set it in your environment variables.'
			);
		})(),
};

export default env;
