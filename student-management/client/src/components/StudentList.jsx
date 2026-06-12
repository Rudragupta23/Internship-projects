import { useState, useEffect } from "react";
import { FiEdit2, FiTrash2, FiSearch, FiCheck, FiX, FiDownload } from "react-icons/fi";
import axios from "axios";

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const fetchStudents = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/students");
      setStudents(response.data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await axios.delete(`http://localhost:5000/api/students/${id}`);
        setStudents(students.filter(student => student.student_id !== id));
      } catch (err) { console.error(err); }
    }
  };

  const handleEditClick = (student) => {
    setEditId(student.student_id);
    setEditFormData({ name: student.name, email: student.email, phone: student.phone, department: student.department, current_semester: student.current_semester });
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/students/${id}`, editFormData);
      setEditId(null);
      fetchStudents();
    } catch (err) { console.error(err); }
  };

  // --- NEW FEATURE: EXPORT TO CSV ---
  const exportToCSV = () => {
    if (students.length === 0) return alert("No data to export!");
    
    // Create CSV Headers
    const headers = ["Enrollment No,Name,Email,Phone,Department,Semester\n"];
    // Map student data to CSV rows
    const csvData = students.map(student => {
      return `${student.enrollment_number},${student.name},${student.email},${student.phone || 'N/A'},${student.department},${student.current_semester}\n`;
    });
    
    // Trigger Download
    const blob = new Blob([headers + csvData.join("")], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "student_directory.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    student.enrollment_number.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="table-container animate-slide-up">
      <div className="table-header" style={{ display: "flex", flexWrap: "wrap", gap: "16px" }}>
        <h3 style={{ fontSize: "18px", color: "var(--text-main)", flex: 1 }}>Student Records</h3>
        
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div style={{ position: "relative" }}>
            <FiSearch style={{ position: "absolute", left: "12px", top: "12px", color: "var(--text-muted)" }} />
            <input 
              type="text" placeholder="Search students..." 
              className="search-input" style={{ paddingLeft: "36px" }}
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <button onClick={exportToCSV} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 16px", background: "rgba(79, 70, 229, 0.1)", color: "var(--primary)", border: "1px solid var(--primary)", borderRadius: "8px", cursor: "pointer", fontWeight: "600", transition: "all 0.2s" }}>
            <FiDownload /> Export CSV
          </button>
        </div>
      </div>
      
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Enrollment No.</th>
              <th>Name</th>
              <th>Department</th>
              <th>Semester</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: "center", padding: "20px", color: "var(--text-muted)" }}>No students found.</td></tr>
            ) : (
                filteredStudents.map((student) => (
                <tr key={student.student_id}>
                    <td style={{ fontWeight: "600", color: "var(--primary)" }}>{student.enrollment_number}</td>
                    
                    {editId === student.student_id ? (
                    <>
                        <td><input type="text" value={editFormData.name} onChange={(e) => setEditFormData({...editFormData, name: e.target.value})} style={editInputStyle} /></td>
                        <td>
                          <select value={editFormData.department} onChange={(e) => setEditFormData({...editFormData, department: e.target.value})} style={editInputStyle}>
                            <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                            <option value="Information Technology">Information Technology</option>
                            <option value="Artificial Intelligence & Data Science">Artificial Intelligence & Data Science</option>
                            <option value="Mechanical Engineering">Mechanical Engineering</option>
                          </select>
                        </td>
                        <td><input type="number" value={editFormData.current_semester} onChange={(e) => setEditFormData({...editFormData, current_semester: e.target.value})} style={{...editInputStyle, width: "60px"}} /></td>
                        <td>
                            <button onClick={() => handleUpdate(student.student_id)} className="action-btn" style={{ color: "#16a34a" }}><FiCheck /></button>
                            <button onClick={() => setEditId(null)} className="action-btn" style={{ color: "#ef4444" }}><FiX /></button>
                        </td>
                    </>
                    ) : (
                    <>
                        <td>{student.name}</td>
                        <td><span className="badge" style={{ background: "rgba(79, 70, 229, 0.1)", color: "var(--primary)", border: "1px solid rgba(79, 70, 229, 0.2)" }}>{student.department}</span></td>
                        <td>Sem {student.current_semester}</td>
                        <td>
                            <button onClick={() => handleEditClick(student)} className="action-btn edit" title="Edit"><FiEdit2 /></button>
                            <button onClick={() => handleDelete(student.student_id)} className="action-btn delete" title="Delete"><FiTrash2 /></button>
                        </td>
                    </>
                    )}
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const editInputStyle = { padding: "8px", border: "1px solid var(--border)", borderRadius: "6px", fontSize: "14px", width: "100%", background: "var(--bg-color)", color: "var(--text-main)" };

export default StudentList;