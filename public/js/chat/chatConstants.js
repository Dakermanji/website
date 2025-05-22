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

//? Kick Modal
const openKickModalBtns = document.querySelectorAll('.open-kick-modal');
const closeKickModalBtn = document
	.getElementById('kick-modal')
	?.querySelector('.close-modal');
const blockForm = document.querySelector('#kick-modal form[action*="block"]');

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
const members = window.chatConfig.roomMembers;
const blockedMembers = members.filter((m) => m.blocked).map((m) => m.user_id);

//* Helper Functions
// Virtual RoomId for friends
function getFriendRoomId(userId, friendId) {
	return userId < friendId
		? `friend-${userId}-${friendId}`
		: `friend-${friendId}-${userId}`;
}

// auto-scroll to bottom on new message
function addMessage(
	senderId,
	sender,
	message,
	timestamp,
	isOwn = false,
	isBlocked = false,
	shouldShowSender = true
) {
	const div = document.createElement('div');
	div.classList.add('message');
	div.classList.add(isOwn ? 'own' : 'friend');
	if (isBlocked) div.classList.add('blocked');
	div.dataset.userId = senderId;

	const bubble = document.createElement('div');
	bubble.classList.add('message-bubble');

	// Optional label for non-own messages in rooms/tasks
	const showSender = projectName !== 'chat' && !isOwn;

	bubble.innerHTML =
		showSender && shouldShowSender
			? `<strong class="d-block mb-1">${sender}${
					isBlocked && !isOwn
						? ' <i class="bi bi-slash-circle text-danger ms-1" title="Blocked"></i>'
						: ''
			  }</strong>${message}`
			: message;

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

// URL project name
function projectNameToUrl(name) {
	if (name === 'chat') return 'friends';
	if (name === 'room') return 'rooms';
	if (name === 'taskmanager') return 'tasks';
	return '';
}

// Re-Render messages after (un)block
function updateBlockedStyles() {
	const messages = messagesDiv.querySelectorAll('.message');

	messages.forEach((msgEl) => {
		const userId = msgEl.dataset.userId;
		const isNowBlocked = window.chatConfig.blockedMembers.includes(userId);
		const bubble = msgEl.querySelector('.message-bubble');

		// Reset blocked class
		msgEl.classList.remove('blocked');

		if (bubble) {
			// Remove previous blocked icon if it exists
			const senderLine = bubble.querySelector('strong');
			if (senderLine) {
				const icon = senderLine.querySelector('.bi-slash-circle');
				if (icon) senderLine.removeChild(icon);
			}
		}

		// Add blocked styles and icon if user is now blocked
		if (isNowBlocked) {
			msgEl.classList.add('blocked');

			const senderLine = bubble?.querySelector('strong');
			if (
				senderLine &&
				!senderLine.innerHTML.includes('bi-slash-circle')
			) {
				const icon = document.createElement('i');
				icon.className = 'bi bi-slash-circle text-danger ms-1';
				icon.title = 'Blocked';
				senderLine.appendChild(icon);
			}
		}
	});
}

// Readable Date
const getReadableDate = (date) => {
	const today = new Date();
	const msgDate = new Date(date);

	const isToday = msgDate.toDateString() === today.toDateString();

	const yesterday = new Date();
	yesterday.setDate(today.getDate() - 1);

	const isYesterday = msgDate.toDateString() === yesterday.toDateString();

	if (isToday) return 'Today';
	if (isYesterday) return 'Yesterday';

	return msgDate.toLocaleDateString(undefined, {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
};
