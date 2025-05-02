//! controllers/weatherController.js

import { navBar } from '../data/navBar.js';
import Notification from '../models/Notification.js';
import { getUserFriends } from '../utils/friends/userFriendsHelper.js';
import {
	getWeatherByCoordinates,
	getCitySuggestions,
	getBackgroundImage,
} from '../utils/weatherHelper.js';

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
		styles: ['weather'],
		scripts: ['weather'],
	});
};

// Fetch weather data based on user input (placeholder)
export const fetchWeatherData = async (req, res) => {
	const { latitude, longitude, unit, orientation } = req.body;

	if (!latitude || !longitude || !unit || !orientation) {
		return res.status(400).json({
			error: 'Latitude, longitude, unit, and orientation are required.',
		});
	}

	try {
		const forecast = await getWeatherByCoordinates(
			latitude,
			longitude,
			unit
		);

		if (!forecast || forecast.length === 0) {
			return res.status(404).json({ error: 'No forecast data found.' });
		}

		// Use today's forecast description as background weather description
		const todayDescription = forecast[0].description;

		const backgroundImage = await getBackgroundImage(
			todayDescription,
			orientation
		);

		res.json({
			forecast,
			backgroundImage,
		});
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ error: 'Failed to fetch weather data.' });
	}
};

export const fetchCitySuggestions = async (req, res) => {
	const { query } = req.query;
	if (!query) {
		return res.status(400).json({ error: 'Query is required.' });
	}

	if (query.length < 3) {
		return res
			.status(400)
			.json({ error: 'Query must be at least 3 characters' });
	}

	try {
		const suggestions = await getCitySuggestions(query);
		res.json({ suggestions });
	} catch (error) {
		console.error(error.message);
		res.status(500).json({ error: 'Failed to fetch city suggestions.' });
	}
};
