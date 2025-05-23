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
		const typingUsers = {};

		socket.on('typing', ({ roomId, username }) => {
			if (!typingUsers[roomId]) typingUsers[roomId] = new Set();

			typingUsers[roomId].add(username);

			// Emit to others in the room
			socket.to(roomId).emit('typing', {
				users: Array.from(typingUsers[roomId]),
			});

			// Auto-remove after timeout (e.g. 3s)
			setTimeout(() => {
				typingUsers[roomId].delete(username);
				socket.to(roomId).emit('typing', {
					users: Array.from(typingUsers[roomId]),
				});
			}, 3000);
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
