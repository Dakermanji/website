//! utils/countries.js

import { getName } from 'country-list';
import tzlookup from 'tz-lookup';

export function getCountryName(code) {
	return getName(code) || code;
}

export function getTimezone(lat, lon) {
	try {
		return tzlookup(lat, lon);
	} catch (err) {
		console.error('Error resolving timezone:', err);
		return null;
	}
}
