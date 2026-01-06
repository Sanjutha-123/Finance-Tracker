import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../Api/auth.js";
import "../Styles/Auth.css";
 // Make sure your CSS is in styles folder

function Login() {
  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Auto-fill remembered email if exists
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRemember(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter email and password");
      return;
    }

    try {
      const data = await login(email, password);

      const token = data.token || data.accessToken || data.data?.token;
      if (!token) {
        setError("Login failed: no token returned");
        return;
      }

      // Save JWT token
      localStorage.setItem("token", token);

      // Save email if remember checked, else remove
      if (remember) {
        localStorage.setItem("rememberEmail", email);
      } else {
        localStorage.removeItem("rememberEmail");
      }

      // Navigate to dashboard
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="login-card">
        <img
          src="https://cdn-icons-png.flaticon.com/512/5087/5087579.png"
          alt="App Logo"
        />

        <h1 className="login-text">Login</h1>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />

          <div className="auth-options">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>

            {error && <p className="error-text">{error}</p>}
          </div>

          <button className="login-btn" type="submit">
            Login
          </button>
        </form>

        <div className="divider">
          <hr />
          <span>OR</span>
          <hr />
        </div>

        <p className="account-text">
          Don’t have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
