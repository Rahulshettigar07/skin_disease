const express = require('express');
const { getMessages, sendMessage, getDoctorUserChats, getChatHistory, getChatParticipants } = require('../controller/message');
const {protect} = require('../middleware/auth'); // For token-based authentication
// const {protectDoctor }= require('../middleware/auth');

const router = express.Router();

router.get('/get/:Id', protect, getMessages);  // Get messages between the user and a doctor
router.post('/send', protect, sendMessage);          // Send a message
router.get('/chats/user',protect,getChatHistory);

router.get('/chats/doctor', protect, getDoctorUserChats);
router.get('/participants/:id', protect, getChatParticipants);

module.exports = router;
