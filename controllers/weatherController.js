//! controllers/weatherController.js

import { navBar } from '../data/navBar.js';
import Notification from '../models/Notification.js';
import { getUserFriends } from '../utils/friends/userFriendsHelper.js';

// Render the weather page
export const renderWeatherPage = async (req, res) => {
	const [notifications, unreadCount, userFriends] = await Promise.all([
		Notification.getNotificationByIdForAUser(req.user.id),
		Notification.countUnread(req.user.id),
		getUserFriends(req.user.id),
	]);

	res.render('weather', {
		weatherData: null,
		title: `Weather - DWD`,
		navBar: navBar.projects,
		success_msg: req.flash('success_msg') || null,
		error_msg: req.flash('error_msg') || null,
		notifications,
		userFriends,
		unreadCount,
		// styles: ['weather'],
		// scripts: ['weather'],
	});
};

// Fetch weather data based on user input (placeholder)
export const fetchWeatherData = (req, res) => {
	// Placeholder response
	res.json({ message: 'fetchWeatherData controller not implemented yet.' });
};

// Fetch city suggestions for autocomplete (placeholder)
export const fetchCitySuggestions = (req, res) => {
	// Placeholder response
	res.json({
		message: 'fetchCitySuggestions controller not implemented yet.',
	});
};
