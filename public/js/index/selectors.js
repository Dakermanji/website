//! public/js/index/selectors.js

// Main elements
const main = document.querySelector('main');
const projects = document.querySelectorAll('.work');
const seeMoreBtn = document.getElementById('see-more-btn');
const tabLinks = document.querySelectorAll('.tab-links');
const urlParams = new URLSearchParams(window.location.search);

// Modals
const authModal = document.getElementById('authModal');
const authUtilityModal = document.getElementById('authUtilityModal');
const resetPasswordModal = document.getElementById('resetPasswordModal');

// Modal Buttons
const openModalBtn = document.getElementById('openAuthModal');
const closeModalBtn = document.getElementById('closeModal');
const openUtilityModalBtn = document.getElementById('openAuthUtility');
const closeUtilityModalBtn = document.getElementById('closeUtilityModal');
const closeResetPasswordModalBtn = document.getElementById(
	'closeResetPasswordModal'
);

// Login/Register Tabs
const tabs = document.querySelectorAll('#authTabs .nav-link');
const tabContents = document.querySelectorAll('.auth-tab-content');
