import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

function TaskChart({ todos }) {
  // Calculate completed and pending tasks
  const completed = todos.filter(t => t.completed).length;
  const pending = todos.length - completed;

  // Data formatted for Recharts
  const data = [
    { name: 'Completed', value: completed, color: '#10b981' }, // Tailwind Emerald-500
    { name: 'Pending', value: pending, color: '#3b82f6' }    // Tailwind Blue-500
  ];

  // Don't render the charts if there are no tasks
  if (todos.length === 0) return null;

  return (
    // Changed to flex-col to stack vertically inside the new right-hand column
    <div className="bg-white/50 rounded-3xl border border-slate-100 p-6 flex flex-col gap-10 items-center justify-center shadow-sm h-full">
      
      {/* Pie Chart Section */}
      <div className="w-full h-56 sm:h-64">
        <h3 className="text-center font-bold text-slate-700 mb-2">Task Distribution</h3>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie 
              data={data} 
              dataKey="value" 
              nameKey="name" 
              cx="50%" 
              cy="50%" 
              outerRadius={70} 
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Chart Section */}
      <div className="w-full h-56 sm:h-64">
        <h3 className="text-center font-bold text-slate-700 mb-2">Task Counts</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
            <XAxis dataKey="name" stroke="#64748b" />
            <YAxis allowDecimals={false} stroke="#64748b" />
            <Tooltip cursor={{fill: 'transparent'}} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export default TaskChart;