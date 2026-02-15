
const transactions = [
  {
    _id: "6991d9e716a2cc9b9e178507",
    amount: 1,
    vendor: "ASHIKA ASHOK HEGDE",
    date: "2026-02-15",
    category: "Others",
    bank: "HDFC Bank",
    transactionType: "debit"
  },
  // Add more sample objects here as needed
];

const TransactionTable = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <h3 className="font-bold text-slate-800">Recent Transactions</h3>
        <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 text-slate-400 text-xs uppercase font-bold">
              <th className="px-6 py-4">Vendor & Date</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Bank</th>
              <th className="px-6 py-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map((t) => (
              <tr key={t._id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                <td className="px-6 py-4">
                  <p className="font-bold text-slate-800 text-sm">{t.vendor}</p>
                  <p className="text-xs text-slate-400">{t.date}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                    {t.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{t.bank}</td>
                <td className={`px-6 py-4 text-right font-bold text-sm ${t.transactionType === 'debit' ? 'text-red-600' : 'text-green-600'}`}>
                  {t.transactionType === 'debit' ? '-' : '+'}₹{t.amount.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;