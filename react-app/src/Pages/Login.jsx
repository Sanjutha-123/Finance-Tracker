import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../Api/auth.js";
import "../App.css";

export default function Login() {
  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      // Save JWT token
      localStorage.setItem("token", data.token);
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };


  return (
    <div className="login-card">
      {/* Logo */}
      <img
        src="https://cdn-icons-png.flaticon.com/512/5087/5087579.png"
        alt="App Logo"
      />

      <h2>Login</h2>

      {/* Email */}
       <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="username"
      />

      {/* Password */}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
      />

      {/* Remember & error */}
      <div className="login-options">
        <label className="remember-me">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          Remember
        </label>
        {error && <p style={{ color: "red", margin: 0 }}>{error}</p>}
      </div>

      {/* Login Button */}
      <button className="login-btn" onClick={handleSubmit}>
        Login
      </button>
</form>
      {/* Divider */}
      <div className="divider">
        <hr />
        <span>OR</span>
        <hr />
      </div>

      {/* Signup link */}
      <p style={{ marginTop: "15px" }}>
        Don’t have an account? <a href="/signup">Sign Up</a>
      </p>
    </div>
  );
}