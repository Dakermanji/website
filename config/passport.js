//! config/passport.js

import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';

// Local Strategy
passport.use(
	new LocalStrategy(async (username, password, done) => {
		try {
			// Find the user by username
			const user = await User.findByUsername(username);
			if (!user) {
				return done(null, false, {
					message: 'Invalid username or password.',
				});
			}

			// Validate the password
			const isValid = await user.validatePassword(password);
			if (!isValid) {
				return done(null, false, {
					message: 'Invalid username or password.',
				});
			}

			return done(null, user);
		} catch (error) {
			return done(error);
		}
	})
);

// Google OAuth Strategy
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: '/auth/google/callback',
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				// Find or create the user
				const user = await User.findOrCreateGoogleUser(profile);
				return done(null, user);
			} catch (error) {
				return done(error);
			}
		}
	)
);

// GitHub OAuth Strategy
passport.use(
	new GitHubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			callbackURL: '/auth/github/callback',
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				// Find or create the user
				const user = await User.findOrCreateGitHubUser(profile);
				return done(null, user);
			} catch (error) {
				return done(error);
			}
		}
	)
);

// Serialize user
passport.serializeUser((user, done) => {
	done(null, user.id); // Serialize the user's ID
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
	try {
		const user = await User.findById(id); // Find the user by ID
		done(null, user);
	} catch (error) {
		done(error, null);
	}
});

export default passport;
