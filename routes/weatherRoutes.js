//! routes/weatherRoutes.js

import express from 'express';
import {
	renderWeatherPage,
	fetchWeatherData,
	fetchCitySuggestions,
} from '../controllers/weatherController.js';

const router = express.Router();

// Render the input form and initial weather view
router.get('/', renderWeatherPage);

// Handle fetching weather data based on user input
router.post('/weather-data', fetchWeatherData);

// Handle fetching city suggestions for autocomplete
router.get('/city-suggestions', fetchCitySuggestions);

export default router;
