//! models/Project.js

import { promisePool } from '../config/database.js';

class Project {
	static async createProject(name, ownerId) {
		const query = `INSERT INTO projects (name, owner_id) VALUES (?, ?)`;
		const [result] = await promisePool.execute(query, [name, ownerId]);
		return result.insertId;
	}

	static async getProjectsByOwner(ownerId) {
		const query = `SELECT * FROM projects WHERE owner_id = ?`;
		const [projects] = await promisePool.execute(query, [ownerId]);
		return projects;
	}

	static async deleteProject(projectId) {
		const query = `DELETE FROM projects WHERE id = ?`;
		return promisePool.execute(query, [projectId]);
	}

	static async getProjectById(projectId) {
		const query = `SELECT * FROM projects WHERE id = ?`;
		const [projects] = await promisePool.execute(query, [projectId]);
		return projects[0];
	}
}

export default Project;
