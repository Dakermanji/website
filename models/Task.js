//! models/Task.js

import { promisePool } from '../config/database.js';

class Task {
	static async createTask(projectId, name, assignedTo, dueDate) {
		const query = `INSERT INTO tasks (project_id, name, assigned_to, due_date) VALUES (?, ?, ?, ?)`;
		const [result] = await promisePool.execute(query, [
			projectId,
			name,
			assignedTo,
			dueDate,
		]);
		return result.insertId;
	}

	static async updateTask(taskId, { name, status, assignedTo, dueDate }) {
		const query = `UPDATE tasks SET name = ?, status = ?, assigned_to = ?, due_date = ? WHERE id = ?`;
		return promisePool.execute(query, [
			name,
			status,
			assignedTo,
			dueDate,
			taskId,
		]);
	}

	static async deleteTask(taskId) {
		const query = `DELETE FROM tasks WHERE id = ?`;
		return promisePool.execute(query, [taskId]);
	}

	static async getTasksByProjectId(projectId) {
		const query = `SELECT * FROM tasks WHERE project_id = ?`;
		const [tasks] = await promisePool.execute(query, [projectId]);
		return tasks;
	}
}

export default Task;
