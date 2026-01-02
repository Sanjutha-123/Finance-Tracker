import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../Styles/auth.css";

import { signup } from "../Api/auth";



const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // reset error

    try {
      await signup(username, email, password);
      alert("Signup successful");
      navigate("/login"); // redirect
    } catch (err) {
      setError(err.message); // show backend error
    }
  };



  return (
 <div className="auth-page">
    <div className="register-card">
      <img
        src="https://cdn-icons-png.flaticon.com/512/5087/5087579.png"
        alt="Logo"
      />
      <h1 className="signup-text">Signup</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit" className="login-btn">
          Sign Up
        </button>
      </form>

      <div className="divider">
        <hr />
        <span>OR</span>
        <hr />
      </div>

              <p className="account-text">
          Already have an account?
          <span className="link-text" onClick={() => navigate("/login")}>
            {" "}Login
          </span>

      </p>
    </div>
    </div>
  
  );
};

export default Signup;