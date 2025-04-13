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
	new LocalStrategy(
		{
			usernameField: 'email', // Use email instead of the default username
			passwordField: 'password',
		},
		async (email, password, done) => {
			try {
				// Find user by email
				const user = await User.findByEmail(email);
				if (!user) {
					return done(null, false, {
						message: 'Invalid email or password.',
					});
				}

				// Validate password
				const isValid = await User.validatePassword(
					password,
					user.hashed_password
				);

				if (!isValid) {
					return done(null, false, {
						message: 'Invalid email or password.',
					});
				}

				// Check if the user is confirmed
				if (!user.confirmed) {
					return done(null, false, {
						message:
							'Please confirm your email to log in, or use Google or GitHub.',
					});
				}

				return done(null, user);
			} catch (error) {
				return done(error);
			}
		}
	)
);

// Google OAuth Strategy
passport.use(
	new GoogleStrategy(
		{
			clientID: env.GOOGLE_CLIENT_ID,
			clientSecret: env.GOOGLE_CLIENT_SECRET,
			callbackURL: env.GOOGLE_CALLBACK_URL,
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
