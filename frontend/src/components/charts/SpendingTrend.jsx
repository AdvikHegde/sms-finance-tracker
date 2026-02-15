import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const data = [
  { date: '2026-02-10', amount: 450 },
  { date: '2026-02-11', amount: 1200 },
  { date: '2026-02-12', amount: 300 },
  { date: '2026-02-13', amount: 2100 },
  { date: '2026-02-14', amount: 800 },
  { date: '2026-02-15', amount: 1 }, // Your sample ASHIKA ASHOK HEGDE transaction
];

const SpendingTrend = () => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-96">
      <div className="mb-6">
        <h3 className="font-bold text-slate-800 text-lg">Daily Spending Trend</h3>
        <p className="text-sm text-slate-500">Visualization of outflows over the last 7 days</p>
      </div>
      <ResponsiveContainer width="100%" height="80%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
          <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Area type="monotone" dataKey="amount" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpendingTrend;