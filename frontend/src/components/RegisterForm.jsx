import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE;

const RegisterForm = ({ onRegister }) => {
    const [formData, setFormData] = useState({
        orgEmail: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        address: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            const payload = {
                org_email: formData.orgEmail,
                username: formData.username,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                address: formData.address
            };

            const response = await axios.post(`${API_BASE}/auth/register`, payload);
            alert(response.data.message);
            if (onRegister) onRegister();
        } catch (error) {
            alert(error.response?.data?.detail || "Registration failed.");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
                <label>Organization Email</label>
                <input
                    type="email"
                    name="orgEmail"
                    className="form-control"
                    value={formData.orgEmail}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group mb-3">
                <label>User Full Name</label>
                <input
                    type="text"
                    name="username"
                    className="form-control"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group mb-3">
                <label>Personal Email</label>
                <input
                    type="email"
                    name="email"
                    className="form-control"
                    value={formData.email}
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
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group mb-3">
                <label>Confirm Password</label>
                <input
                    type="password"
                    name="confirmPassword"
                    className="form-control"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group mb-3">
                <label>Phone Number</label>
                <input
                    type="tel"
                    name="phone"
                    className="form-control"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />
            </div>
            <div className="form-group mb-3">
                <label>Address</label>
                <textarea
                    name="address"
                    className="form-control"
                    rows="2"
                    value={formData.address}
                    onChange={handleChange}
                    required
                />
            </div>
            <button type="submit" className="btn btn-success w-100">Register</button>
        </form>
    );
};

export default RegisterForm;
