// components/LoginForm.jsx
import React, { useState } from 'react';

const LoginForm = ({ onLogin }) => {
    const [loginData, setLoginData] = useState({ email: '', password: '' });

    const handleChange = (e) => {
        setLoginData({ ...loginData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Logged in as ${loginData.email}`);
        if (onLogin) onLogin();
    };

    return (
        <form onSubmit={handleSubmit}>
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
            <div className="form-group form-check mb-3">
                <input type="checkbox" className="form-check-input" />
                <label className="form-check-label">Remember me</label>
            </div>
            <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
    );
};

export default LoginForm;
