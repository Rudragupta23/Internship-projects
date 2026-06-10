# ⟡ Expense Tracker

A premium, full-stack Personal Expense Tracker built with the **PERN stack** (PostgreSQL, Express, React, Node.js). Designed with a modern, dark-mode glassmorphism UI, this application provides secure, multi-tenant financial tracking with advanced analytics and export capabilities.

## ✨ Features

* **🔒 Secure Authentication:** JWT-based user sessions, password hashing with `bcrypt`, and secure API route protection.
* **📊 Advanced Analytics:** Interactive Pie and Area charts using `recharts` to visualize spending by category and chronological trends.
* **💳 Dynamic Goals:** Editable monthly budget and savings goals that persist locally and calculate real-time usage percentages.
* **📄 Professional Exports:** Generate and download PDF snapshots of the dashboard (via `jspdf` & `html2canvas`) or export raw ledger data to CSV.
* **⏱️ Smart Filtering:** One-click time filters (7 Days, 30 Days, All Time) and multi-axis sorting (Amount, Date).
* **🎨 Premium UI:** Custom-built dark mode interface utilizing CSS Grid, flexbox, and modern SaaS UX design principles.

## 🛠️ Tech Stack

* **Frontend:** React.js (Vite), CSS3, Recharts, html2canvas, jsPDF
* **Backend:** Node.js, Express.js, JSON Web Tokens (JWT), bcrypt
* **Database:** PostgreSQL (`pg` node package)

## 🚀 Installation & Setup

### 1. Database Setup (PostgreSQL)
1. Create a database named `expense_tracker` in pgAdmin.
2. Run the following SQL commands in the Query Tool:
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL UNIQUE,
    user_password VARCHAR(255) NOT NULL
);

CREATE TABLE expenses (
    id SERIAL PRIMARY KEY,
    description VARCHAR(255) NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    category VARCHAR(50) DEFAULT 'Other',
    date DATE DEFAULT CURRENT_DATE,
    user_id uuid REFERENCES users(user_id) ON DELETE CASCADE
);
```

### 2. Backend Setup
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
DB_USER=postgres
DB_PASSWORD=your_postgres_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=expense_tracker
jwtSecret=your_super_secret_key
PORT=5000
```
Start the server:
```bash
node index.js
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd client
npm install
npm run dev
```

## 📂 Project Structure
```text
expense-tracker/
├── client/               # React Frontend
│   ├── src/
│   │   ├── App.jsx       # Routing & Session verification logic
│   │   ├── Dashboard.jsx # Main analytics dashboard UI
│   │   ├── App.css       # Premium dark-mode styling
│   │   ├── Login.jsx     # Auth UI
│   │   └── Register.jsx  # Auth UI
│   └── package.json
└── server/               # Node/Express Backend
    ├── index.js          # API Routes & Auth Middleware
    ├── db.js             # PostgreSQL Connection Pool
    └── .env              # Secrets (Not pushed to Git)