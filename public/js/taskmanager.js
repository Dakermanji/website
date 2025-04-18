//! public/js/taskmanager.js

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

		if (response.ok) {
			location.reload(); // server flash message will be shown after reload
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
			location.reload();
		} else {
			showFlashMessage('danger', 'Failed to delete task.');
		}
	} catch (error) {
		showFlashMessage(
			'danger',
			"Oops! We couldn't delete this task right now."
		);
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

// 📌 Highlight drop zones
function highlightDropZone(status) {
	document.getElementById(status)?.classList.add('drop-highlight');
}

function removeDropHighlight(status) {
	document.getElementById(status)?.classList.remove('drop-highlight');
}

// Get User Role from hidden element
const userRole = document.getElementById('user-role')?.dataset.userRole;

// Enable SortableJS only for editors and owners
if (userRole === 'editor' || userRole === 'owner') {
	document.querySelectorAll('.task-column').forEach((column) => {
		new Sortable(column, {
			group: 'tasks',
			animation: 150,
			onEnd: function (evt) {
				const taskId = evt.item.dataset.taskId;
				const newStatus = evt.to.dataset.status;
				const oldStatus = evt.from.dataset.status;

				if (
					!taskId ||
					!newStatus ||
					!oldStatus ||
					newStatus === oldStatus
				)
					return;

				axios
					.put(`/taskmanager/tasks/${taskId}`, {
						status: newStatus,
					})
					.then((res) => {
						showFlashMessage(
							'success',
							'Task status updated successfully!'
						);
					})
					.catch((err) => {
						showFlashMessage(
							'danger',
							'Failed to update task status.'
						);
					});
			},
		});
	});
}

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
