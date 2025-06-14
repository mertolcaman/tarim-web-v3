import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE;

const LoginForm = ({ onLogin }) => {
    const [loginData, setLoginData] = useState({
        account_type: "user", // default to user
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_BASE}/auth/login`, loginData);
            alert(response.data.message);
            if (onLogin) onLogin();
        } catch (error) {
            alert(error.response?.data?.detail || "Login failed.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
                <label>Login As</label>
                <p></p>
                <div className="form-check form-check-inline">
                    <input
                        type="radio"
                        id="loginUser"
                        name="account_type"
                        value="user"
                        checked={loginData.account_type === "user"}
                        onChange={handleChange}
                        className="form-check-input"
                    />
                    <label htmlFor="loginUser" className="form-check-label">User</label>
                </div>
                <div className="form-check form-check-inline">
                    <input
                        type="radio"
                        id="loginOrg"
                        name="account_type"
                        value="organization"
                        checked={loginData.account_type === "organization"}
                        onChange={handleChange}
                        className="form-check-input"
                    />
                    <label htmlFor="loginOrg" className="form-check-label">Organization</label>
                </div>
            </div>

            <div className="form-group mb-3">
                <label>Email address</label>
                <input
                    type="email"
                    name="email"
                    className="form-control"
                    placeholder="Enter email"
                    value={loginData.email}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group mb-3">
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    className="form-control"
                    placeholder="Password"
                    value={loginData.password}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
    );
};

export default LoginForm;
