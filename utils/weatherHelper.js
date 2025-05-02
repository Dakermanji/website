//! utils/weatherHelper.js

import axios from 'axios';
import env from '../config/dotenv.js';

const OPENWEATHER_API_KEY = env.OPENWEATHER_API_KEY;

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
