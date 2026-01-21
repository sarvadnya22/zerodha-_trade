import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import API_URL from "../../api";

const Login = () => {
  const navigate = useNavigate();
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { email, password } = inputValue;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) => alert(err);
  const handleSuccess = (msg) => alert(msg);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `${API_URL}/login`,
        {
          ...inputValue,
        },
        { withCredentials: true }
      );
      console.log(data);
      const { success, message, token } = data;
      if (success) {
        if (token) {
          localStorage.setItem("token", token);
        }
        const isLocal =
          window.location.hostname === "localhost" ||
          window.location.hostname === "127.0.0.1";
        const dashboardUrl = isLocal
          ? "http://localhost:3001"
          : "https://zenotrade-dashboard.onrender.com";
        window.location.href = `${dashboardUrl}?token=${token}`;
      } else {
        handleError(message);
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      handleError("Login failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="form-box">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            value={email}
            placeholder="Email"
            onChange={handleOnChange}
            required
            disabled={isLoading}
          />
          <input
            type="password"
            name="password"
            value={password}
            placeholder="Password"
            onChange={handleOnChange}
            required
            disabled={isLoading}
          />
          <button type="submit" disabled={isLoading} className={isLoading ? 'loading' : ''}>
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Logging in...
              </>
            ) : (
              'Login'
            )}
          </button>
        </form>
        <p className="switch-text">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
