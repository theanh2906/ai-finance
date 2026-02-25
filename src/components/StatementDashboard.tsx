import React from 'react';
import { 
  PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip
} from 'recharts';
import type { StatementResult } from '../types';
import { TrendingUp, TrendingDown, Wallet, Calendar, PieChart as PieIcon, ArrowRightLeft } from 'lucide-react';

interface StatementDashboardProps {
  data: StatementResult;
}

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#3b82f6'];

export const StatementDashboard: React.FC<StatementDashboardProps> = ({ data }) => {
  const { summary, transactions, insights } = data;

  const categoryData = transactions.reduce((acc: any[], curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) {
      existing.value += Math.abs(curr.amount);
    } else {
      acc.push({ name: curr.category, value: Math.abs(curr.amount) });
    }
    return acc;
  }, []);

  return (
    <div className="space-y-8 pb-12 w-full animate-in fade-in duration-500">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
              <TrendingUp className="text-emerald-400 w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Total Income</p>
              <h3 className="text-2xl font-black text-white tracking-tight">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: summary.currency }).format(summary.totalIncome)}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-pink-500/10 rounded-2xl border border-pink-500/20">
              <TrendingDown className="text-pink-400 w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Total Expenses</p>
              <h3 className="text-2xl font-black text-white tracking-tight">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: summary.currency }).format(summary.totalExpense)}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="relative flex items-center space-x-4">
            <div className="p-4 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
              <Wallet className="text-indigo-400 w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Net Balance</p>
              <h3 className="text-2xl font-black text-white tracking-tight">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: summary.currency }).format(summary.netBalance)}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-slate-800 rounded-2xl border border-white/10">
              <Calendar className="text-slate-300 w-6 h-6" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-slate-400 text-sm font-medium mb-1">Period</p>
              <h3 className="text-lg font-bold text-white leading-tight">
                {summary.period.includes(' to ') ? (
                  <>
                    {summary.period.split(' to ')[0]}
                    <br />
                    <span className="text-sm font-medium text-slate-400">to</span> {summary.period.split(' to ')[1]}
                  </>
                ) : (
                  summary.period
                )}
              </h3>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-xl flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-white flex items-center gap-3">
              <div className="p-2 bg-indigo-500/20 rounded-xl">
                <PieIcon className="w-6 h-6 text-indigo-400" />
              </div>
              Expense Breakdown
            </h3>
          </div>
          <div className="h-[320px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={6}
                  dataKey="value"
                  stroke="none"
                  className="drop-shadow-sm"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '16px',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
                  }}
                  itemStyle={{ color: '#fff', fontWeight: 600 }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-xl">
          <h3 className="text-2xl font-bold mb-8 text-white flex items-center gap-3">
            <div className="p-2 bg-pink-500/20 rounded-xl">
              <TrendingUp className="w-6 h-6 text-pink-400" />
            </div>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-400">
              AI Insights
            </span>
          </h3>
          <div className="space-y-4">
            {insights.map((insight, index) => (
              <div 
                key={index} 
                className="p-5 bg-white/5 hover:bg-white/10 transition-colors rounded-2xl border border-white/5 relative overflow-hidden group"
              >
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-pink-500 opacity-50 group-hover:opacity-100 transition-opacity" />
                <p className="text-slate-300 leading-relaxed pl-2 text-lg">"{insight}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-8 border-b border-white/10 flex items-center gap-3">
          <div className="p-2 bg-slate-800 rounded-xl">
            <ArrowRightLeft className="w-6 h-6 text-slate-300" />
          </div>
          <h3 className="text-2xl font-bold text-white">Transaction History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20 text-slate-400 text-sm uppercase tracking-wider">
                <th className="px-8 py-5 font-semibold">Date</th>
                <th className="px-8 py-5 font-semibold">Description</th>
                <th className="px-8 py-5 font-semibold">Category</th>
                <th className="px-8 py-5 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {transactions.map((t, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-5 text-sm text-slate-300 whitespace-nowrap">{t.date}</td>
                  <td className="px-8 py-5 font-medium text-white">{t.description}</td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-lg text-xs font-semibold whitespace-nowrap">
                      {t.category}
                    </span>
                  </td>
                  <td className={`px-8 py-5 text-right font-bold text-base whitespace-nowrap ${t.type === 'income' ? 'text-emerald-400' : 'text-pink-400'}`}>
                    {t.type === 'income' ? '+' : '-'} {new Intl.NumberFormat('en-US', { style: 'currency', currency: summary.currency }).format(Math.abs(t.amount))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
