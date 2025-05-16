//! utils/chatHelper.js

import Project from '../models/Project.js';
import Collaboration from '../models/Collaboration.js';

export const formatMessage = (message, user) => {
	return {
		id: message.id,
		user_id: message.user_id,
		username: user.username,
		message: message.message,
		created_at: message.created_at || new Date(),
	};
};

export function getSocketRoom(projectName, userId, receiverId) {
	if (projectName === 'chat') {
		return userId < receiverId
			? `friend-${userId}-${receiverId}`
			: `friend-${receiverId}-${userId}`;
	}
	return receiverId;
}

export function getChatTarget(req) {
	const projectName = req.method === 'POST' ? req.body.projectName : null;
	let receiverId = null;

	if (req.method === 'POST') {
		if (projectName === 'chat') {
			receiverId = req.body.friend_id;
		} else if (projectName === 'room') {
			receiverId = req.body.room_id;
		} else if (projectName === 'taskmanager') {
			receiverId = req.body.project_id;
		}
	}

	return { projectName, receiverId };
}

export async function getChatProjects(userId) {
	const ownedProjects = await Project.getProjectsByOwner(userId);
	const collaborationsProjects = await Collaboration.getProjectsForUser(
		userId
	);
	return [
		...ownedProjects.map((p) => ({
			id: p.id,
			name: p.name,
			type: 'Owner',
		})),
		...collaborationsProjects.map((c) => ({
			id: c.project_id,
			name: c.name,
			type: 'Collaborator',
		})),
	];
}
