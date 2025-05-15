//! public/js/chat/chatConstants.js

const socket = io();
const roomModal = document.getElementById('room-modal');
const openModalBtn = document.getElementById('open-room-modal');
const closeModalBtn = document.querySelector('.close-modal');
const roomForm = document.getElementById('room-form');
const roomNameInput = document.getElementById('room-name');
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
const membersModal = document.getElementById('members-modal');
const openMembersBtn = document.getElementById('open-members-modal');
const closeMembersBtn = membersModal?.querySelector('.close-modal');
const addMemberForm = document.getElementById('add-member-form');
const sidebarItemsForms = document.querySelectorAll('.sidebar-item form');
