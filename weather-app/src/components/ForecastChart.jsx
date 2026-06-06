import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="chart-tooltip glass-card" style={{ padding: '10px', border: 'none' }}>
        <p style={{ color: '#a8b2d1', marginBottom: '5px' }}>{label}</p>
        <p style={{ color: '#64ffda', fontWeight: 'bold' }}>
          {payload[0].value}°C
        </p>
      </div>
    );
  }
  return null;
};

const ForecastChart = ({ data }) => {
  // Format data for the chart
  const chartData = data.map(day => {
    const date = new Date(day.dt * 1000);
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      temp: Math.round(day.main.temp)
    };
  });

  return (
    <div className="forecast-chart-container glass-card">
      <h3 className="section-title">Temperature Trend</h3>
      <div style={{ height: '250px', width: '100%', marginTop: '1rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis dataKey="day" stroke="#a8b2d1" axisLine={false} tickLine={false} />
            <YAxis stroke="#a8b2d1" axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="temp" 
              stroke="#64ffda" 
              strokeWidth={3}
              dot={{ fill: '#0f2027', stroke: '#64ffda', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, fill: '#64ffda' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ForecastChart;