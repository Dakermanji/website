//! models/User.js

import { promisePool } from '../config/database.js';
import bcrypt from 'bcrypt';

class User {
	// Create a new user
	static async create({
		username,
		email,
		hashedPassword = null,
		googleId = null,
		githubId = null,
		token = null,
		tokenExpiry = null,
	}) {
		const query = `
            INSERT INTO users (id, username, email, hashed_password, google_id, github_id, confirmed, token, token_expiry)
            VALUES (UUID(), ?, ?, ?, ?, ?, false,?,?)
        `;
		const values = [
			username,
			email,
			hashedPassword,
			googleId,
			githubId,
			token,
			tokenExpiry,
		];
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
		const email = profile._json.email;

		// Check if a user exists with the given email
		const query = `SELECT * FROM users WHERE email = ? LIMIT 1`;
		const [rows] = await promisePool.execute(query, [email]);

		if (rows.length > 0) {
			// User exists, link Google account if not already linked
			const user = rows[0];
			if (!user.google_id) {
				await this.updateGoogleId(user.id, profile.id);
			}
			return user;
		}

		// If no user exists, create a new one
		const insertQuery = `
            INSERT INTO users (id, username, email, google_id, confirmed)
            VALUES (UUID(), ?, ?, ?, true)
        `;
		const values = [profile.displayName, email, profile.id];
		const [result] = await promisePool.execute(insertQuery, values);
		return this.findById(result.insertId);
	}

	// Find or create a user by GitHub profile
	static async findOrCreateGitHubUser(profile) {
		const email = profile.email;

		// Check if a user exists with the given email
		const query = `SELECT * FROM users WHERE email = ? LIMIT 1`;
		const [rows] = await promisePool.execute(query, [email]);

		if (rows.length > 0) {
			// User exists, link GitHub account if not already linked
			const user = rows[0];
			if (!user.github_id) {
				await this.updateGitHubId(user.id, profile.id);
			}
			return user;
		}

		// If no user exists, create a new one
		const insertQuery = `
            INSERT INTO users (id, username, email, github_id, confirmed)
            VALUES (UUID(), ?, ?, ?, true)
        `;
		const values = [profile.username, email, profile.id];
		const [result] = await promisePool.execute(insertQuery, values);
		return this.findById(result.insertId);
	}

	// Link Google ID to an existing user
	static async updateGoogleId(userId, googleId) {
		const query = `
            UPDATE users
            SET google_id = ?
            WHERE id = ?
        `;
		const [result] = await promisePool.execute(query, [googleId, userId]);
		return result;
	}

	// Link GitHub ID to an existing user
	static async updateGitHubId(userId, githubId) {
		const query = `
            UPDATE users
            SET github_id = ?
            WHERE id = ?
        `;
		const [result] = await promisePool.execute(query, [githubId, userId]);
		return result;
	}

	// Hash a password
	static async hashPassword(password) {
		const saltRounds = 10; // Adjust as needed for your security requirements
		return await bcrypt.hash(password, saltRounds);
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

	// Find user by token
	static async findByToken(token) {
		const query = `SELECT * FROM users WHERE token = ? LIMIT 1`;
		const [rows] = await promisePool.execute(query, [token]);
		return rows[0] || null;
	}

	// Confirm email
	static async confirmEmail(userId) {
		const query = `
        UPDATE users
        SET confirmed = true, token = NULL, token_expiry = NULL
        WHERE id = ?
    `;
		const [result] = await promisePool.execute(query, [userId]);
		return result;
	}

	static async findByToken(token) {
		const query = 'SELECT * FROM users WHERE token = ?';
		const [rows] = await promisePool.query(query, [token]);
		return rows[0];
	}

	static async resetPassword(userId, hashedPassword) {
		const query = `
        UPDATE users
        SET hashed_password = ?, token = NULL, token_expiry = NULL
        WHERE id = ?
    `;
		await promisePool.execute(query, [hashedPassword, userId]);
	}
}

export default User;
