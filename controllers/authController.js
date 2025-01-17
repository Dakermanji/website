import passport from '../config/passport.js';
import User from '../models/User.js';

// Handle local login
export const login = passport.authenticate('local', {
	successRedirect: '/',
	failureRedirect: '/?auth=true', // Updated to include query parameter for modal
	failureFlash: true,
});

// Handle local registration
export const register = async (req, res) => {
	try {
		const { username, email, password, confirmPassword } = req.body;

		// Basic validation
		if (password !== confirmPassword) {
			req.flash('error', 'Passwords do not match.');
			return res.redirect('/?auth=true');
		}

		// Check if the email or username already exists
		const existingUser =
			(await User.findByEmail(email)) ||
			(await User.findByUsername(username));

		if (existingUser) {
			// Check if the user is registered via Google
			if (existingUser.google_id) {
				req.flash(
					'error',
					'This email is already registered via Google. Please log in using Google. If you want to set a password, please use forgot password.'
				);
				return res.redirect('/?auth=true');
			}

			// Check if the user is registered via GitHub
			if (existingUser.github_id) {
				// Link GitHub to the existing user
				await User.updateGitHubId(existingUser.id, githubId);
				req.flash(
					'success',
					'GitHub account successfully linked to your existing account.'
				);
				return res.redirect('/?auth=true');
			}

			// Otherwise, show a generic error
			req.flash('error', 'Username or email already in use.');
			return res.redirect('/?auth=true');
		}

		// Hash the password
		const hashedPassword = await User.hashPassword(password);

		// Create the user
		await User.create({ username, email, hashedPassword });
		req.flash('success', 'Registration successful. Please log in.');
		res.redirect('/?auth=true');
	} catch (error) {
		console.error('Error during registration:', error);
		req.flash('error', 'Something went wrong. Please try again.');
		res.redirect('/?auth=true');
	}
};

// Handle Google OAuth
export const googleLogin = passport.authenticate('google', {
	scope: ['profile', 'email'],
});

// Handle GitHub OAuth
export const githubLogin = passport.authenticate('google', {
	scope: ['user:email'],
});

export const googleCallback = async (req, res, next) => {
	try {
		const profile = req.user; // GitHub profile
		const existingUser = await User.findByEmail(profile.emails[0].value);

		if (existingUser) {
			// If GitHub ID is not linked, link it
			if (!existingUser.github_id) {
				await User.updateGoogleId(existingUser.id, profile.id);
				req.flash(
					'success',
					'Google account successfully linked to your existing account.'
				);
			}
		} else {
			// Create a new user with GitHub account
			await User.findOrCreateGoogleUser(profile);
		}

		res.redirect('/');
	} catch (error) {
		console.error('Error during GitHub login:', error);
		req.flash('error', 'Something went wrong. Please try again.');
		res.redirect('/?auth=true');
	}
};

export const githubCallback = async (req, res, next) => {
	try {
		const profile = req.user; // GitHub profile
		const existingUser = await User.findByEmail(profile.emails[0].value);

		if (existingUser) {
			// If GitHub ID is not linked, link it
			if (!existingUser.github_id) {
				await User.updateGitHubId(existingUser.id, profile.id);
				req.flash(
					'success',
					'GitHub account successfully linked to your existing account.'
				);
			}
		} else {
			// Create a new user with GitHub account
			await User.findOrCreateGitHubUser(profile);
		}

		res.redirect('/');
	} catch (error) {
		console.error('Error during GitHub login:', error);
		req.flash('error', 'Something went wrong. Please try again.');
		res.redirect('/?auth=true');
	}
};

// Handle logout
export const logout = (req, res) => {
	req.logout((err) => {
		if (err) {
			console.error('Error during logout:', err);
			req.flash('error', 'Error during logout.');
			return res.redirect('/');
		}
		req.flash('success', 'Logged out successfully.');
		res.redirect('/');
	});
};
