import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const DoctorProfile = () => {
  const { doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/doctor/doctor/${doctorId}`);
        setDoctor(response.data);  // Set the doctor state with the response data
      } catch (error) {
        console.error('Error fetching doctor profile:', error);  // Log any errors
      }
    };

    

    fetchDoctorProfile();  // Call the async function to fetch doctor profile
         // Call the async function to fetch userId
  }, [doctorId]);

  const handleChatClick = () => {
    navigate(`/chat/${doctorId}`); // Pass userId in state
  };

  if (!doctor) return <div>Loading...</div>;

  return (
    <div>
      <h2>{doctor.name}'s Profile</h2>
      <p>Specialization: {doctor.specialization}</p>
      <button onClick={handleChatClick}>Chat</button>
    </div>
  );
};

export default DoctorProfile;
