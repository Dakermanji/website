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

		// Join room
		socket.on('joinRoom', (roomId) => {
			socket.join(roomId);
			console.log(`User ${socket.id} joined room ${roomId}`);
		});

		// Chat message
		socket.on('chatMessage', ({ roomId, message, sender }) => {
			// Broadcast to all in room except sender
			socket.to(roomId).emit('chatMessage', {
				message,
				sender,
				time: new Date(),
			});

			console.log(`Message from ${sender} in ${roomId}: ${message}`);
		});

		// On message typing
		socket.on('typing', ({ roomId, username }) => {
			socket.to(roomId).emit('typing', { username });
		});

		// Disconnect
		socket.on('disconnect', () => {
			console.log(`User disconnected: ${socket.id}`);
		});
	});
};

export const getIO = () => {
	if (!io) {
		throw new Error('Socket.io not initialized');
	}
	return io;
};
