import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMail, FiLock, FiUser } from "react-icons/fi";
import axios from "axios";

const Register = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const { name, email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", formData);
      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err) {
      alert("Registration failed. Email might exist.");
      console.error(err.response.data);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join the student management platform.</p>
        
        <form onSubmit={onSubmit}>
          <div className="input-group">
            <input 
              type="text" name="name" value={name} onChange={onChange} 
              placeholder="Full Name" className="auth-input" required 
            />
            <FiUser className="input-icon" />
          </div>

          <div className="input-group">
            <input 
              type="email" name="email" value={email} onChange={onChange} 
              placeholder="Email Address" className="auth-input" required 
            />
            <FiMail className="input-icon" />
          </div>

          <div className="input-group">
            <input 
              type="password" name="password" value={password} onChange={onChange} 
              placeholder="Password" className="auth-input" required 
            />
            <FiLock className="input-icon" />
          </div>

          <button type="submit" className="auth-btn">Sign Up</button>
        </form>

        <p className="auth-link-text">
          Already have an account? <Link to="/login" className="auth-link">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;