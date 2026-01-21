import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Signup.css";
import API_URL from "../../api";

const Signup = () => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState({
        email: "",
        password: "",
        username: "",
    });
    const { email, password, username } = inputValue;

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
        try {
            const { data } = await axios.post(
                `${API_URL}/signup`,
                {
                    ...inputValue,
                },
                { withCredentials: true }
            );
            const { success, message, token } = data;
            if (success) {
                handleSuccess(message);
                if (token) {
                    localStorage.setItem("token", token);
                }
                setInputValue({
                    email: "",
                    password: "",
                    username: "",
                });
                setTimeout(() => {
                    navigate("/login");
                }, 1000);
            } else {
                handleError(message);
            }
        } catch (error) {
            console.log(error);
            handleError("Signup failed. Please try again.");
        }
    };

    return (
        <div className="auth-container">
            <div className="form-box">
                <h1>Create Account</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="username"
                        value={username}
                        placeholder="Name"
                        onChange={handleOnChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        value={email}
                        placeholder="Email"
                        onChange={handleOnChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        value={password}
                        placeholder="Password"
                        onChange={handleOnChange}
                        required
                    />
                    <button type="submit">Sign Up</button>
                </form>
                <p className="switch-text">
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;