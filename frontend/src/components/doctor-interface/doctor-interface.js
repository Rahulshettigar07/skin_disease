import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const DoctorChatHistory = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await axios.get('http://localhost:5000/message/chats/doctor', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            Role: localStorage.getItem('role'),
          },
        });
        setUsers(response.data);
        //console.log(response.data);
      } catch (error) {
        console.error('Error fetching chat history for doctor:', error);
      }
    };

    fetchChatHistory();
  }, []);

  return (
    <div className="chat-history">
      <h2>Chat History with Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <Link to={`/chat/${user._id}`}>{user.username}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DoctorChatHistory;
