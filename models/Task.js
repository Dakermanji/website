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

	static async updateValueForATask(taskId, column, value) {
		if (!['name', 'status', 'assigned_to', 'due_date'].includes(column)) {
			return null;
		}
		const query = `UPDATE tasks SET ${column} = ? WHERE id = ?`;
		return promisePool.execute(query, [value, taskId]);
	}

	static async deleteTask(taskId) {
		const query = `DELETE FROM tasks WHERE id = ?`;
		return promisePool.execute(query, [taskId]);
	}

	static async getTasksByProjectId(projectId) {
		const query = `SELECT t.*, u.username FROM tasks t JOIN users u ON t.assigned_to = u.id WHERE project_id = ?`;
		const [tasks] = await promisePool.execute(query, [projectId]);
		return tasks;
	}
}

export default Task;
