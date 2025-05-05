// components/Login.jsx
import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const Login = ({ onLogin }) => {
    const [isRegistering, setIsRegistering] = useState(false);

    return (
        <div className="container-fluid d-flex align-items-center justify-content-center min-vh-100 bg-light">
            <div className="card shadow p-4 w-100" style={{ maxWidth: '500px' }}>
                <div className="card-body">
                    <h3 className="card-title text-center mb-4">
                        {isRegistering ? 'Register' : 'Login'}
                    </h3>

                    {isRegistering ? (
                        <RegisterForm onRegister={onLogin} />
                    ) : (
                        <LoginForm onLogin={onLogin} />
                    )}

                    <p className="mt-3 text-center">
                        <button className="btn btn-link" onClick={() => setIsRegistering(!isRegistering)}>
                            {isRegistering
                                ? 'Already have an account? Login here'
                                : "Don't have an account? Register here"}
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
