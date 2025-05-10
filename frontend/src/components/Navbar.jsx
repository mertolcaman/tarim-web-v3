// components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ onLogout }) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
            <Link className="navbar-brand" to="/">IoT Dashboard</Link>
            <div className="collapse navbar-collapse">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                        <Link className="nav-link" to="/">Sensors</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/devices">Devices</Link>
                    </li>
                </ul>
                <button className="btn btn-outline-light" onClick={onLogout}>Logout</button>
            </div>
        </nav>
    );
};

export default Navbar;
