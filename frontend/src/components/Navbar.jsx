// components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
            <Link className="navbar-brand" to="/">IoT Dashboard</Link>

            {/* Mobile Toggle Button */}
            <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            {/* Collapsible Content */}
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Sensors</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/devices">Devices</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/chat">Assistant Chat</Link>
                    </li>
                </ul>
                <button className="btn btn-outline-light" onClick={onLogout}>Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;

