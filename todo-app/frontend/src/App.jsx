import { useState, useEffect } from 'react';
import TaskChart from './TaskChart'; // <-- Import the new chart component

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');

  const today = new Date();
  const dateOptions = { weekday: 'long', month: 'short', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', dateOptions);

  // Fetch data from backend
  useEffect(() => {
    fetch('http://localhost:5000/api/todos')
      .then(res => res.json())
      .then(data => setTodos(data))
      .catch(err => console.error("Error fetching data:", err));
  }, []);

  // Add a new task
  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!task.trim()) return;

    const response = await fetch('http://localhost:5000/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: task })
    });
    
    const newTodo = await response.json();
    setTodos([...todos, newTodo]);
    setTask(''); 
  };

  // Toggle completion
  const handleToggle = async (id) => {
    await fetch(`http://localhost:5000/api/todos/${id}`, { method: 'PUT' });
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  // Delete task
  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/todos/${id}`, { method: 'DELETE' });
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const pendingCount = todos.filter(t => !t.completed).length;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-start justify-center pt-16 sm:pt-24 px-4 pb-24 font-sans relative overflow-x-hidden text-slate-800">
      
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>
      <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-violet-400/20 rounded-full mix-blend-multiply filter blur-[100px] opacity-70"></div>

      <div className="w-full max-w-2xl bg-white/70 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-white relative z-10 p-8 sm:p-12">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-500 mb-2">
              To Do List
            </h1>
            <p className="text-slate-500 font-medium tracking-wide">{formattedDate}</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white shadow-sm border border-slate-100 px-4 py-2 rounded-2xl">
            <div className={`w-2.5 h-2.5 rounded-full ${pendingCount > 0 ? 'bg-blue-500 animate-pulse' : 'bg-emerald-400'}`}></div>
            <span className="text-sm font-bold text-slate-600">
              {pendingCount} {pendingCount === 1 ? 'Task' : 'Tasks'} Left
            </span>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleAddTodo} className="relative mb-10 group">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <svg className="w-6 h-6 text-slate-300 group-focus-within:text-blue-500 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <input 
            type="text" 
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="What's next on your mind?" 
            className="w-full pl-16 pr-32 py-5 bg-white border-2 border-slate-100 rounded-full text-slate-700 text-lg placeholder-slate-400 focus:outline-none focus:border-blue-500/30 focus:bg-blue-50/30 transition-all duration-300 shadow-sm"
          />
          <button 
            type="submit" 
            className="absolute right-2.5 top-2.5 bottom-2.5 bg-slate-800 hover:bg-slate-900 text-white px-8 rounded-full font-bold transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
          >
            Add
          </button>
        </form>

        {/* Task List */}
        <div className="bg-white/50 rounded-3xl border border-slate-100 p-2">
          {todos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-slate-800 font-bold text-xl mb-2">All Done!</p>
              <p className="text-slate-500 font-medium">Take a break or start a new objective.</p>
            </div>
          ) : (
            <ul className="space-y-1">
              {todos.map(todo => (
                <li 
                  key={todo.id} 
                  className={`group flex items-center justify-between p-4 sm:p-5 rounded-2xl transition-all duration-300 ${
                    todo.completed 
                      ? 'bg-transparent opacity-60' 
                      : 'bg-white hover:bg-slate-50 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-5 cursor-pointer flex-1" onClick={() => handleToggle(todo.id)}>
                    
                    {/* Checkbox */}
                    <div className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 shrink-0 ${
                      todo.completed 
                        ? 'bg-emerald-500 border-emerald-500' 
                        : 'border-slate-300 group-hover:border-blue-400'
                    }`}>
                      <svg 
                        className={`w-4 h-4 text-white absolute transition-transform duration-300 ${todo.completed ? 'scale-100' : 'scale-0'}`} 
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    
                    <span className={`text-[1.15rem] font-medium transition-all duration-300 ${
                      todo.completed ? 'line-through text-slate-400' : 'text-slate-700 group-hover:text-slate-900'
                    }`}>
                      {todo.text}
                    </span>
                  </div>

                  {/* Delete Icon */}
                  <button 
                    onClick={() => handleDelete(todo.id)}
                    className="p-3 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 ml-4 focus:opacity-100"
                    aria-label="Delete task"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* --- ADDED GRAPHS HERE --- */}
        <TaskChart todos={todos} />
        
      </div>
    </div>
  );
}

export default App;