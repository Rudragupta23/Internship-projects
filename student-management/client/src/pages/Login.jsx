import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMail, FiLock } from "react-icons/fi";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", formData);
      
      // Save the token securely
      localStorage.setItem("token", response.data.token);
      
      // SAVE THE USER DATA FOR THE SETTINGS PAGE
      localStorage.setItem("user", JSON.stringify(response.data.user));
      
      // Redirect to the main application dashboard
      navigate("/dashboard");
    } catch (err) {
      if (err.response && err.response.data.error) {
        alert(err.response.data.error); 
      } else {
        alert("Invalid Credentials");
      }
      console.error(err.response?.data);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Please enter your details to sign in.</p>
        
        <form onSubmit={onSubmit}>
          <div className="input-group">
            <input 
              type="email" name="email" value={email} onChange={onChange} 
              placeholder="Admin Email" className="auth-input" required 
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

          <button type="submit" className="auth-btn">Sign In</button>
        </form>
        <div style={{ textAlign: "center", marginTop: "24px", paddingTop: "24px", borderTop: "1px solid var(--border)" }}>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <FiLock size={12} /> Restricted access. Internal use only.
            </p>
        </div>
        {/* The sign up link has been completely removed for security */}
      </div>
    </div>
  );
};

export default Login;