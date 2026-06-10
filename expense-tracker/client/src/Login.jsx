import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const Login = ({ setAuth }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {
            const body = { email, password };
            const response = await fetch("http://localhost:5000/login", {
                method: "POST",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(body)
            });

            const parseRes = await response.json();
            
            if (parseRes.token) {
                sessionStorage.setItem("token", parseRes.token);
                setAuth(true);
            } else {
                setError(parseRes);
            }
        } catch (err) {
            setError("Server error occurred.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="icon-wrapper">⟡</div>
                <h1 className="brand-title"><span>Expense</span> Tracker</h1>
                <h2 className="sign-in-title">Welcome Back</h2>
                <p className="register-prompt">
                    New to Expense Tracker? <Link to="/register">Create an account</Link>
                </p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={onSubmitForm} className="login-form">
                    <div className="input-group">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            placeholder="name@gmail.com" 
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="sign-in-btn">Sign In</button>
                </form>
            </div>
        </div>
    );
};

export default Login;