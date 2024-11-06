import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const DoctorLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState("");
  const [buttonValue, setButtonValue] = useState("Submit");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonValue("Loading..");

    setTimeout(async () => {
      try {
        const response = await axios.post('http://localhost:5000/auth/doctor-login', formData);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', 'doctor');
        navigate('/doctor-interface');
      } catch (error) {
        setButtonValue("Submit");
        setErrors("Invalid username or password");
        console.error(error);
      }
    }, 1000);
  };

  return (
    <div>
      <div className="card">
        <h2>Doctor Login</h2>
        <form className="login" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            onFocus={() => setErrors("")}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            onFocus={() => setErrors("")}
          />
          <input
            type="submit"
            className="button"
            value={buttonValue}
          />
        </form>
        {errors && <p>{errors}</p>}
        <div className="signup-link">
          <p>Don't have an account? <Link to="/doctor-signup">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
