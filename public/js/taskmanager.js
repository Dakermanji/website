//! public/js/taskmanager.js

// 📌 Utility function to display flash messages
function showFlashMessage(type, message) {
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

// 📌 Handle task creation and update
async function submitTaskForm(event, formId, requestType, taskId = null) {
	event.preventDefault();

	const formData = new FormData(document.getElementById(formId));
	const taskData = {
		projectId: formData.get('projectId'),
		name: formData.get('name'),
		assignedTo: formData.get('assigned_to'),
		dueDate: formData.get('due_date'),
	};

	try {
		const url = taskId
			? `/taskmanager/tasks/update/${taskId}`
			: '/taskmanager/tasks/create';

		const response = await fetch(url, {
			method: requestType,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(taskData),
		});

		const result = await response.json();
		console.log(result);

		if (response.ok) {
			showFlashMessage(
				'success',
				taskId
					? 'Task updated successfully!'
					: 'Task created successfully!'
			);
			location.reload();
		} else {
			showFlashMessage(
				'danger',
				result.error || 'Task submission failed.'
			);
		}
	} catch (error) {
		showFlashMessage('danger', 'Error processing task request.');
	}
}

// 📌 Open the edit task modal and populate it
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

// 📌 Handle task creation and editing event listeners
document.getElementById('createTaskForm')?.addEventListener('submit', (e) => {
	submitTaskForm(e, 'createTaskForm', 'POST');
});

document.getElementById('editTaskForm')?.addEventListener('submit', (e) => {
	const taskId = document.getElementById('edit-task-id').value;
	submitTaskForm(e, 'editTaskForm', 'PUT', taskId);
});

// 📌 Function to delete a task
async function deleteTask(taskId) {
	try {
		const response = await fetch(`/taskmanager/tasks/${taskId}`, {
			method: 'DELETE',
		});

		if (response.ok) {
			showFlashMessage('success', 'Task deleted successfully!');
			location.reload();
		} else {
			showFlashMessage('danger', 'Failed to delete task.');
		}
	} catch (error) {
		showFlashMessage('danger', 'Error deleting task.');
	}
}

// 📌 Handle task deletion button click
document.getElementById('confirmDeleteTask')?.addEventListener('click', () => {
	const taskId = document.getElementById('deleteTaskModal').dataset.taskId;
	deleteTask(taskId);
});

// 📌 Function to open the delete task modal
function openDeleteTaskModal(taskId) {
	const modal = document.getElementById('deleteTaskModal');
	modal.dataset.taskId = taskId;
	const deleteModalInstance = new bootstrap.Modal(modal);
	deleteModalInstance.show();
}

// 📌 Function to update task status via drag and drop
async function updateTaskStatus(taskId, newStatus) {
	try {
		const response = await fetch(`/taskmanager/tasks/${taskId}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ status: newStatus }),
		});

		if (response.ok) {
			showFlashMessage('success', 'Task status updated successfully!');
		} else {
			showFlashMessage('danger', 'Failed to update task status.');
		}
	} catch (error) {
		showFlashMessage('danger', 'Error updating task status.');
	}
}

// 📌 Drag-and-drop functionality
function allowDrop(event) {
	event.preventDefault();
}

function drag(event, taskId) {
	event.dataTransfer.setData('taskId', taskId);
}

function drop(event, newStatus) {
	event.preventDefault();
	const taskId = event.dataTransfer.getData('taskId');
	if (taskId) {
		updateTaskStatus(taskId, newStatus);
		event.target.appendChild(
			document.querySelector(`[data-task-id="${taskId}"]`)
		);
	}
	removeDropHighlight(newStatus);
}

// 📌 Highlight drop zones
function highlightDropZone(status) {
	document.getElementById(status)?.classList.add('drop-highlight');
}

function removeDropHighlight(status) {
	document.getElementById(status)?.classList.remove('drop-highlight');
}

// 📌 Initialize drag-and-drop event listeners
document.querySelectorAll('.task-column').forEach((column) => {
	column.addEventListener('dragover', allowDrop);
	column.addEventListener('drop', (event) => drop(event, column.id));
	column.addEventListener('dragenter', () => highlightDropZone(column.id));
	column.addEventListener('dragleave', () => removeDropHighlight(column.id));
});

// 📌 Function to handle collaborator addition
document
	.getElementById('addCollaboratorForm')
	?.addEventListener('submit', async (e) => {
		e.preventDefault();

		const formData = new FormData(
			document.getElementById('addCollaboratorForm')
		);
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
				showFlashMessage('success', 'User added as collaborator!');
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

// 📌 Function to remove a collaborator
async function removeCollaborator(userId, projectId) {
	try {
		const response = await fetch(
			`/taskmanager/collaborations/remove/${userId}/${projectId}`,
			{ method: 'DELETE' }
		);
		if (response.ok) {
			showFlashMessage('success', 'Collaborator removed successfully!');
			location.reload();
		} else {
			showFlashMessage('danger', 'Failed to remove collaborator.');
		}
	} catch (error) {
		showFlashMessage('danger', 'Error removing collaborator.');
	}
}

// 📌 Function to delete a project
async function deleteProject(projectId) {
	try {
		const response = await fetch(`/taskmanager/${projectId}`, {
			method: 'DELETE',
		});

		if (response.ok) {
			showFlashMessage('success', 'Project deleted successfully!');
			window.location.href = '/taskmanager'; // Redirect to the projects page
		} else {
			showFlashMessage('danger', 'Failed to delete project.');
		}
	} catch (error) {
		showFlashMessage('danger', 'Error deleting project.');
	}
}

// Handle Project Creation
document
	.getElementById('createProjectForm')
	?.addEventListener('submit', async (e) => {
		e.preventDefault();

		const formData = new FormData(createProjectForm);
		const projectName = formData.get('name');

		try {
			const response = await fetch('/taskmanager/create', {
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

// 📌 Handle project deletion button click
document
	.getElementById('confirmDeleteProject')
	?.addEventListener('click', () => {
		const projectId =
			document.getElementById('deleteProjectModal').dataset.projectId;
		deleteProject(projectId);
	});

// 📌 Function to open the delete project modal
function openDeleteProjectModal(projectId) {
	const modal = document.getElementById('deleteProjectModal');
	modal.dataset.projectId = projectId;
	const deleteModalInstance = new bootstrap.Modal(modal);
	deleteModalInstance.show();
}
