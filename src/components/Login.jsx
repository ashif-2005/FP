import React from "react";
import { useState } from "react";
import axios from "axios";
import './login.css'

const Login = () => {
  const [credentials, setCredentials] = useState({ username: "Friends_Packs", password: "" });

  const url = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Logging in with:", credentials);
    const res = await axios.post(`${url}/user/login`,
      credentials,
      {
        headers: { "Content-Type": "application/json" },
      }
    )
    if(res.status == 200){
      alert("Login Successfull...")
      document.cookie = `token=${res.data.token}`;
      location.reload();
    }
  };

  return (
    <div className="page-container">
      <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Welcome Back</h2>

        <div className="input-group">
          <label htmlFor="email">Username</label>
          <input 
            type="text" 
            id="email" 
            name="username"
            value={credentials.username}
            onChange={handleChange}
            required 
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            name="password"
            value={credentials.password}
            onChange={handleChange}
            required 
          />
        </div>

        <button type="submit" className="login-button">Login</button>

        <p className="signup-link">Don't have an account? <a href="#">Sign up</a></p>
      </form>
      </div>
    </div>
  );
};

export default Login;
