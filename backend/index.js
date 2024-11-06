require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const authRoutes = require('./routes/auth');
const doctorRoutes = require('./routes/doctor');
const messageRoutes = require('./routes/message');

// const morgan = require('morgan')
const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/real-time-chat', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/auth', authRoutes);
app.use('/doctor',doctorRoutes);
app.use('/message',messageRoutes);

// socket
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // You can configure this to specific origins
    methods: ['GET', 'POST']
  }
});

// Socket.io setup
io.on('connection', (socket) => {
 console.log('New socket connection:', socket.id);

 socket.on('joinRoom', (roomId) => {
  socket.join(roomId);
  console.log(`User joined room: ${roomId}`);
});

// Handle sendMessage event to broadcast messages within the room
socket.on('sendMessage', async (newMessage, roomId) => {
  console.log('Received message:', newMessage);

  // Broadcast to everyone in the room
  io.to(roomId).emit('message', newMessage);

  // console.log('Message sent:', messageData);
  });

  socket.on('disconnect', () => {
   console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
