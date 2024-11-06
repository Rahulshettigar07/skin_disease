import React, { useEffect, useState ,useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import '../stylesheet/chat-user-interface.css';

const socket = io('http://localhost:5000', { path: '/socket.io' });

const ChatPage = () => {
  const { Id } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [userRole, setUserRole] = useState('');
  const [userId, setUserId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const messagesEndRef = useRef(null);
  useEffect(() => {
    const fetchChatParticipants = async () => {
      
      try {
        const response = await axios.get(`http://localhost:5000/message/participants/${Id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            Role: localStorage.getItem('role'),
          },
        });
        const role = localStorage.getItem('role');
        if(role==='user'){
          setUserId(response.data.userId);
        }
        else if(role==='doctor'){
        setDoctorId(response.data.doctorId);
        }
        console.log(userId);
        console.log(doctorId);
      } catch (error) {
        console.error('Error fetching chat participants:', error);
      }
    };
    const role = localStorage.getItem('role');
    if(role==='user'){
      const roomId = `${Id}-${userId}`;
        socket.emit('joinRoom', roomId);
    }
    else if(role==='doctor'){
    const roomId = `${doctorId}-${Id}`;
        socket.emit('joinRoom', roomId);
    }

    fetchChatParticipants();
  }, [Id,userId,doctorId]);

  useEffect(() => {
    // Get user role from local storage
    const role = localStorage.getItem('role');
    setUserRole(role);
    console.log(role);
    console.log(Id);

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/message/get/${Id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            Role: localStorage.getItem('role')
          },
        });
        const { messages: fetchedMessages } = response.data;
    setMessages(fetchedMessages);

    // Set userId and doctorId from response data
    //setUserId(userId);
   
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    socket.on('message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.off('message');
    };
  }, [Id]);
  useEffect(() => {
    // Scroll to the latest message when messages are updated
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (message.trim()) {
      const newMessage = {
        message,
        timestamp: new Date(),
        sender: userRole, // Use the user role to determine the sender
      };
  
      // Determine which IDs to include based on the user's role
      if (userRole === 'user') {
        newMessage.doctorId = Id; // User's doctor ID
        newMessage.userId = userId; // You need to ensure this is defined, e.g., from local storage or props
        console.log(newMessage.doctorId);
        console.log(newMessage.userId);
      } else if (userRole === 'doctor') {
        newMessage.userId =Id ; // Doctor needs to know which user they're messaging
        newMessage.doctorId = doctorId; // Doctor's ID (you may need to define this)
        console.log(newMessage.doctorId);
        console.log(newMessage.userId);
      }
  
      // Emit the message to the server
     // socket.emit('sendMessage', newMessage);
     if(userRole==='user'){
      const roomId = `${Id}-${userId}`;
     socket.emit('sendMessage', newMessage, roomId);
     }
     else if(userRole==='doctor'){
      const roomId = `${doctorId}-${Id}`;
      socket.emit('sendMessage', newMessage, roomId);
     }

      // Clear the input field
      setMessage('');
  
      try {
        // Save the message in the database
        await axios.post('http://localhost:5000/message/send', newMessage, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            Role: localStorage.getItem('role'),
          },
        });
      } catch (error) {
        console.error('Error saving message:', error);
      }
    }
  };
  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) { // Check for Shift key to allow line breaks
      event.preventDefault(); // Prevent line break
      handleSendMessage(); // Call the send message function
    }
  };
  
  return (
    <div className="chat-container">
      <h2>Chat with {userRole === 'user' ? 'Doctor' : 'User'}</h2>
      <div className="chat-window">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${
              (userRole === 'user' && msg.sender === 'user') || (userRole === 'doctor' && msg.sender === 'doctor')
                ? 'user-message'
                : 'doctor-message'
            }`}
          >
            <div className="message-content">{msg.message}</div>
            <div className="message-timestamp">
              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="input-container">
      <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={handleKeyPress} // Add key press event handler here
          rows={3} // Adjust number of visible rows
          style={{ resize: 'none', width: '100%' }} // Disable resize and set width
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatPage;
