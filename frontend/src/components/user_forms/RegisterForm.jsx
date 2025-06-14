import React, { useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE;




const RegisterForm = ({ onRegister }) => {

    const [formData, setFormData] = useState({
        accountType: "user",
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

        // Ensure one of the emails is provided
        if (
            (formData.accountType === "organization" && !formData.orgEmail) ||
            (formData.accountType === "user" && !formData.email)
        ) {
            alert("Please fill the required email field.");
            return;
        }



        try {
            const payload = {
                account_type: formData.accountType,
                org_email: formData.orgEmail || null,
                username: formData.username,
                email: formData.email || null,
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
                <label>Registering As</label>
                <div>
                    <div className="form-check form-check-inline">
                        <input
                            type="radio"
                            id="registerUser"
                            name="Type"
                            value="user"
                            checked={formData.accountType === "user"}
                            onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                            className="form-check-input"
                        />
                        <label htmlFor="registerUser" className="form-check-label">User</label>
                    </div>
                    <div className="form-check form-check-inline">
                        <input
                            type="radio"
                            id="registerOrg"
                            name="accountType"
                            value="organization"
                            checked={formData.accountType === "organization"}
                            onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                            className="form-check-input"
                        />
                        <label htmlFor="registerOrg" className="form-check-label">Organization</label>
                    </div>
                </div>
            </div>

            <div className="form-group mb-3">
                <label>Organization Email</label>
                <input
                    type="email"
                    name="orgEmail"
                    className="form-control"
                    value={formData.orgEmail}
                    onChange={handleChange}
                    disabled={formData.accountType === "user"}
                    style={{ backgroundColor: formData.accountType === "user" ? '#e9ecef' : 'white' }}
                    placeholder="e.g. info@company.com"
                // required
                />
            </div>
            <div className="form-group mb-3">
                <label>Full Name</label>
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
                    disabled={formData.accountType === "organization"}
                    style={{ backgroundColor: formData.accountType === "organization" ? '#e9ecef' : 'white' }}
                    placeholder="e.g. user@gmail.com"
                // required
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
