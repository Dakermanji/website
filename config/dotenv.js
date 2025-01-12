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

	DB_HOST:
		process.env.DB_HOST ||
		(warnIfUsingDefault('DB_HOST', 'localhost'), 'localhost'),
	DB_USER:
		process.env.DB_USER || (warnIfUsingDefault('DB_USER', 'root'), 'root'),

	DB_PASSWORD:
		process.env.DB_PASSWORD ||
		(() => {
			throw new Error(
				'DB_PASSWORD is not defined. Please set it in your environment variables.'
			);
		})(),
	DB_NAME:
		process.env.DB_NAME ||
		(() => {
			throw new Error(
				'DB_NAME is not defined. Please set it in your environment variables.'
			);
		})(),
	DB_PORT: process.env.DB_PORT || (warnIfUsingDefault('DB_PORT', 3306), 3306),
};

export default env;
