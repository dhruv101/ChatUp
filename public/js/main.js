const chatForm = document.querySelector('#chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.querySelector('#room-name');
const userList = document.querySelector('#users');

//Get username and room from URL
const { username, room } = Qs.parse(location.search, {
	ignoreQueryPrefix: true
});

const socket = io();

//Join chatroom
socket.emit('joinRoom', { username, room });

//Get room and users
socket.on('roomUsers', ({ room, users }) => {
	outputRoomName(room);
	outputUsers(users);
});

//System Message from server
socket.on('systemMsg', message => {
	outputSystemMessage(message);

	//Scroll down
	chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Chat Message from server
socket.on('chatMsg', message => {
	outputChatMessage(message);

	//Scroll down
	chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Message submit
chatForm.addEventListener('submit', e => {
	e.preventDefault();

	//Get message text
	const msg = e.target.elements.msg.value;

	//Emit message to server
	socket.emit('chatMessage', msg);

	//Clear input
	e.target.elements.msg.value = '';
	e.target.elements.msg.focus();
});

//Output system message to DOM
function outputSystemMessage(message) {
	const div = document.createElement('div');
	div.classList.add('message');
	div.classList.add('system-message');

	div.innerHTML = `<p>
                        ${message.text}
                     </p>`;
	document.querySelector('.chat-messages').appendChild(div);
}

//Output chat message to DOM
function outputChatMessage(message) {
	const div = document.createElement('div');
	div.classList.add('message');

	//checking if the message is sent by this user
	if (socket.id === message.id) {
		div.classList.add('self-message');
	} else {
		div.classList.add('others-message');
	}

	div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
                     <p class="text">
                        ${message.text}
                     </p>`;
	document.querySelector('.chat-messages').appendChild(div);
}

//Add room name to DOM
function outputRoomName(room) {
	roomName.innerText = room;
}

//Add users to DOM
function outputUsers(users) {
	userList.innerHTML = `
    ${users.map(user => `<li>${user.username}</li>`).join('')}
    `;
}
