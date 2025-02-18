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

// Modify create task form to handle errors
createTaskForm?.addEventListener('submit', async (e) => {
	e.preventDefault();

	const formData = new FormData(createTaskForm);
	const taskName = formData.get('name');
	const assignedTo = formData.get('assigned_to');
	const dueDate = formData.get('due_date');
	const projectId = formData.get('projectId');

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

		const result = await response.json();

		if (response.ok) {
			showFlashMessage('success', 'Task created successfully!');
			location.reload();
		} else {
			showFlashMessage(
				'danger',
				result.error || 'Failed to create task.'
			);
		}
	} catch (error) {
		showFlashMessage('danger', 'Error creating task.');
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

// Modify add collaborator form to handle errors
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

		const result = await response.json();

		if (response.ok) {
			showFlashMessage('success', 'User added to project successfully!');
			location.reload();
		} else {
			showFlashMessage(
				'danger',
				result.error || 'Failed to add collaborator.'
			);
		}
	} catch (error) {
		showFlashMessage('danger', 'Error adding collaborator.');
	}
});

const deleteProjectButton = document.getElementById('confirmDeleteProject');

if (deleteProjectButton) {
	deleteProjectButton.addEventListener('click', async () => {
		const projectId =
			document.getElementById('deleteProjectModal').dataset.projectId;

		try {
			const response = await axios.delete(
				`/taskmanager/projects/${projectId}`
			);

			if (response.status === 200) {
				console.log('Project deleted successfully');
				window.location.href = '/taskmanager/projects'; // Redirect to project list
			} else {
				console.error('Failed to delete project');
			}
		} catch (error) {
			console.error('Error deleting project:', error);
		}
	});
}

async function handleTaskUpdate(taskId, updateData) {
	try {
		const response = await axios.put(
			`/taskmanager/tasks/${taskId}`,
			updateData
		);

		if (response.status === 200) {
			showFlashMessage('success', 'Task updated successfully!');
		} else {
			showFlashMessage('danger', 'Failed to update task.');
		}
	} catch (error) {
		showFlashMessage('danger', 'Error updating task.');
	}
}

async function showFlashMessage(type, message) {
	const flashContainer = document.createElement('div');
	flashContainer.className = `flash-message alert alert-${type} alert-dismissible fade show text-center`;

	flashContainer.innerHTML = `
        ${message}
		<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
	document.body.appendChild(flashContainer);

	setTimeout(() => {
		flashContainer.classList.add('fade');
		setTimeout(() => flashContainer.remove(), 500);
	}, 4000);
}

// Open the edit task modal and populate it with task details
function openEditTaskModal(taskId, name, assignedTo, dueDate) {
	document.getElementById('edit-task-id').value = taskId;
	document.getElementById('edit-task-name').value = name;
	document.getElementById('edit-task-assigned-to').value = assignedTo || '';
	document.getElementById('edit-task-due-date').value = dueDate
		? new Date(dueDate).toISOString().split('T')[0]
		: '';

	const editTaskModal = new bootstrap.Modal(
		document.getElementById('editTaskModal')
	);
	editTaskModal.show();
}

// Handle task update submission
document
	.getElementById('editTaskForm')
	?.addEventListener('submit', async (e) => {
		e.preventDefault();

		const taskId = document.getElementById('edit-task-id').value;
		const updatedTask = {
			name: document.getElementById('edit-task-name').value,
			assignedTo: document.getElementById('edit-task-assigned-to').value,
			dueDate: document.getElementById('edit-task-due-date').value,
		};

		try {
			const response = await fetch(
				`/taskmanager/tasks/update/${taskId}`,
				{
					method: 'PUT',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(updatedTask),
				}
			);

			if (response.ok) {
				showFlashMessage('success', 'Task updated successfully!');
				location.reload();
			} else {
				const result = await response.json();
				showFlashMessage(
					'danger',
					result.error || 'Failed to update task.'
				);
			}
		} catch (error) {
			showFlashMessage('danger', 'Error updating task.');
		}
	});
