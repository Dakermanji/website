//! config/database.js

import mysql from 'mysql2';
import env from './dotenv.js';
import Sentry from './instrument.js';

const pool = mysql.createPool({
	host: env.DB_HOST,
	user: env.DB_USER,
	password: env.DB_PASSWORD,
	database: env.DB_NAME,
	port: env.DB_PORT,
	connectTimeout: 10000,
	multipleStatements: false,
	debug: env.NODE_ENV === 'development',
});

let isDatabaseConnected = false;

pool.getConnection((err, connection) => {
	if (err) {
		handleDatabaseError(err);
		isDatabaseConnected = false;
	} else {
		if (env.NODE_ENV === 'development') {
			console.log('Connected to the MySQL database.');
		}
		isDatabaseConnected = true;
		connection.release();
	}
});

function handleDatabaseError(err) {
	switch (err.code) {
		case 'PROTOCOL_CONNECTION_LOST':
			Sentry.captureMessage('Database connection was closed.', 'warning'); // Log a warning in Sentry
			console.error('Database connection was closed.');
			break;

		case 'ER_CON_COUNT_ERROR':
			Sentry.captureMessage(
				'Database has too many connections.',
				'warning'
			); // Log a warning in Sentry
			console.error('Database has too many connections.');
			break;

		case 'ECONNREFUSED':
			Sentry.captureMessage('Database connection was refused.', 'error'); // Log as an error
			console.error('Database connection was refused.');
			break;

		default:
			if (env.NODE_ENV === 'development') {
				console.error(`[Database Error]: ${err.message}`);
			} else {
				console.error(
					'An error occurred while connecting to the database.'
				);
			}
			Sentry.captureException(err); // Log other unexpected errors as exceptions
	}
}

const getConnectionStatus = () => isDatabaseConnected;

process.on('SIGINT', () => {
	console.log('Closing database pool...');
	pool.end((err) => {
		if (err) {
			console.error('Error closing the database pool:', err.message);
		} else {
			console.log('Database pool closed.');
		}
		process.exit(0);
	});
	setTimeout(() => {
		console.error('Forcefully shutting down due to timeout.');
		process.exit(1);
	}, 5000);
});

const checkDatabaseMiddleware = (req, res, next) => {
	if (!getConnectionStatus()) {
		const error = new Error(
			'Database connection failed. Please try again later.'
		);
		error.status = 500;
		return next(error);
	}
	next();
};

const promisePool = pool.promise();

export { pool, promisePool, checkDatabaseMiddleware, getConnectionStatus };
