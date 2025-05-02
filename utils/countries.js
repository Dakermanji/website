//! utils/countries.js

import { getName } from 'country-list';

export function getCountryName(code) {
	return getName(code) || code;
}
