//! data/navBar.js

export const navBar = {
	index: [
		{
			link: '#about',
			text: 'About',
			icon: '<i class="bi bi-file-person"></i>',
		},
		{
			link: '#services',
			text: 'Services',
			icon: '<i class="bi bi-boxes"></i>',
		},
		{
			link: '#portfolio',
			text: 'Portfolio',
			icon: '<i class="bi bi-person-workspace"></i>',
		},
		{
			link: '#contact',
			text: 'Contact',
			icon: '<i class="bi bi-telephone"></i>',
		},
		{
			link: '/projects',
			text: 'Projects',
			icon: '<i class="bi bi-view-list"></i>',
		},
	],
	projects: [
		{
			link: '#',
			text: 'Friends',
			icon: '<i class="bi bi-people"></i>',
			id: 'trigger-friends-modal',
		},
		{
			link: '/weather',
			icon: '<i class="bi bi-thermometer-half"></i>',
			text: 'Weather',
		},
		{
			link: '/chat',
			icon: '<i class="bi bi-chat-dots"></i>',
			text: 'Chat',
		},
		{
			link: '/visited',
			icon: '<i class="bi bi-map"></i>',
			text: 'Visited Countries',
		},
		{
			link: '/books',
			icon: '<i class="bi bi-book"></i>',
			text: 'Books Reviews',
		},
	],
};
