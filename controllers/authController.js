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
			return res.redirect('/?auth=true'); // Updated
		}

		// Check if the email or username already exists
		const existingUser =
			(await User.findByEmail(email)) ||
			(await User.findByUsername(username));
		if (existingUser) {
			req.flash('error', 'Username or email already in use.');
			return res.redirect('/?auth=true'); // Updated
		}

		// Hash the password
		const hashedPassword = await User.hashPassword(password);

		// Create the user
		await User.create({ username, email, hashedPassword });
		req.flash('success', 'Registration successful. Please log in.');
		res.redirect('/?auth=true'); // Updated
	} catch (error) {
		console.error('Error during registration:', error);
		req.flash('error', 'Something went wrong. Please try again.');
		res.redirect('/?auth=true'); // Updated
	}
};

// Handle Google OAuth
export const googleLogin = passport.authenticate('google', {
	scope: ['profile', 'email'],
});

export const googleCallback = passport.authenticate('google', {
	successRedirect: '/',
	failureRedirect: '/?auth=true', // Updated
	failureFlash: true,
});

// Handle GitHub OAuth
export const githubLogin = passport.authenticate('github', {
	scope: ['user:email'],
});

export const githubCallback = passport.authenticate('github', {
	successRedirect: '/',
	failureRedirect: '/?auth=true', // Updated
	failureFlash: true,
});

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
