//! utils/weatherHelper.js

import axios from 'axios';
import env from '../config/dotenv.js';

const OPENWEATHER_API_KEY = env.OPENWEATHER_API_KEY;
const UNSPLASH_ACCESS_KEY = env.UNSPLASH_ACCESS_KEY;

// Fetching weather by coordinates
export const getWeatherByCoordinates = async (latitude, longitude, unit) => {
	try {
		const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=${unit}&appid=${OPENWEATHER_API_KEY}`;
		const response = await axios.get(url);

		const forecastList = response.data.list;

		// Group forecasts by day
		const dailyData = {};

		forecastList.forEach((item) => {
			const date = item.dt_txt.split(' ')[0];

			if (!dailyData[date]) {
				dailyData[date] = {
					date,
					min: item.main.temp,
					max: item.main.temp,
					descriptions: [item.weather[0].description],
					icons: [item.weather[0].icon],
				};
			} else {
				dailyData[date].min = Math.min(
					dailyData[date].min,
					item.main.temp
				);
				dailyData[date].max = Math.max(
					dailyData[date].max,
					item.main.temp
				);
				dailyData[date].descriptions.push(item.weather[0].description);
				dailyData[date].icons.push(item.weather[0].icon);
			}
		});

		// Prepare simplified forecast array (only next 5 days)
		const forecast = Object.values(dailyData)
			.slice(0, 5)
			.map((day) => ({
				date: day.date,
				min: day.min,
				max: day.max,
				// Get the most common description/icon
				description: mostCommon(day.descriptions),
				icon: mostCommon(day.icons),
			}));

		return forecast;
	} catch (error) {
		console.error('Error fetching weather forecast:', error.message);
		return [];
	}
};

// Fetching city suggestions
export const getCitySuggestions = async (query) => {
	try {
		const parsed = parseCityInput(query);
		let q = parsed.city;

		if (parsed.state) {
			q += `,${parsed.state}`;
		}

		if (parsed.country) {
			q += `,${parsed.country}`;
		}

		const url = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
			q
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

// Helper function to get most common item in array
function mostCommon(arr) {
	const counts = {};
	let max = 0,
		result = arr[0];

	arr.forEach((item) => {
		counts[item] = (counts[item] || 0) + 1;
		if (counts[item] > max) {
			max = counts[item];
			result = item;
		}
	});

	return result;
}

// Fetching Background Image
export const getBackgroundImage = async (description, orientation) => {
	try {
		const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
			description
		)}&orientation=${orientation}&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`;
		const response = await axios.get(url);

		if (response.data.results.length > 0) {
			return response.data.results[0].urls.full; // or regular/small as needed
		} else {
			return null;
		}
	} catch (error) {
		console.error('Error fetching background image:', error.message);
		return null;
	}
};

// Helper: Sanitize city name
function sanitizeCityName(city) {
	return city
		.toLowerCase()
		.split(' ')
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ')
		.trim();
}

// City Input to match City, State, Country
function parseCityInput(query) {
	const parts = query.split(',').map((part) => part.trim());

	return {
		city: parts[0] || '',
		state: parts[1] || '',
		country: parts[2] || parts[1] || '', // If only 2 parts, assume second is country
	};
}
