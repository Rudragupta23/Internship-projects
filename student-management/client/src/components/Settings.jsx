import { useState, useEffect, useRef } from "react";
import { FiBell, FiMoon, FiShield, FiX, FiUser, FiMail, FiUploadCloud, FiDatabase, FiSmartphone } from "react-icons/fi";

const Settings = () => {
  // 1. Load actual user data from Login (Fallback to default if not found)
  const savedUser = JSON.parse(localStorage.getItem("user")) || { name: "Admin User", email: "admin@edumanage.com" };
  const [profile, setProfile] = useState(savedUser);
  
  // 2. Load Profile Picture from Local Storage
  const [profilePic, setProfilePic] = useState(localStorage.getItem("profilePic") || null);

  // 3. System Settings State
  const [emailNotifs, setEmailNotifs] = useState(() => localStorage.getItem("emailNotifs") !== "false");
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  
  // NEW FEATURE: Login Alerts (Replaces 2FA)
  const [loginAlerts, setLoginAlerts] = useState(() => localStorage.getItem("loginAlerts") === "true");

  // Modal State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editFormData, setEditFormData] = useState(profile);
  const fileInputRef = useRef(null);

  // Dark Mode Engine
  useEffect(() => {
    if (darkMode) {
      document.body.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Handle Profile Picture Upload (Convert to Base64 to save in LocalStorage)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result);
        localStorage.setItem("profilePic", reader.result); // Persists across refreshes
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Edit Profile Details
  const handleSaveProfile = () => {
    setProfile(editFormData);
    localStorage.setItem("user", JSON.stringify(editFormData)); // Save updated name/email
    setIsEditProfileOpen(false);
  };

  // Toggle Handlers
  const toggleNotifs = () => { setEmailNotifs(!emailNotifs); localStorage.setItem("emailNotifs", !emailNotifs); };
  const toggleAlerts = () => { setLoginAlerts(!loginAlerts); localStorage.setItem("loginAlerts", !loginAlerts); };

  return (
    <div className="animate-slide-up" style={{ maxWidth: "800px" }}>
      
      {/* --- Profile Card --- */}
      <div className="profile-card">
        {/* Dynamic Avatar: Shows Image if uploaded, otherwise shows first letter of Name */}
        <div className="avatar-circle" style={{ 
            backgroundImage: profilePic ? `url(${profilePic})` : 'none', 
            backgroundSize: 'cover', backgroundPosition: 'center',
            color: profilePic ? 'transparent' : 'white'
        }}>
          {!profilePic && profile.name.charAt(0).toUpperCase()}
        </div>
        
        <div>
          <h2 style={{ color: "var(--text-main)", fontSize: "24px", marginBottom: "4px", textTransform: "capitalize" }}>
            {profile.name}
          </h2>
          <p style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "6px" }}>
            <FiShield style={{ color: "var(--primary)" }}/> {profile.email}
          </p>
        </div>
        
        <button onClick={() => { setEditFormData(profile); setIsEditProfileOpen(true); }} style={{ marginLeft: "auto", padding: "10px 20px", border: "1px solid var(--border)", borderRadius: "8px", background: "transparent", color: "var(--text-main)", cursor: "pointer", fontWeight: "600" }}>
          Edit Profile
        </button>
      </div>

      {/* --- Preferences Card --- */}
      <div className="form-container" style={{ marginBottom: "24px", padding: "32px" }}>
        <h3 style={{ color: "var(--text-main)", borderBottom: "1px solid var(--border)", paddingBottom: "16px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
          <FiBell /> Preferences & Notifications
        </h3>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <h4 style={{ color: "var(--text-main)", marginBottom: "4px" }}>Email Notifications</h4>
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Receive alerts when new students enroll.</p>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" checked={emailNotifs} onChange={toggleNotifs} />
            <span className="slider"></span>
          </label>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h4 style={{ color: "var(--text-main)", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
              <FiMoon/> Dark Mode
            </h4>
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Switch dashboard to a beautiful dark theme.</p>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
            <span className="slider"></span>
          </label>
        </div>
      </div>

      {/* --- NEW FEATURE: Data & Privacy Card --- */}
      <div className="form-container" style={{ padding: "32px" }}>
        <h3 style={{ color: "var(--text-main)", borderBottom: "1px solid var(--border)", paddingBottom: "16px", marginBottom: "24px", display: "flex", alignItems: "center", gap: "10px" }}>
          <FiDatabase /> Data & Privacy
        </h3>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
          <div>
            <h4 style={{ color: "var(--text-main)", marginBottom: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
              <FiSmartphone /> New Login Alerts
            </h4>
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Get notified if anyone logs in from an unrecognized device.</p>
          </div>
          <label className="toggle-switch">
            <input type="checkbox" checked={loginAlerts} onChange={toggleAlerts} />
            <span className="slider"></span>
          </label>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: "24px" }}>
          <div>
            <h4 style={{ color: "var(--text-main)", marginBottom: "4px" }}>Export Admin Data</h4>
            <p style={{ color: "var(--text-muted)", fontSize: "14px" }}>Download a JSON file of your system configurations.</p>
          </div>
          <button onClick={() => alert("Your data export will begin shortly.")} style={{ padding: "10px 20px", border: "1px solid var(--primary)", color: "var(--primary)", background: "rgba(79, 70, 229, 0.1)", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>
            Request Data
          </button>
        </div>
      </div>

      {/* =========================================
          EDIT PROFILE MODAL
      ========================================= */}
      {isEditProfileOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3 style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              Edit Profile <FiX style={{ cursor: "pointer", color: "var(--text-muted)" }} onClick={() => setIsEditProfileOpen(false)} />
            </h3>

            {/* Profile Picture Upload Section */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: "24px" }}>
              <div className="avatar-circle" style={{ 
                  width: "100px", height: "100px", fontSize: "40px", marginBottom: "12px",
                  backgroundImage: profilePic ? `url(${profilePic})` : 'none', 
                  backgroundSize: 'cover', backgroundPosition: 'center', color: profilePic ? 'transparent' : 'white'
              }}>
                {!profilePic && editFormData.name.charAt(0).toUpperCase()}
              </div>
              
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: "none" }} />
              
              <button onClick={() => fileInputRef.current.click()} style={{ display: "flex", alignItems: "center", gap: "8px", background: "transparent", border: "none", color: "var(--primary)", fontWeight: "600", cursor: "pointer" }}>
                <FiUploadCloud /> {profilePic ? "Change Picture" : "Upload Picture"}
              </button>
            </div>

            {/* Input Fields */}
            <div className="premium-form-group" style={{ marginBottom: "16px" }}>
              <label className="form-label">Full Name</label>
              <input type="text" className="premium-input" value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} />
              <FiUser className="input-icon-left" />
            </div>
            
            <div className="premium-form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="premium-input" value={editFormData.email} onChange={(e) => setEditFormData({...editFormData, email: e.target.value})} />
              <FiMail className="input-icon-left" />
            </div>
            
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setIsEditProfileOpen(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleSaveProfile}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Settings;