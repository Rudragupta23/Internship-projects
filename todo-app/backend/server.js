const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Database
let todos = [
  { id: 1, text: 'Learning DSA', completed: false },
  { id: 2, text: 'Build a Full-Stack App', completed: false },
  { id: 3, text: 'Worked on github profile', completed: false }
];

// 1. GET: Send all todos to the frontend
app.get('/api/todos', (req, res) => {
  res.json(todos);
});

// 2. POST: Add a new todo
app.post('/api/todos', (req, res) => {
  const newTodo = {
    id: Date.now(), 
    text: req.body.text,
    completed: false
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// 3. PUT: Update a todo
app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  
  if (todo) {
    todo.completed = !todo.completed;
    res.json(todo);
  } else {
    res.status(404).json({ message: 'Todo not found' });
  }
});

// 4. DELETE: Remove a todo
app.delete('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  todos = todos.filter(t => t.id !== id);
  res.status(204).send();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend Server running on http://localhost:${PORT}`);
});