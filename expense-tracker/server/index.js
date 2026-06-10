const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('./db');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// SECURITY MIDDLEWARE
const authorize = (req, res, next) => {
    const token = req.header("token");
    if (!token) return res.status(403).json("Not Authorized");
    try {
        const payload = jwt.verify(token, process.env.jwtSecret);
        req.user = payload.user;
        next();
    } catch (err) {
        return res.status(403).json("Not Authorized");
    }
};

// AUTHENTICATION ROUTES
app.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);
        if (user.rows.length !== 0) {
            return res.status(401).json("User already exists");
        }

        const saltRound = 10;
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            "INSERT INTO users (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
            [name, email, bcryptPassword]
        );

        const token = jwt.sign({ user: newUser.rows[0].user_id }, process.env.jwtSecret, { expiresIn: "1hr" });
        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Login User
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await pool.query("SELECT * FROM users WHERE user_email = $1", [email]);
        if (user.rows.length === 0) {
            return res.status(401).json("Password or Email is incorrect");
        }

        const validPassword = await bcrypt.compare(password, user.rows[0].user_password);
        if (!validPassword) {
            return res.status(401).json("Password or Email is incorrect");
        }

        const token = jwt.sign({ user: user.rows[0].user_id }, process.env.jwtSecret, { expiresIn: "1hr" });
        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// Get User Profile (NEW)
app.get('/profile', authorize, async (req, res) => {
    try {
        const user = await pool.query("SELECT user_name FROM users WHERE user_id = $1", [req.user]);
        res.json(user.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// EXPENSE ROUTES (NOW USER-SPECIFIC)
app.post('/expenses', authorize, async (req, res) => {
    try {
        const { description, amount, category } = req.body;
        
        const newExpense = await pool.query(
            "INSERT INTO expenses (description, amount, category, date, user_id) VALUES($1, $2, $3, CURRENT_DATE, $4) RETURNING *",
            [description, amount, category || 'Other', req.user]
        );
        res.json(newExpense.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

app.get('/expenses', authorize, async (req, res) => {
    try {
        const allExpenses = await pool.query(
            "SELECT * FROM expenses WHERE user_id = $1 ORDER BY date DESC", 
            [req.user]
        );
        res.json(allExpenses.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

app.delete('/expenses/:id', authorize, async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query(
            "DELETE FROM expenses WHERE id = $1 AND user_id = $2", 
            [id, req.user]
        );
        res.json("Expense was deleted!");
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running professionally on port ${PORT}`);
});