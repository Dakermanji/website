//! models/User.js

import { promisePool } from '../config/database.js';
import bcrypt from 'bcrypt';

class User {
	// Create a new user
	static async create({
		username,
		email,
		hashedPassword,
		googleId = null,
		githubId = null,
	}) {
		const query = `
            INSERT INTO users (id, username, email, hashed_password, google_id, github_id, confirmed)
            VALUES (UUID(), ?, ?, ?, ?, ?, false)
        `;
		const values = [username, email, hashedPassword, googleId, githubId];
		const [result] = await promisePool.execute(query, values);
		return result;
	}

	// Find a user by username
	static async findByUsername(username) {
		const query = `SELECT * FROM users WHERE username = ? LIMIT 1`;
		const [rows] = await promisePool.execute(query, [username]);
		return rows[0] || null;
	}

	// Find a user by email
	static async findByEmail(email) {
		const query = `SELECT * FROM users WHERE email = ? LIMIT 1`;
		const [rows] = await promisePool.execute(query, [email]);
		return rows[0] || null;
	}

	// Find a user by ID
	static async findById(id) {
		const query = `SELECT * FROM users WHERE id = ? LIMIT 1`;
		const [rows] = await promisePool.execute(query, [id]);
		return rows[0] || null;
	}

	// Find or create a user by Google profile
	static async findOrCreateGoogleUser(profile) {
		const query = `
            SELECT * FROM users WHERE google_id = ? LIMIT 1
        `;
		const [rows] = await promisePool.execute(query, [profile.id]);
		if (rows.length > 0) {
			return rows[0];
		}

		// If the user doesn't exist, create a new one
		const insertQuery = `
            INSERT INTO users (id, username, email, google_id, confirmed)
            VALUES (UUID(), ?, ?, ?, true)
        `;
		const values = [
			profile.displayName,
			profile.emails[0].value,
			profile.id,
		];
		const [result] = await promisePool.execute(insertQuery, values);
		return this.findById(result.insertId);
	}

	// Find or create a user by GitHub profile
	static async findOrCreateGitHubUser(profile) {
		const query = `
            SELECT * FROM users WHERE github_id = ? LIMIT 1
        `;
		const [rows] = await promisePool.execute(query, [profile.id]);
		if (rows.length > 0) {
			return rows[0];
		}

		// If the user doesn't exist, create a new one
		const insertQuery = `
            INSERT INTO users (id, username, email, github_id, confirmed)
            VALUES (UUID(), ?, ?, ?, true)
        `;
		const values = [profile.username, profile.emails[0].value, profile.id];
		const [result] = await promisePool.execute(insertQuery, values);
		return this.findById(result.insertId);
	}

	// Validate a user's password
	static async validatePassword(inputPassword, storedHashedPassword) {
		return await bcrypt.compare(inputPassword, storedHashedPassword);
	}

	// Update a user's token and token expiry
	static async updateToken(id, token, tokenExpiry) {
		const query = `
            UPDATE users
            SET token = ?, token_expiry = ?
            WHERE id = ?
        `;
		const [result] = await promisePool.execute(query, [
			token,
			tokenExpiry,
			id,
		]);
		return result;
	}
}

export default User;
