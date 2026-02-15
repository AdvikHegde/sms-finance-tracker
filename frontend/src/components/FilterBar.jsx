import { Calendar, ChevronDown, Filter } from 'lucide-react';

const FilterBar = () => {
  const banks = ['All Accounts', 'HDFC (*7003)', 'ICICI (*1102)', 'SBI (*4491)'];
  const timeframes = ['Last 7 Days', 'Current Month', 'Last 3 Months', 'Year to Date'];

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
      {/* Bank Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
        {banks.map((bank, index) => (
          <button
            key={bank}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              index === 0 
                ? 'bg-blue-600 text-white shadow-md shadow-blue-200' 
                : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
            }`}
          >
            {bank}
          </button>
        ))}
      </div>

      {/* Date Dropdown & Filter Icon */}
      <div className="flex gap-3 w-full md:w-auto">
        <div className="relative flex-1 md:flex-none">
          <select className="appearance-none w-full bg-white border border-slate-200 rounded-xl px-10 py-2 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
            {timeframes.map(time => <option key={time}>{time}</option>)}
          </select>
          <Calendar className="absolute left-3 top-2.5 text-slate-400" size={16} />
          <ChevronDown className="absolute right-3 top-2.5 text-slate-400" size={16} />
        </div>
        
        <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors">
          <Filter size={20} />
        </button>
      </div>
    </div>
  );
};

export default FilterBar;