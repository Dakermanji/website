//! models/Follow.js

import { promisePool } from '../config/database.js';

class Follow {
	// Check if a user is following another user
	static async checkFollowStatus(followerId, followedId) {
		const query = `SELECT mutual_follow FROM follows WHERE follower_id = ? AND followed_id = ? LIMIT 1`;
		const [rows] = await promisePool.execute(query, [
			followerId,
			followedId,
		]);
		return rows.length > 0
			? rows[0].mutual_follow === 1
				? 'mutual'
				: 'following'
			: 'not_following';
	}

	// Create a follow entry (prevent duplicates)
	static async createFollow(followerId, followedId) {
		const query = `INSERT IGNORE INTO follows (follower_id, followed_id) VALUES (?, ?)`;
		return promisePool.execute(query, [followerId, followedId]);
	}

	// Create mutual follow relationship (update existing or insert if needed)
	static async createMutualFollow(userAId, userBId) {
		const updateQuery = `UPDATE follows SET mutual_follow = TRUE
                     WHERE (follower_id = ? AND followed_id = ?)
                     OR (follower_id = ? AND followed_id = ?)`;
		await promisePool.execute(updateQuery, [
			userAId,
			userBId,
			userBId,
			userAId,
		]);

		const insertQuery = `INSERT IGNORE INTO follows (follower_id, followed_id, mutual_follow) VALUES (?, ?, TRUE), (?, ?, TRUE)`;
		return promisePool.execute(insertQuery, [
			userAId,
			userBId,
			userBId,
			userAId,
		]);
	}

	// Update mutual follow status
	static async updateMutualFollow(userAId, userBId, mutual = true) {
		const query = `UPDATE follows SET mutual_follow = ?
                   WHERE (follower_id = ? AND followed_id = ?)
                      OR (follower_id = ? AND followed_id = ?)`;

		const [result] = await promisePool.execute(query, [
			mutual,
			userAId,
			userBId,
			userBId,
			userAId,
		]);

		return result.affectedRows > 0;
	}

	// Remove a follow entry (unfollow a user)
	static async removeFollow(followerId, followedId) {
		const query = `DELETE FROM follows WHERE follower_id = ? AND followed_id = ?`;
		return promisePool.execute(query, [followerId, followedId]);
	}

	// Get all follows for a user
	static async getFollows(userId) {
		const query = `
			SELECT f.id, f.followed_id, u.username, u.email, f.mutual_follow
			FROM follows f
			JOIN users u ON f.followed_id = u.id
			WHERE f.follower_id = ?`;
		const [rows] = await promisePool.execute(query, [userId]);
		return rows;
	}

	// Get all followers of a user
	static async getFollowers(userId) {
		const query = `
			SELECT f.id, f.follower_id, u.username, u.email, f.mutual_follow
			FROM follows f
			JOIN users u ON f.follower_id = u.id
			WHERE f.followed_id = ?`;
		const [rows] = await promisePool.execute(query, [userId]);
		return rows;
	}

	// Get all followers of a user
	static async getFollowerById(followId) {
		const query = `
			SELECT * FROM follows WHERE id = ?`;
		const [rows] = await promisePool.execute(query, [followId]);
		return rows[0];
	}
}

export default Follow;
