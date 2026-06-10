import { useState, useEffect } from 'react';
import { 
    PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend, 
    AreaChart, Area, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './App.css'; 

const Dashboard = ({ setAuth }) => {
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [sortBy, setSortBy] = useState('newest');
  const [timeFilter, setTimeFilter] = useState('all'); 
  const [userName, setUserName] = useState('');

  // Local Storage States
  const [monthlyBudget, setMonthlyBudget] = useState(() => Number(localStorage.getItem('userBudget')) || 20000);
  const [savingsGoal, setSavingsGoal] = useState(() => Number(localStorage.getItem('userSavingsGoal')) || 5000);
  
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [tempBudget, setTempBudget] = useState(monthlyBudget);
  const [tempGoal, setTempGoal] = useState(savingsGoal);

  useEffect(() => {
    localStorage.setItem('userBudget', monthlyBudget);
    localStorage.setItem('userSavingsGoal', savingsGoal);
  }, [monthlyBudget, savingsGoal]);

  const handleBudgetSave = () => { setMonthlyBudget(Number(tempBudget) || 1); setIsEditingBudget(false); };
  const handleGoalSave = () => { setSavingsGoal(Number(tempGoal) || 1); setIsEditingGoal(false); };

  const formatINR = (value) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(value || 0);

  const getProfile = async () => {
    try {
      const response = await fetch("http://localhost:5000/profile", {
        method: "GET",
        headers: { token: sessionStorage.getItem("token") }
      });
      const parseRes = await response.json();
      setUserName(parseRes.user_name);
    } catch (err) { console.error(err.message); }
  };

  const getExpenses = async () => {
    try {
      const response = await fetch('http://localhost:5000/expenses', {
        method: "GET",
        headers: { token: sessionStorage.getItem("token") }
      });
      const jsonData = await response.json();
      setExpenses(jsonData);
    } catch (err) { console.error(err.message); }
  };

  useEffect(() => {
    getExpenses();
    getProfile();
  }, []);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { description, amount, category };
      await fetch('http://localhost:5000/expenses', {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'token': sessionStorage.getItem("token")
        },
        body: JSON.stringify(body)
      });
      setDescription('');
      setAmount('');
      getExpenses(); 
    } catch (err) { console.error(err.message); }
  };

  const exportToPDF = () => {
    const input = document.getElementById('dashboard-export-area');
    html2canvas(input, { scale: 2, backgroundColor: '#0b1120' }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('Finance_Report.pdf');
    });
  };

  const exportToCSV = () => {
    if (expenses.length === 0) return alert("No data to export!");
    const headers = ["Date,Description,Category,Amount\n"];
    const csvData = expenses.map(exp => {
        const date = new Date(exp.date).toLocaleDateString('en-IN');
        return `${date},"${exp.description}","${exp.category}",${exp.amount}`;
    }).join("\n");
    const blob = new Blob([headers + csvData], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('href', url);
    a.setAttribute('download', 'Expense_Data.csv');
    a.click();
  };

  const logout = (e) => {
    e.preventDefault();
    sessionStorage.removeItem("token");
    setAuth(false);
  };

  const now = new Date();
  const timeFilteredExpenses = expenses.filter(exp => {
      if (timeFilter === 'all') return true;
      const expDate = new Date(exp.date);
      const diffTime = Math.abs(now - expDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (timeFilter === '7d') return diffDays <= 7;
      if (timeFilter === '30d') return diffDays <= 30;
      return true;
  });

  const sortedExpenses = [...timeFilteredExpenses].sort((a, b) => {
      if (sortBy === 'highest') return parseFloat(b.amount) - parseFloat(a.amount);
      if (sortBy === 'lowest') return parseFloat(a.amount) - parseFloat(b.amount);
      if (sortBy === 'oldest') {
          const diff = new Date(a.date) - new Date(b.date);
          return diff === 0 ? a.id - b.id : diff;
      }
      const diff = new Date(b.date) - new Date(a.date); 
      return diff === 0 ? b.id - a.id : diff;
  });

  const total = timeFilteredExpenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
  const highest = timeFilteredExpenses.length > 0 ? Math.max(...timeFilteredExpenses.map(e => parseFloat(e.amount))) : 0;
  const budgetPercentage = Math.min((total / monthlyBudget) * 100, 100).toFixed(1);
  const remainingBudget = monthlyBudget - total;

  // Top Category Calculation
  const categoryTotals = timeFilteredExpenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + parseFloat(expense.amount);
    return acc;
  }, {});

  let topCategory = "None";
  let topCategoryAmount = 0;
  Object.keys(categoryTotals).forEach(cat => {
      if(categoryTotals[cat] > topCategoryAmount) {
          topCategoryAmount = categoryTotals[cat];
          topCategory = cat;
      }
  });

  const pieChartData = Object.keys(categoryTotals).map(key => ({ name: key, value: categoryTotals[key] }));

  // Trend Chart Data 
  const expensesByDate = timeFilteredExpenses.reduce((acc, exp) => {
      const dateStr = new Date(exp.date).toLocaleDateString('en-IN', {month: 'short', day: 'numeric'});
      acc[dateStr] = (acc[dateStr] || 0) + parseFloat(exp.amount);
      return acc;
  }, {});
  
  const trendData = Object.keys(expensesByDate).map(date => ({
      date, amount: expensesByDate[date]
  })).reverse(); 

  const COLORS = ['#06b6d4', '#8b5cf6', '#f59e0b', '#10b981', '#ec4899', '#6366f1'];

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <div className="nav-brand">
          <h2><span className="brand-icon">⟡</span> Expense Tracker</h2>
          <span className="nav-greeting">
            Welcome back, <strong>{userName}</strong>
          </span>
        </div>
        <div className="nav-controls">
          <button onClick={exportToCSV} className="btn-csv">📥 CSV</button>
          <button onClick={exportToPDF} className="btn-pdf">📄 Export PDF</button>
          <button onClick={e => logout(e)} className="btn-logout">Logout</button>
        </div>
      </nav>

      <div id="dashboard-export-area" className="export-wrapper">
        
        {/* KPI Row 1: Finances */}
        <div className="kpi-row">
            <div className="kpi-card">
                <h4>Total Disbursed</h4>
                <h2 className="text-cyan">{formatINR(total)}</h2>
            </div>
            
            <div className="kpi-card budget-card">
                <div className="budget-header-flex">
                    <h4>Budget Used ({budgetPercentage}%)</h4>
                    <button className="edit-budget-btn" onClick={() => setIsEditingBudget(!isEditingBudget)}>
                        {isEditingBudget ? 'Cancel' : '✎ Edit'}
                    </button>
                </div>
                <div className="progress-bar-bg">
                    <div className="progress-bar-fill" style={{width: `${budgetPercentage}%`, backgroundColor: budgetPercentage > 90 ? '#ef4444' : '#06b6d4'}}></div>
                </div>
                {isEditingBudget ? (
                    <div className="budget-edit-form">
                        <input type="number" value={tempBudget} onChange={(e) => setTempBudget(e.target.value)} className="dark-input budget-input" autoFocus />
                        <button onClick={handleBudgetSave} className="save-budget-btn">Save</button>
                    </div>
                ) : (
                    <p className="budget-text">{formatINR(total)} of {formatINR(monthlyBudget)} <span className="budget-remaining">({formatINR(remainingBudget)} left)</span></p>
                )}
            </div>

            <div className="kpi-card budget-card">
                <div className="budget-header-flex">
                    <h4>Savings Goal</h4>
                    <button className="edit-budget-btn" onClick={() => setIsEditingGoal(!isEditingGoal)}>
                        {isEditingGoal ? 'Cancel' : '✎ Edit'}
                    </button>
                </div>
                <h2 className="text-emerald">{formatINR(savingsGoal)}</h2>
                {isEditingGoal && (
                    <div className="budget-edit-form" style={{marginTop: '10px'}}>
                        <input type="number" value={tempGoal} onChange={(e) => setTempGoal(e.target.value)} className="dark-input budget-input" autoFocus />
                        <button onClick={handleGoalSave} className="save-budget-btn">Save</button>
                    </div>
                )}
            </div>
        </div>

        {/* KPI Row 2: Insights */}
        <div className="kpi-row insights-row">
            <div className="kpi-card mini-insight">
                <h4>Peak Expense</h4>
                <h3 className="text-amber">{formatINR(highest)}</h3>
            </div>
            <div className="kpi-card mini-insight">
                <h4>Top Category</h4>
                <h3 className="text-purple">{topCategory} ({formatINR(topCategoryAmount)})</h3>
            </div>
            <div className="kpi-card mini-insight">
                <h4>Total Transactions</h4>
                <h3 className="text-white">{timeFilteredExpenses.length}</h3>
            </div>
        </div>
        
        <div className="dashboard-content">
            <div className="left-column">
                <div className="glass-card form-card">
                    <h3>Log Transaction</h3>
                    <form onSubmit={onSubmitForm} className="expense-form">
                        <input type="text" placeholder="Transaction details..." value={description} onChange={e => setDescription(e.target.value)} required className="dark-input" />
                        <div className="input-row">
                            <input type="number" placeholder="Amount (₹)" value={amount} onChange={e => setAmount(e.target.value)} step="0.01" required className="dark-input" />
                            <select value={category} onChange={e => setCategory(e.target.value)} className="dark-input">
                                <option value="Food">Food & Dining</option>
                                <option value="Transport">Transportation</option>
                                <option value="Utilities">Utilities & Bills</option>
                                <option value="Entertainment">Entertainment</option>
                                <option value="Shopping">Shopping</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                        <button type="submit" className="add-btn">Process Transaction</button>
                    </form>
                </div>

                {/* NEW: Grid for Charts */}
                <div className="charts-grid">
                    <div className="glass-card chart-card">
                        <h3>Allocation</h3>
                        {expenses.length > 0 ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={5} stroke="none" dataKey="value">
                                        {pieChartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                    </Pie>
                                    <Tooltip formatter={(value) => formatINR(value)} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : <p className="empty-state">No data</p>}
                    </div>

                    <div className="glass-card chart-card">
                        <h3>Spending Trend</h3>
                        {trendData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={220}>
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc' }} formatter={(value) => formatINR(value)} />
                                    <Area type="monotone" dataKey="amount" stroke="#0ea5e9" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : <p className="empty-state">No data</p>}
                    </div>
                </div>
            </div>

            <div className="glass-card ledger-card">
                <div className="list-header">
                    <h3>Recent Transactions</h3>
                    <div className="header-controls">
                        <div className="time-filters">
                            <button className={`filter-pill ${timeFilter === 'all' ? 'active' : ''}`} onClick={() => setTimeFilter('all')}>All Time</button>
                            <button className={`filter-pill ${timeFilter === '30d' ? 'active' : ''}`} onClick={() => setTimeFilter('30d')}>30 Days</button>
                            <button className={`filter-pill ${timeFilter === '7d' ? 'active' : ''}`} onClick={() => setTimeFilter('7d')}>7 Days</button>
                        </div>
                        <select className="sort-dropdown" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                            <option value="newest">Latest First</option>
                            <option value="oldest">Oldest First</option>
                            <option value="highest">Highest Amount</option>
                            <option value="lowest">Lowest Amount</option>
                        </select>
                    </div>
                </div>
                
                <ul className="expense-list">
                {sortedExpenses.map(expense => (
                    <li key={expense.id} className="expense-item">
                        <div className="expense-info">
                            <span className="expense-desc">{expense.description}</span>
                            <div className="expense-meta">
                                <span className="expense-badge" data-category={expense.category}>{expense.category}</span>
                                <span className="expense-date">{new Date(expense.date).toLocaleDateString('en-IN', {day: '2-digit', month: 'short', year: 'numeric'})}</span>
                            </div>
                        </div>
                        <div className="expense-actions">
                            <span className="expense-amt">{formatINR(expense.amount)}</span>
                        </div>
                    </li>
                ))}
                {sortedExpenses.length === 0 && <p className="empty-state">Ledger is empty for this period.</p>}
                </ul>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;