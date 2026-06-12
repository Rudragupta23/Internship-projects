import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiBookOpen, FiLogOut, FiHome, FiSettings, FiUserPlus, FiTrendingUp, FiAward, FiClock, FiArrowRight } from "react-icons/fi";
import axios from "axios";

import AddStudent from "../components/AddStudent";
import StudentList from "../components/StudentList";
import Settings from "../components/Settings";

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({ totalStudents: 0, departments: 0, recentStudents: [] });
  
  // Safely get the user's name from local storage
  const savedUser = JSON.parse(localStorage.getItem("user")) || { name: "Admin" };
  const firstName = savedUser.name.split(" ")[0];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");

    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/students");
        const students = response.data;
        const uniqueDepts = new Set(students.map(s => s.department));
        
        // Grab the 4 most recently added students
        const recent = students.slice(0, 4);

        setStats({ 
          totalStudents: students.length, 
          departments: uniqueDepts.size,
          recentStudents: recent
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="sidebar-header" style={{ padding: "24px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: "12px", fontSize: "20px", fontWeight: "bold" }}>
          <FiBookOpen style={{ color: "var(--primary)", fontSize: "24px" }} />
          <span>Student Manager</span>
        </div>
        
        <nav className="sidebar-nav" style={{ padding: "20px 0", flex: 1, overflowY: "auto" }}>
          <div className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}><FiHome /> Overview</div>
          <div className={`nav-item ${activeTab === 'students' ? 'active' : ''}`} onClick={() => setActiveTab('students')}><FiUsers /> Students Directory</div>
          <div className={`nav-item ${activeTab === 'add' ? 'active' : ''}`} onClick={() => setActiveTab('add')}><FiUserPlus /> Add Student</div>
          <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}><FiSettings /> Settings</div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        
        {/* THE UNIFIED HEADER */}
        <header className="top-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", padding: "0 32px", boxSizing: "border-box", minHeight: "70px" }}>
          <h2 style={{ fontSize: "22px", textTransform: "capitalize", color: "var(--text-main)", margin: 0 }}>
            {activeTab.replace('-', ' ')}
          </h2>
          <button onClick={handleLogout} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 16px", background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", transition: "all 0.2s" }}>
            <FiLogOut /> Logout
          </button>
        </header>

        {/* Dynamic Content Section */}
        <section className="dashboard-content" style={{ padding: "32px" }}>
          
          {/* --- BEAUTIFUL NEW OVERVIEW --- */}
          {activeTab === 'overview' && (
            <div className="animate-slide-up">
              
              {/* Premium Welcome Banner */}
              <div style={{ background: "linear-gradient(135deg, var(--primary) 0%, #7c3aed 100%)", color: "white", padding: "32px", borderRadius: "16px", marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)" }}>
                <div>
                  {/* Changed h2 to div to bypass global CSS overrides */}
                  <div style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "8px", color: "#ffffff" }}>
                    Welcome back, {firstName}! 👋
                  </div>
                  {/* Changed p to div so it stays pure white/transparent */}
                  <div style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "15px" }}>
                    Here is what's happening with your institution today.
                  </div>
                </div>
                <button onClick={() => setActiveTab('add')} style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(10px)", border: "1px solid rgba(255,255,255,0.3)", color: "white", padding: "12px 24px", borderRadius: "8px", cursor: "pointer", fontWeight: "600", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.3s" }}>
                  <FiUserPlus /> Register Student
                </button>
              </div>

              {/* 4 Metric Cards */}
              <div className="stats-grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", marginBottom: "32px" }}>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: "rgba(79, 70, 229, 0.1)", color: "var(--primary)" }}><FiUsers /></div>
                  <div className="stat-info"><h3>Total Enrolled</h3><p style={{ fontSize: "28px", fontWeight: "bold", color: "var(--text-main)" }}>{stats.totalStudents}</p></div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: "rgba(22, 163, 74, 0.1)", color: "#16a34a" }}><FiBookOpen /></div>
                  <div className="stat-info"><h3>Departments</h3><p style={{ fontSize: "28px", fontWeight: "bold", color: "var(--text-main)" }}>{stats.departments}</p></div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: "rgba(217, 119, 6, 0.1)", color: "#d97706" }}><FiAward /></div>
                  <div className="stat-info"><h3>Avg. Attendance</h3><p style={{ fontSize: "28px", fontWeight: "bold", color: "var(--text-main)" }}>92%</p></div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: "rgba(236, 72, 153, 0.1)", color: "#ec4899" }}><FiTrendingUp /></div>
                  <div className="stat-info"><h3>Active Faculty</h3><p style={{ fontSize: "28px", fontWeight: "bold", color: "var(--text-main)" }}>100+</p></div>
                </div>
              </div>

              {/* Split Layout: Recent Activity & Quick Actions */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
                
                {/* Recent Enrollments Table */}
                <div className="form-container" style={{ padding: "0", overflow: "hidden" }}>
                  <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ fontSize: "16px", color: "var(--text-main)", display: "flex", alignItems: "center", gap: "8px" }}><FiClock /> Recent Enrollments</h3>
                    <button onClick={() => setActiveTab('students')} style={{ background: "none", border: "none", color: "var(--primary)", cursor: "pointer", fontSize: "14px", fontWeight: "600" }}>View All</button>
                  </div>
                  <table className="data-table">
                    <tbody>
                      {stats.recentStudents.length === 0 ? (
                        <tr><td style={{ padding: "24px", textAlign: "center", color: "var(--text-muted)" }}>No students found.</td></tr>
                      ) : (
                        stats.recentStudents.map((student) => (
                          <tr key={student.student_id}>
                            <td style={{ fontWeight: "600", color: "var(--text-main)" }}>{student.name}</td>
                            <td style={{ color: "var(--text-muted)", fontSize: "13px" }}>{student.enrollment_number}</td>
                            <td><span className="badge" style={{ background: "rgba(79, 70, 229, 0.1)", color: "var(--primary)" }}>{student.department}</span></td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Quick Actions Panel */}
                <div className="form-container" style={{ padding: "24px" }}>
                  <h3 style={{ fontSize: "16px", color: "var(--text-main)", marginBottom: "20px" }}>Quick Actions</h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <button onClick={() => setActiveTab('students')} style={{ width: "100%", padding: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-color)", border: "1px solid var(--border)", borderRadius: "8px", cursor: "pointer", color: "var(--text-main)", transition: "all 0.2s" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: "500" }}><FiUsers style={{ color: "var(--primary)" }}/> Manage Students</span>
                      <FiArrowRight style={{ color: "var(--text-muted)" }} />
                    </button>
                    <button onClick={() => setActiveTab('settings')} style={{ width: "100%", padding: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--bg-color)", border: "1px solid var(--border)", borderRadius: "8px", cursor: "pointer", color: "var(--text-main)", transition: "all 0.2s" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: "500" }}><FiSettings style={{ color: "var(--text-muted)" }}/> System Settings</span>
                      <FiArrowRight style={{ color: "var(--text-muted)" }} />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Other Tabs */}
          {activeTab === 'students' && <StudentList />}
          {activeTab === 'add' && <AddStudent />}
          {activeTab === 'settings' && <div style={{ width: "100%" }}><Settings /></div>}
        </section>
      </main>
    </div>
  );
};

export default Dashboard;