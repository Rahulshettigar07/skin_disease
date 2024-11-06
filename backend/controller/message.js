const Message = require('../models/Message');


exports.getChatParticipants = async(req, res) => {
  const role = req.role;
  const userId = req.user._id; // Extracted from JWT token
  
  let chatParticipants;

  if (role === 'user') {
    // If the role is 'user', `doctorId` comes from the route parameters, and `userId` is from the JWT token.
    chatParticipants = { userId };
    console.log("g",chatParticipants);
  } else if (role === 'doctor') {
    // If the role is 'doctor', `userId` comes from the route parameters, and `doctorId` is from the JWT token.
    chatParticipants = {  doctorId: userId };
    console.log("g",chatParticipants);
  } else {
    return res.status(400).json({ message: 'Invalid role' });
  }

  return res.json(chatParticipants);
};

exports.getMessages = async (req, res) => {
  const { Id: paramId } = req.params; // This ID is either userId or doctorId based on the role
  const userId = req.user._id; // Extracted from JWT token
  const role = req.role; // Get the role from the middleware
  
  try {
    let messages;
   

    if (role === 'user') {
      // If the role is user, params will contain doctorId, and userId comes from token
      messages = await Message.find({ doctorId: paramId, userId }).sort({ timestamp: 1 });
    
    } else if (role === 'doctor') {
      // If the role is doctor, params will contain userId, and doctorId comes from token
      const doctorId = req.user._id;
      messages = await Message.find({ doctorId, userId: paramId }).sort({ timestamp: 1 });
      
      
    }
    //console.log(messages);
    // Include both userId and doctorId in the response
    res.json({messages});

  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
};


exports.sendMessage = async (req, res) => {
  const { message, sender } = req.body; // Sender is now a general field
  let userId ; // Extracted from JWT token
  const role = req.role; // Get the role from the middleware
  let doctorId;

  // Check the role to determine the appropriate IDs
  if (role === 'user') {
    doctorId = req.body.doctorId; // doctorId comes from the request body for users
    userId = req.user._id; // Use user's ID from the token
  } else if (role === 'doctor') {
    doctorId = req.user._id; // Use doctor's ID from the token
    userId=req.body.userId;
    // console.log(doctorId);
    // console.log(userId);
  }

  try {
    const newMessage = new Message({
      doctorId,
      userId,
      message,
      sender, // Sender is determined from the request body
      timestamp: new Date()
    });

    const savedMessage = await newMessage.save();
    res.json(savedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Error saving message' });
  }
};


exports.getChatHistory = async (req, res) => {
  try {
    console.log(req.user._id);
    const  userId  = req.user._id;
    
    // Find unique doctor IDs for this user
   console.log("hi");
    const doctors = await Message.aggregate([
      { $match: { userId: userId } },
      { $group: { _id: '$doctorId' } }
    ]);
    
    //console.log(doctors);
    res.json(doctors);
    // console.log(doctors);
    // console.log("ok");
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving chat history' });
  }
};


exports.getDoctorUserChats = async (req, res) => {
  try {
    const doctorId = req.user.id;
   // console.log(doctorId);

    // Find all messages involving this doctor
    const messages = await Message.find({ doctorId }).populate('userId', 'username');
    // console.log(messages);

    // Filter out unique users based on userId
    const uniqueUsers = [];
    const seenUserIds = new Set();

    messages.forEach((message) => {
      if (!seenUserIds.has(message.userId._id.toString())) {
        seenUserIds.add(message.userId._id.toString());
        uniqueUsers.push(message.userId);
      }
    });

    res.json(uniqueUsers);
    // console.log(uniqueUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users who messaged this doctor" });
  }
};