//! middlewares/errorHandler.js
const errorHandler = (err, req, res, next) => {
	console.error(err.stack); // Log the error stack for debugging

	const statusCode = err.status || 500;
	const message = err.message || 'An unexpected error occurred.';

	res.status(statusCode).send(message);
};

export default errorHandler;
