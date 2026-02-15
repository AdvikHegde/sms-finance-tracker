import CategoryPie from './components/charts/CategoryPie';
import SpendingTrend from './components/charts/SpendingTrend';
import FilterBar from './components/FilterBar'; // Import the new component
import Sidebar from './components/SideBar';
import StatCards from './components/StatCards';
import TransactionTable from './components/TransactionTable';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar />
      <main className="flex-1 lg:ml-64 p-4 md:p-8 lg:p-12">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Spending Insights</h1>
          <p className="text-slate-500 mt-1">Real-time analysis of your SMS-linked accounts.</p>
        </header>

        {/* 1. Add Filter Bar Here */}
        <FilterBar />

        <StatCards />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <SpendingTrend />
          <CategoryPie />
        </div>

        <TransactionTable />
      </main>
    </div>
  );
}