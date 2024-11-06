import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

//import './stylesheet/login.css';
import axios from 'axios';

const Login = () => {
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
        
        const response = await axios.post('http://localhost:5000/auth/login', formData);
        console.log('hi');
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('role', 'user');
        navigate('/doctors');
      } catch (error) {
        setButtonValue("Submit");
        //setErrors("Invalid username or password");
        console.error(error);
      }
    }, 1000);
  };

  return (
    <div>
      <div className="card">
        <h2>Login</h2>
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
        {errors.length > 0 && (
          <p>{errors}</p>
        )}
        <div className="signup-link">
          <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
