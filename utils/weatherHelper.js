//! utils/weatherHelper.js

import axios from 'axios';
import env from '../config/dotenv.js';

const OPENWEATHER_API_KEY = env.OPENWEATHER_API_KEY;

// Placeholder for fetching weather by coordinates
export const getWeatherByCoordinates = async (latitude, longitude, unit) => {
	// Placeholder
	return {
		latitude,
		longitude,
		unit,
		forecast: [],
	};
};

// fetching city suggestions
export const getCitySuggestions = async (query) => {
	try {
		const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
			query
		)}&limit=10&appid=${OPENWEATHER_API_KEY}`;
		const response = await axios.get(url);

		const cities = response.data;

		if (!cities || cities.length === 0) {
			return [];
		}

		return cities.map((city) => ({
			name: city.name,
			latitude: city.lat,
			longitude: city.lon,
			country: city.country,
			state: city.state || null,
		}));
	} catch (error) {
		console.error('Error fetching city suggestions:', error.message);
		return [];
	}
};
