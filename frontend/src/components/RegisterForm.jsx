// components/RegisterForm.jsx
import React, { useState } from 'react';

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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        alert(`Registered as ${formData.email}`);
        if (onRegister) onRegister();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
                <label>Organization Email</label>
                <input
                    type="email"
                    name="orgEmail"
                    className="form-control"
                    placeholder="Organization email"
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
                    placeholder="Your full name"
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
                    placeholder="Email"
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
                    placeholder="Password"
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
                    placeholder="Confirm Password"
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
                    placeholder="Phone number (ex: 905411234567)"
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
                    placeholder="Address"
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
