const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const mongoose = require('mongoose');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
require('dotenv').config(); // Load environment variables from .env file

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Database connected");
        server.listen(process.env.PORT || 3000, () => {
            console.log(`Server is running on port ${process.env.PORT || 3000}`);
        });
    })
    .catch((err) => {
        console.log("Error connecting to the database:", err);
    });

const chatSchema = new mongoose.Schema({
    user: String,
    message: String,
    email: String,
    mobile: String
});

const Chat = mongoose.model('Chat', chatSchema);

app.use(express.static('public'));

io.on('connection', async (socket) => {
    console.log('User connected: ' + socket.id);

    // Send chat history to the user on connection
    try {
        const messages = await Chat.find({});
        socket.emit('chat history', messages);
    } catch (error) {
        console.error('Error fetching chat history:', error);
    }

    socket.on('message', async (data) => {
        const { user, message, email, mobile } = data;

        // Save the message to MongoDB
        try {
            const chatMessage = new Chat({ user, message, email, mobile });
            await chatMessage.save();
            io.emit('message', data); // Broadcast the message to all connected clients
        } catch (error) {
            console.error('Error saving chat message:', error);
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected: ' + socket.id);
    });
});
