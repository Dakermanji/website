//! public/js/weather.js

const cityInput = document.getElementById('city');
const suggestionsBox = document.getElementById('suggestions');
const weatherResults = document.getElementById('weatherResults');
const daySelector = document.getElementById('daySelector');
const selectedDay = document.getElementById('selectedDay');
const background = document.querySelector('.weather-background');

// Listen to city input
cityInput.addEventListener('input', async () => {
	const query = cityInput.value.trim();
	if (query.length < 3) {
		suggestionsBox.innerHTML = '';
		return;
	}

	showLoading();

	const res = await fetch(
		`/weather/city-suggestions?query=${encodeURIComponent(query)}`
	);
	const data = await res.json();

	hideLoading();

	suggestionsBox.innerHTML = '';

	const typed = cityInput.value.trim().toLowerCase();

	if (!data.suggestions || data.suggestions.length === 0) {
		const item = document.createElement('div');
		item.className = 'list-group-item disabled';
		item.textContent = 'No results found';
		suggestionsBox.appendChild(item);
		return;
	}

	const seen = new Set();

	data.suggestions.forEach((city) => {
		const cityName = city.name.toLowerCase();

		if (!cityName.startsWith(typed)) return;

		const key = `${city.name}-${city.state || ''}-${city.country}`;
		if (seen.has(key)) return;
		seen.add(key);

		const item = document.createElement('div');
		item.className = 'list-group-item';
		const match = cityName.substr(0, typed.length);
		const rest = cityName.substr(typed.length);

		item.innerHTML = `<strong>${match}</strong>${rest}${
			city.state ? ', ' + city.state : ''
		}, ${city.country}`;

		item.dataset.latitude = city.latitude;
		item.dataset.longitude = city.longitude;
		suggestionsBox.appendChild(item);
	});
});

// Handle suggestion click
suggestionsBox.addEventListener('click', async (e) => {
	if (!e.target.classList.contains('list-group-item')) return;

	const latitude = e.target.dataset.latitude;
	const longitude = e.target.dataset.longitude;
	const unit = document.querySelector('input[name="unit"]:checked').value;
	const orientation =
		window.innerWidth >= window.innerHeight ? 'landscape' : 'portrait';

	suggestionsBox.innerHTML = '';
	cityInput.value = e.target.textContent;

	showLoading();

	const res = await fetch('/weather/weather-data', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ latitude, longitude, unit, orientation }),
	});
	const data = await res.json();

	hideLoading();

	displayForecast(data.forecast);
	setBackground(data.backgroundImage);
});

function displayForecast(forecast) {
	weatherResults.hidden = false;
	daySelector.innerHTML = '';

	forecast.forEach((day, index) => {
		const col = document.createElement('div');
		col.className = 'col day-item';
		col.textContent = index === 0 ? 'Today' : day.date;

		if (index === 0) col.classList.add('active');

		col.addEventListener('click', () => {
			document
				.querySelectorAll('.day-item')
				.forEach((el) => el.classList.remove('active'));
			col.classList.add('active');
			showDay(day);
		});

		daySelector.appendChild(col);
	});

	// Show today's weather initially
	showDay(forecast[0]);
}

function showDay(day) {
	document.getElementById('selectedDayDate').textContent = day.date;
	document.getElementById(
		'selectedDayIcon'
	).src = `https://openweathermap.org/img/wn/${day.icon}@2x.png`;
	document.getElementById('selectedDayDescription').textContent =
		day.description;
	document.getElementById(
		'selectedDayTemp'
	).textContent = `${day.min}° / ${day.max}°`;

	// Local time could be fetched in the future if needed, placeholder for now
	document.getElementById('selectedDayLocalTime').textContent = '';
}

function setBackground(url) {
	background.style.opacity = 0;
	setTimeout(() => {
		background.style.backgroundImage = `url(${url})`;
		background.style.opacity = 1;
	}, 300);
}

function showLoading() {
	document.getElementById('loading').classList.add('show');
}

function hideLoading() {
	document.getElementById('loading').classList.remove('show');
}
