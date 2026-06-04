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
  { id: 3, text: 'Worked on github profile', completed: false },
  { id: 4, text: 'Wake up at 6 am', completed: false },
  { id: 5, text: 'Atleast drink 2 litres of water everyday', completed: false },
  { id: 6, text: 'Read a book for 30 minutes', completed: false },
  { id: 7, text: 'Meditate for 10 minutes', completed: false }
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

// 3. PUT: Update a todo (Toggle Completion OR Update Text)
app.put('/api/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find(t => t.id === id);
  
  if (todo) {
    // If the frontend sends text, update the text
    if (req.body && req.body.text !== undefined) {
      todo.text = req.body.text;
    } else {
      // Otherwise, just toggle the completed status
      todo.completed = !todo.completed;
    }
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