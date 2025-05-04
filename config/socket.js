//! config/socket.js

import env from './dotenv.js';
import { Server } from 'socket.io';

let io;

export const initSocket = (server) => {
	io = new Server(server, {
		origin: env.ORIGIN,
		methods: ['GET', 'POST'],
	});

	io.on('connection', (socket) => {
		console.log(`User connected: ${socket.id}`);

		socket.on('disconnect', () => {
			console.log(`User disconnected: ${socket.id}`);
		});

		// TODO: join room, send message, typing, etc handlers will go here
	});

	return io;
};

export const getIO = () => {
	if (!io) {
		throw new Error('Socket.io not initialized');
	}
	return io;
};
