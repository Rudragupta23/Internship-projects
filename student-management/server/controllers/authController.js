const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register a new user
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // 1. Check if user already exists
        const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userExists.rows.length !== 0) {
            return res.status(401).json({ error: "User already exists" });
        }

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const bcryptPassword = await bcrypt.hash(password, salt);

        // 3. Insert user into database
        const newUser = await pool.query(
            "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING user_id, name, email, role",
            [name, email, bcryptPassword, role || 'student']
        );

        // 4. Generate JWT Token
        const token = jwt.sign({ user_id: newUser.rows[0].user_id, role: newUser.rows[0].role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, user: newUser.rows[0] });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};

// Login an existing user
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if user exists
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) {
            return res.status(401).json({ error: "Password or Email is incorrect" });
        }

        // 2. Check if incoming password matches database password
        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPassword) {
            return res.status(401).json({ error: "Password or Email is incorrect" });
        }

        // 3. THE AUTHORIZATION GATE: Check if the user is an admin
        if (user.rows[0].role !== 'admin') {
            return res.status(403).json({ error: "Access Denied. Only Administrators can access this portal." });
        }

        // 4. Generate JWT Token
        const token = jwt.sign({ user_id: user.rows[0].user_id, role: user.rows[0].role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, user: { user_id: user.rows[0].user_id, name: user.rows[0].name, email: user.rows[0].email, role: user.rows[0].role } });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
};