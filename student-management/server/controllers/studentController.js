const pool = require('../config/db');

// GET all students
exports.getAllStudents = async (req, res) => {
    try {
        const allStudents = await pool.query("SELECT * FROM students ORDER BY created_at DESC");
        res.json(allStudents.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// POST a new student
exports.createStudent = async (req, res) => {
    try {
        const { name, email, phone, enrollment_number, department, current_semester } = req.body;
const newStudent = await pool.query(
    "INSERT INTO students (name, email, phone, enrollment_number, department, current_semester) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
    [name, email, phone, enrollment_number, department, current_semester]
)
        res.json(newStudent.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: "Failed to add student. Enrollment or Email might already exist." });
    }
};

// PUT (Update) a student
exports.updateStudent = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, department, current_semester } = req.body;
const updateStudent = await pool.query(
    "UPDATE students SET name = $1, email = $2, phone = $3, department = $4, current_semester = $5 WHERE student_id = $6 RETURNING *",
    [name, email, phone, department, current_semester, id]
);
        res.json("Student was updated successfully!");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// DELETE a student
exports.deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM students WHERE student_id = $1", [id]);
        res.json("Student was deleted successfully!");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};