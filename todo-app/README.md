# 🚀 Full-Stack To-Do App with Analytics Dashboard

A modern, responsive, and full-stack task management application designed to help users track their daily goals efficiently. This project features a clean UI, full CRUD capabilities, and an interactive analytics dashboard to visualize task completion progress.

## ✨ Features

* **Task Management (CRUD):** * Create new tasks instantly.
  * Read and view a dynamic list of pending and completed tasks.
  * Update tasks by toggling their completion status.
  * Delete tasks that are no longer needed.
* **Interactive Analytics Dashboard:** Real-time visual representation of your task data (Task Distribution Pie Chart & Task Counts Bar Chart) using Recharts.
* **Responsive UI:** A beautiful, glass-morphism inspired interface styled with Tailwind CSS that works seamlessly across desktop and mobile devices.
* **RESTful API:** A lightweight Express.js backend handling all data operations.

---

## 💻 Tech Stack

### Frontend
* **React.js (v19)** - UI Library
* **Vite** - Lightning-fast build tool and bundler
* **Tailwind CSS** - Utility-first CSS framework for styling
* **Recharts** - Composable charting library for React

### Backend
* **Node.js** - JavaScript runtime
* **Express.js** - Web framework for Node.js
* **CORS** - Middleware for handling cross-origin requests

---

## 📁 Project Structure

The repository is divided into two main directories:

* `/frontend` - Contains the Vite + React application.
* `/backend` - Contains the Express.js server and API logic.

---

## ⚙️ Getting Started (Local Development)

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites
Make sure you have [Git](https://git-scm.com/) and [Node.js](https://nodejs.org/) installed on your computer.

## 📥 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Rudragupta23/Internship-projects.git
cd Internship-projects/todo-app
```

### 2. Start the Backend Server

Open your terminal, navigate to the backend folder, install dependencies, and start the server:

```bash
cd backend
npm install
node server.js
```

The backend server will start running on:

```text
http://localhost:5000
```

### 3. Start the Frontend Application

Open a new terminal window, navigate to the frontend folder, install dependencies, and start the Vite development server:

```bash
cd frontend
npm install
npm run dev
```

The frontend application will be available at:

```text
http://localhost:5173
```

(Or the port shown by Vite in the terminal.)

---

## 🔌 API Endpoints

The Express backend exposes the following RESTful endpoints:

| Method | Endpoint | Description |
|----------|------------|-------------|
| GET | `/api/todos` | Fetch all tasks |
| POST | `/api/todos` | Create a new task |
| PUT | `/api/todos/:id` | Toggle completion status of a task |
| DELETE | `/api/todos/:id` | Delete a specific task |

---

## 📊 Analytics Dashboard

This project includes a visual analytics dashboard built using **Recharts**.

### Dashboard Features

- 📈 Task Completion Statistics
- 📊 Completed vs Pending Tasks Chart
- 📋 Real-Time Task Summary
- 🎯 Productivity Tracking
- 🔄 Dynamic Updates Based on Task Changes

---

## 🚀 Future Enhancements

### 🗄️ Database Integration
Replace the in-memory storage with a persistent database such as:
- MongoDB
- PostgreSQL
- MySQL

### 🔐 User Authentication
Allow users to:
- Sign Up
- Log In
- Manage their own private to-do lists

### 🏷️ Task Categories
Add categories and tags such as:
- Work
- Personal
- Urgent
- Study

### 🌙 Dark Mode
Provide light and dark theme support.

### 📱 Mobile Responsiveness
Improve the user experience across all devices.

### ⏰ Due Dates & Reminders
Allow users to set deadlines and receive reminders.

---

