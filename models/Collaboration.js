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
		const query = `SELECT c.user_id, c.role, u.username, u.email FROM collaborations c JOIN users u ON c.user_id = u.id WHERE c.project_id = ?`;
		const [collaborators] = await promisePool.execute(query, [projectId]);
		return collaborators;
	}

	static async removeAllByProjectId(projectId) {
		const query = `DELETE FROM collaborations WHERE project_id = ?`;
		const [rows] = await promisePool.execute(query, [projectId]);
		return rows.length > 0;
	}

	static async getProjectsForUser(userId) {
		const query = `
        SELECT p.id, p.name, p.owner_id, u.username AS owner_username, c.role
        FROM collaborations c
        JOIN projects p ON c.project_id = p.id
        JOIN users u ON p.owner_id = u.id
        WHERE c.user_id = ?
    `;
		const [projects] = await promisePool.execute(query, [userId]);
		return projects;
	}

	static async getCollaboration(projectId, userId) {
		const query = `SELECT * FROM collaborations WHERE project_id = ? AND user_id = ? LIMIT 1`;
		const [rows] = await promisePool.execute(query, [projectId, userId]);
		return rows.length ? rows[0] : null;
	}

	static async updateUserRole(projectId, userId, role) {
		const query = `UPDATE collaborations SET role = ? WHERE project_id = ? AND user_id = ?`;
		return promisePool.execute(query, [role, projectId, userId]);
	}

	static async hasEditorAccess(projectId, userId) {
		const [rows] = await promisePool.query(
			`SELECT role FROM collaborations WHERE project_id = ? AND user_id = ?`,
			[projectId, userId]
		);

		return rows.length && rows[0].role === 'editor';
	}

	static async isCollaborator(projectId, userId) {
		const [rows] = await promisePool.query(
			`SELECT * FROM Collaborations
			 WHERE project_id = ? AND user_id = ?`,
			[projectId, userId]
		);
		return rows.length > 0;
	}
}

export default Collaboration;
