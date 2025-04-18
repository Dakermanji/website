//! public/js/notifications.js

const markBtn = document.getElementById('markAllReadBtn');
if (markBtn) {
	markBtn.addEventListener('click', () => {
		axios
			.post('/notifications/mark-all-read')
			.then(() => location.reload())
			.catch(() =>
				showFlashMessage(
					'danger',
					'Failed to mark notifications as read.'
				)
			);
	});
}
