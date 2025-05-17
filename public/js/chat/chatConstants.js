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
