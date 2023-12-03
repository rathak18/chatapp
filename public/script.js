    const socket = io();
    const chatMessages = document.getElementById('chat-messages');
    const userNameInput = document.getElementById('user-name');
    const userEmailInput = document.getElementById('user-email');
    const userMobileInput = document.getElementById('user-mobile');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('sendButton');

    // Listen for incoming messages
    socket.on('message', (data) => {
        displayMessage(data);
    });

    // Listen for chat history
    socket.on('chat history', (messages) => {
        messages.forEach((message) => {
            displayMessage(message);
        });
    });

    function sendMessage() {
        const user = userNameInput.value;
        const message = messageInput.value;
        const email = userEmailInput.value;
        const mobile = userMobileInput.value;

        if (user && message) {
            socket.emit('message', { user, message, email, mobile });
            userNameInput.value = '';
            messageInput.value = '';
            userEmailInput.value = '';
            userMobileInput.value = '';
        }
    }

    function displayMessage(data) {
        const messageElement = document.createElement('div');
        messageElement.innerHTML = `<strong>${data.user}:</strong> ${data.message}`;
        chatMessages.appendChild(messageElement);
    }

    // Toggle chat popup
    const chatIcon = document.getElementById('chat-icon');
    const chatPopup = document.getElementById('chat-popup');

    chatIcon.addEventListener('click', () => {
        sendMessage();
        chatPopup.style.display = chatPopup.style.display === 'none' ? 'block' : 'none';
    });
