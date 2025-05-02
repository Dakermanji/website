//! config/dotenv.js

import dotenv from 'dotenv';
dotenv.config();

// Utility to throw errors for missing required environment variables
function requireEnv(variable) {
	const value = process.env[variable];
	if (value === undefined) {
		throw new Error(
			`[Error]: ${variable} is not defined. Please set it in your environment variables.`
		);
	}
	return value;
}

// Utility to log warnings for missing optional variables
function optionalEnv(variable, defaultValue) {
	if (process.env[variable] === undefined) {
		console.warn(
			`[Warning]: Using default value for ${variable}: ${defaultValue}`
		);
	}
	return process.env[variable] || defaultValue;
}

// Environment configuration
const env = {
	// Required variables
	SESSION_SECRET: requireEnv('SESSION_SECRET'),
	DB_PASSWORD: requireEnv('DB_PASSWORD'),
	DB_NAME: requireEnv('DB_NAME'),
	SENTRY_DSN: requireEnv('SENTRY_DSN'),
	SENTRY_PROJECT_ID: requireEnv('SENTRY_PROJECT_ID'),
	GITHUB_CLIENT_ID: requireEnv('GITHUB_CLIENT_ID'),
	GITHUB_CLIENT_SECRET: requireEnv('GITHUB_CLIENT_SECRET'),
	GOOGLE_CLIENT_ID: requireEnv('GOOGLE_CLIENT_ID'),
	GOOGLE_CLIENT_SECRET: requireEnv('GOOGLE_CLIENT_SECRET'),
	GOOGLE_CALLBACK_URL: requireEnv('GOOGLE_CALLBACK_URL'),
	EMAIL_SERVICE: requireEnv('EMAIL_SERVICE'),
	EMAIL_USER: requireEnv('EMAIL_USER'),
	EMAIL_PASS: requireEnv('EMAIL_PASS'),
	OPENWEATHER_API_KEY: requireEnv('OPENWEATHER_API_KEY'),
	UNSPLASH_ACCESS_KEY: requireEnv('UNSPLASH_ACCESS_KEY'),

	// Optional variables with defaults
	PORT: optionalEnv('PORT', 3000),
	HOST: optionalEnv('HOST', 'localhost'),
	DB_HOST: optionalEnv('DB_HOST', 'localhost'),
	DB_USER: optionalEnv('DB_USER', 'root'),
	DB_PORT: optionalEnv('DB_PORT', 3306),
};

export default env;
