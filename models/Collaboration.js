//! models/Collaboration.js

import { promisePool } from '../config/database.js';

class Collaboration {
	static async addUserToProject(projectId, userId, role) {
		const query = `INSERT INTO collaborations (project_id, user_id, role) VALUES (?, ?, ?)`;
		return promisePool.execute(query, [projectId, userId, role]);
	}

	static async removeUserFromProject(projectId, userId) {
		const query = `DELETE FROM collaborations WHERE project_id = ? AND user_id = ?`;
		return promisePool.execute(query, [projectId, userId]);
	}

	static async getProjectCollaborators(projectId) {
		const query = `SELECT c.*, u.username, u.email FROM collaborations c JOIN users u ON c.user_id = u.id WHERE c.project_id = ?`;
		const [collaborators] = await promisePool.execute(query, [projectId]);
		return collaborators;
	}
}

export default Collaboration;
