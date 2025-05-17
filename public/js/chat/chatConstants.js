//! public/js/chat/chatConstants.js

const socket = io();

const sidebarItemsForms = document.querySelectorAll('.sidebar-item form');

//* Modals
//? Room
const roomModal = document.getElementById('room-modal');
const openRoomModalBtn = document.getElementById('open-room-modal');
const closeRoomModalBtn = document.querySelector('.close-room-modal');
const roomForm = document.getElementById('room-form');
const roomNameInput = document.getElementById('room-name');

//? Room Members
const membersModal = document.getElementById('members-modal');
const openMembersBtn = document.getElementById('open-members-modal');
const closeMembersBtn = membersModal?.querySelector('.close-modal');
const addMemberForm = document.getElementById('add-member-form');

//? Leave Modal
const leaveModal = document.getElementById('leave-modal');
const openLeaveModalBtn = document.getElementById('open-leave-modal');
const closeLeaveModalBtn = leaveModal?.querySelector('.close-modal');

//? Delete Modal
const deleteModal = document.getElementById('delete-modal');
const openDeleteModalBtn = document.getElementById('open-delete-modal');
const closeDeleteModalBtn = deleteModal?.querySelector('.close-modal');

//* Message
const form = document.getElementById('messageForm');
const input = document.getElementById('messageInput');
const messagesDiv = document.getElementById('messages');
const roomId = window.chatConfig?.roomId;
const projectName = window.chatConfig?.projectName;
const username = window.chatConfig?.username;
const links = document.querySelectorAll('.sidebar-item a');
const toggles = document.querySelectorAll('.toggle-section');
const isFriendChat = projectName === 'chat';
const actualRoomId = isFriendChat
	? getFriendRoomId(window.chatConfig.userId, roomId)
	: roomId;

//* Helper Functions
// Virtual RoomId for friends
function getFriendRoomId(userId, friendId) {
	return userId < friendId
		? `friend-${userId}-${friendId}`
		: `friend-${friendId}-${userId}`;
}

// auto-scroll to bottom on new message
function addMessage(sender, message, timestamp, isOwn = false) {
	const div = document.createElement('div');
	div.classList.add('message');
	div.classList.add(isOwn ? 'own' : 'friend');

	const bubble = document.createElement('div');
	bubble.classList.add('message-bubble');
	bubble.textContent = message;

	const time = document.createElement('div');
	time.classList.add('message-time');
	time.textContent = new Date(timestamp).toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit',
	});

	if (isOwn) {
		div.appendChild(time);
		div.appendChild(bubble);
	} else {
		div.appendChild(bubble);
		div.appendChild(time);
	}

	messagesDiv.appendChild(div);
	messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

function projectNameToUrl(name) {
	if (name === 'chat') return 'friends';
	if (name === 'room') return 'rooms';
	if (name === 'taskmanager') return 'tasks';
	return '';
}
