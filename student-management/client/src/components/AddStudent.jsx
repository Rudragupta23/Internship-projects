import { useState } from "react";
import { FiUser, FiMail, FiHash, FiBook, FiAward, FiPhone } from "react-icons/fi";
import axios from "axios";

const AddStudent = () => {
  const [formData, setFormData] = useState({
    name: "", email: "", phone: "", enrollment_number: "", department: "Computer Science & Engineering", current_semester: 1
  });
  const [status, setStatus] = useState({ type: "", message: "" });

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/students", formData);
      setStatus({ type: "success", message: "Student successfully registered!" });
      setFormData({ name: "", email: "", phone: "", enrollment_number: "", department: "Computer Science & Engineering", current_semester: 1 });
      setTimeout(() => setStatus({ type: "", message: "" }), 3000);
    } catch (err) {
      setStatus({ type: "error", message: "Error saving student. Enrollment or Email might exist." });
    }
  };

  return (
    <div className="form-container animate-slide-up" style={{ padding: "32px", maxWidth: "900px" }}>
      <h3 style={{ fontSize: "24px", marginBottom: "24px" }}>Register New Student</h3>
      
      {status.message && (
        <div className="animate-fade-in" style={{ padding: "16px", marginBottom: "20px", borderRadius: "8px", backgroundColor: status.type === 'success' ? 'rgba(22, 163, 74, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: status.type === 'success' ? '#16a34a' : '#ef4444', fontWeight: "600" }}>
          {status.message}
        </div>
      )}

      <form onSubmit={onSubmit}>
        <div className="form-grid">
          <div className="premium-form-group">
            <label className="form-label">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={onChange} required placeholder="e.g. Aarav Sharma" className="premium-input" />
            <FiUser className="input-icon-left" />
          </div>

          <div className="premium-form-group">
            <label className="form-label">Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={onChange} required placeholder="aarav@example.com" className="premium-input" />
            <FiMail className="input-icon-left" />
          </div>

          <div className="premium-form-group">
            <label className="form-label">Phone Number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={onChange} required placeholder="+91 98765 43210" className="premium-input" />
            <FiPhone className="input-icon-left" />
          </div>

          <div className="premium-form-group">
            <label className="form-label">Enrollment Number</label>
            <input type="text" name="enrollment_number" value={formData.enrollment_number} onChange={onChange} required placeholder="e.g. CS-123" className="premium-input" />
            <FiHash className="input-icon-left" />
          </div>

          <div className="premium-form-group">
  <label className="form-label">Department / Stream</label>
  <select name="department" value={formData.department} onChange={onChange} className="premium-input" style={{ paddingLeft: "40px" }}>
    <option value="Computer Science & Engineering">Computer Science & Engineering</option>
    <option value="Information Technology">Information Technology</option>
    <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
    <option value="Electronics & Communication">Electronics & Communication</option>
    <option value="Electrical Engineering">Electrical Engineering</option>
    <option value="Mechanical Engineering">Mechanical Engineering</option>
    <option value="Civil Engineering">Civil Engineering</option>
    <option value="Aerospace Engineering">Aerospace Engineering</option>
    <option value="Biotechnology">Biotechnology</option>
    <option value="Chemical Engineering">Chemical Engineering</option>
    <option value="Robotics & Automation">Robotics & Automation</option>
  </select>
  <FiBook className="input-icon-left" />
</div>

          <div className="premium-form-group">
            <label className="form-label">Current Semester (1-10)</label>
            <input type="number" name="current_semester" value={formData.current_semester} onChange={onChange} min="1" max="10" required className="premium-input" />
            <FiAward className="input-icon-left" />
          </div>
        </div>
        
        <div style={{ marginTop: "30px", borderTop: "1px solid var(--border)", paddingTop: "24px", display: "flex", justifyContent: "flex-end" }}>
          <button type="submit" className="submit-btn" style={{ fontSize: "16px", padding: "14px 32px", display: "flex", alignItems: "center", gap: "10px", background: "var(--primary)" }}>
            <FiUser /> Save Student Record
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;