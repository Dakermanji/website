//! public/js/taskmanager.js

// Dragging logic
function drag(event, taskId) {
	event.dataTransfer.setData('taskId', taskId);
}

// Allow dropping
function allowDrop(event) {
	event.preventDefault();
}

// Handle drop and update task status
async function drop(event, newStatus) {
	event.preventDefault();
	const taskId = event.dataTransfer.getData('taskId');

	try {
		const response = await fetch(`/taskmanager/tasks/${taskId}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ status: newStatus }),
		});

		if (response.ok) {
			location.reload(); // Refresh UI after update
		} else {
			console.error('Failed to update task status');
		}
	} catch (error) {
		console.error('Error updating task:', error);
	}
}

const createProjectForm = document.getElementById('createProjectForm');

createProjectForm?.addEventListener('submit', async (e) => {
	e.preventDefault();

	const formData = new FormData(createProjectForm);
	const projectName = formData.get('name');

	try {
		const response = await fetch('/taskmanager/projects/create', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name: projectName }),
		});

		if (response.ok) {
			location.reload();
		} else {
			console.error('Failed to create project');
		}
	} catch (error) {
		console.error('Error creating project:', error);
	}
});
