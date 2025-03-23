import React from "react";

const Login = () => {
  return (
    <div className="container">
      <div className="left-section">
        <div className="logo"> 
          <h1>FRIENDS PACKS</h1>
        </div>
        <h2>Welcome to Friends Packs Billing Software</h2>
        <p>Log in to access your software and continue where you left off. Use your Username and password for authentication.</p>
        <button className="btn">Login</button>
      </div>
      <div className="right-section">
        <div className="login-box">
          <h2>Login</h2>
          <form>
            <label>Username</label>
            <input type="text" placeholder="Enter your username" className="input-field" />
            <label>Password</label>
            <input type="password" placeholder="Enter your password" className="input-field" />
            <div className="forgot-password">
              <a href="#">Forgot Password?</a>
            </div>
            <button className="btn login-btn">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
