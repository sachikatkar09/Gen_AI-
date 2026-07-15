import React, { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "../hooks/useAuth";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { loading, handleRegister } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const result = await handleRegister({ username, email, password });
    if (result.success) navigate("/dashboard");
    else setError(result.error || "Registration failed. Please check your details and try again.");
  };

  if (loading) {
    return (
      <main>
        <h1>Loading.......</h1>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-header">
            <div className="auth-logo">👤</div>
            <h1 className="auth-title">Create your account</h1>
            <p className="auth-subtitle">Start your interview journey today.</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            {error && <div className="auth-error">{error}</div>}

            <div className="auth-input-group">
              <label htmlFor="username" className="auth-label">Username</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">👤</span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  type="text"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  className="auth-input"
                  required
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label htmlFor="email" className="auth-label">Email</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">✉️</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  className="auth-input"
                  required
                />
              </div>
            </div>

            <div className="auth-input-group">
              <label htmlFor="password" className="auth-label">Password</label>
              <div className="auth-input-wrapper">
                <span className="auth-input-icon">🔒</span>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  className="auth-input"
                  required
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
            </div>

            <button type="submit" className="auth-button auth-button--primary">
              Register
            </button>

            <div className="auth-divider">
              <span>OR</span>
            </div>

            <button type="button" className="auth-button auth-button--google">
              <span className="auth-button-icon">🔵</span>
              Continue with Google
            </button>
          </form>

          <div className="auth-footer">
            <p>Already have an account? <Link to="/login" className="auth-link auth-link--highlight">Login</Link></p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Register;
