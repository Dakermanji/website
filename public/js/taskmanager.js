//! public/js/taskmanager.js

document.querySelectorAll('.task-card').forEach((task) => {
	task.setAttribute('draggable', 'true');
	task.addEventListener('dragstart', (event) => {
		drag(event, task.dataset.taskId);
	});
});

// Highlight full column when dragging over
function highlightDropZone(status) {
	const column = document.getElementById(status);
	if (column) {
		column.classList.add('drop-highlight');
	}
}

// Remove highlight when leaving drop zone
function removeDropHighlight(status) {
	const column = document.getElementById(status);
	if (column) {
		column.classList.remove('drop-highlight');
	}
}

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
	event.target.classList.remove('drop-highlight');

	const taskId = event.dataTransfer.getData('taskId');

	if (!taskId) {
		console.error('Task ID is missing');
		return;
	}

	const taskElement = document.querySelector(`[data-task-id="${taskId}"]`);
	const oldColumn = taskElement.parentElement; // Save old column in case rollback is needed

	// Add transition effect before moving
	taskElement.style.opacity = '0.5';
	taskElement.style.transform = 'scale(0.95)';

	try {
		const response = await axios.put(`/taskmanager/tasks/${taskId}`, {
			status: newStatus,
		});

		if (response.status === 200) {
			console.log('Task status updated successfully');

			// Move task visually to the new column
			setTimeout(() => {
				document.getElementById(newStatus).appendChild(taskElement);
				taskElement.style.opacity = '1';
				taskElement.style.transform = 'scale(1)';
				taskElement.classList.add('task-bounce');

				// Remove bounce class after animation
				setTimeout(() => {
					taskElement.classList.remove('task-bounce');
				}, 200);
			}, 200);
		} else {
			console.error('Failed to update task status');
			rollbackTaskMove(taskElement, oldColumn);
		}
	} catch (error) {
		console.error('Error updating task:', error);
		rollbackTaskMove(taskElement, oldColumn);
	}
}

// Rollback task move if request fails
function rollbackTaskMove(taskElement, oldColumn) {
	setTimeout(() => {
		oldColumn.appendChild(taskElement);
		taskElement.style.opacity = '1';
		taskElement.style.transform = 'scale(1)';
	}, 200);
}

const createProjectForm = document.getElementById('createProjectForm');

const createTaskForm = document.getElementById('taskForm');

const addCollaboratorForm = document.getElementById('addCollaboratorForm');

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

createTaskForm?.addEventListener('submit', async (e) => {
	e.preventDefault(); // Prevent default form submission

	const formData = new FormData(createTaskForm);
	const taskName = formData.get('name');
	const assignedTo = formData.get('assigned_to');
	const dueDate = formData.get('due_date');

	const projectId = formData.get('projectId'); // Ensure the modal contains the project ID

	try {
		const response = await fetch('/taskmanager/tasks/create', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				projectId,
				name: taskName,
				assignedTo,
				dueDate,
			}),
		});

		if (response.ok) {
			location.reload(); // Refresh UI to show the new task
		} else {
			console.error('Failed to create task');
		}
	} catch (error) {
		console.error('Error creating task:', error);
	}
});

async function addCollaborator(projectId, userId, role) {
	try {
		const response = await fetch('/taskmanager/collaborations/add', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ projectId, userId, role }),
		});

		if (response.ok) {
			location.reload(); // Refresh UI after adding
		} else {
			console.error('Failed to add collaborator');
		}
	} catch (error) {
		console.error('Error adding collaborator:', error);
	}
}

async function removeCollaborator(userId, projectId) {
	try {
		const response = await fetch(
			`/taskmanager/collaborations/remove/${userId}/${projectId}`,
			{
				method: 'DELETE',
			}
		);

		if (response.ok) {
			location.reload(); // Refresh UI after removal
		} else {
			console.error('Failed to remove collaborator');
		}
	} catch (error) {
		console.error('Error removing collaborator:', error);
	}
}

addCollaboratorForm?.addEventListener('submit', async (e) => {
	e.preventDefault();

	const formData = new FormData(addCollaboratorForm);
	const projectId = formData.get('projectId');
	const email = formData.get('email');
	const role = formData.get('role');

	try {
		const response = await fetch('/taskmanager/collaborations/add', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ projectId, email, role }),
		});

		if (response.ok) {
			location.reload(); // Refresh to show the new collaborator
		} else {
			console.error('Failed to add collaborator');
		}
	} catch (error) {
		console.error('Error adding collaborator:', error);
	}
});
