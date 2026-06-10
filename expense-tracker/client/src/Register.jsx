import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Login.css';

const Register = ({ setAuth }) => {
    const [name, setName] = useState(''); 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const onSubmitForm = async (e) => {
        e.preventDefault();
        try {
            const body = { name, email, password };
            const response = await fetch("http://localhost:5000/register", {
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
                <h2 className="sign-in-title">Create Account</h2>
                <p className="register-prompt">
                    Already part of Application? <Link to="/login">Sign In</Link>
                </p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={onSubmitForm} className="login-form">
                    <div className="input-group">
                        <label>Full Name</label>
                        <input 
                            type="text" 
                            placeholder="e.g. Firstname Lastname" 
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </div>
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
                        <label>Create Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••" 
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            minLength="6"
                        />
                    </div>
                    <button type="submit" className="sign-in-btn">Initialize Account</button>
                </form>
            </div>
        </div>
    );
};

export default Register;