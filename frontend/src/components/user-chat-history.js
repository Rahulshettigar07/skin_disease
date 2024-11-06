import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ChatHistory = () => {
  const [doctors, setDoctors] = useState([]);
 // const userId = localStorage.getItem('userId'); // Assuming you store userId in localStorage

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get('http://localhost:5000/message/chats/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`, // Include token in headers if needed
            Role: localStorage.getItem('role')
          },
        });
        setDoctors(response.data);
        
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };

    fetchChatHistory();
  }, []);

  return (
    <div className="chat-history">
      <h2>Chat History</h2>
      <ul>
        {doctors.map((doctor) => (
          <li key={doctor._id}>
            <Link to={`/chat/${doctor._id}`}> {doctor._id}</Link>
          </li>
        ))}  
      </ul>
    </div>
  );
};

export default ChatHistory;
