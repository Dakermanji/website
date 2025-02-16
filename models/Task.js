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

	static async updateValueForATask(taskId, field, value) {
		const allowedFields = ['status', 'name', 'assigned_to', 'due_date'];
		if (!allowedFields.includes(field)) {
			throw new Error('Invalid field update');
		}
		const query = `UPDATE tasks SET ${field} = ? WHERE id = ?`;
		return promisePool.execute(query, [value, taskId]);
	}

	static async deleteTask(taskId) {
		const query = `DELETE FROM tasks WHERE id = ?`;
		return promisePool.execute(query, [taskId]);
	}

	static async getTasksByProjectId(projectId) {
		const query = `
        SELECT t.id, t.name, t.status, t.due_date,
               u.username
        FROM tasks t
        LEFT JOIN users u ON t.assigned_to = u.id
        WHERE t.project_id = ?`;
		const [tasks] = await promisePool.execute(query, [projectId]);
		return tasks;
	}
}

export default Task;
