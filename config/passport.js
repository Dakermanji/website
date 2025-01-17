//! config/passport.js

import passport from 'passport';
import LocalStrategy from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import axios from 'axios';

import User from '../models/User.js';
import env from './dotenv.js';

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
			clientID: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
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
			clientID: env.GITHUB_CLIENT_ID,
			clientSecret: env.GITHUB_CLIENT_SECRET,
			callbackURL: '/auth/github/callback',
			scope: ['user:email'],
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				let email =
					profile.emails && profile.emails[0]
						? profile.emails[0].value
						: null;

				if (!email) {
					const { data: emails } = await axios.get(
						'https://api.github.com/user/emails',
						{
							headers: {
								Authorization: `Bearer ${accessToken}`,
							},
						}
					);

					const primaryEmail = emails.find(
						(email) => email.primary && email.verified
					);
					email = primaryEmail ? primaryEmail.email : null;
				}

				if (!email) {
					return done(
						new Error('Unable to retrieve email from GitHub'),
						null
					);
				}

				const user = await User.findOrCreateGitHubUser({
					...profile,
					email,
				});
				return done(null, user);
			} catch (error) {
				console.error('Error during GitHub authentication:', error);
				return done(error, null);
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
