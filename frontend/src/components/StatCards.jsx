import { ArrowUpRight, Landmark, Zap } from 'lucide-react';

const StatCards = () => {
  // Example insights derived from your data schema
  const stats = [
    {
      label: 'Monthly Spending',
      value: '₹12,450',
      description: 'Total Debits',
      icon: <ArrowUpRight className="text-red-600" />,
      bg: 'bg-red-50',
    },
    {
      label: 'Total Savings',
      value: '₹32,550',
      description: 'Net Cash Flow',
      icon: <Zap className="text-amber-600" />,
      bg: 'bg-amber-50',
    },
    {
      label: 'Primary Bank',
      value: 'HDFC Bank',
      description: 'A/C *7003',
      icon: <Landmark className="text-blue-600" />,
      bg: 'bg-blue-50',
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
              <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
              <p className="text-sm text-slate-500 mt-1">{stat.description}</p>
            </div>
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              {stat.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatCards;