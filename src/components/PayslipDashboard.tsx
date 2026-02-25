import React from 'react';
import { 
  PieChart, Pie, Cell, Legend, ResponsiveContainer, Tooltip
} from 'recharts';
import type { PayslipResult } from '../types';
import { TrendingUp, Wallet, Calendar, PieChart as PieIcon, Building2, User } from 'lucide-react';

interface PayslipDashboardProps {
  data: PayslipResult;
}

const COLORS = ['#f43f5e', '#ec4899', '#d946ef', '#a855f7', '#8b5cf6'];

export const PayslipDashboard: React.FC<PayslipDashboardProps> = ({ data }) => {
  const { summary, deductions, insights } = data;

  const deductionsData = deductions.map(d => ({
    name: d.description,
    value: Math.abs(d.amount)
  }));

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
              <p className="text-slate-400 text-sm font-medium mb-1">Gross Pay</p>
              <h3 className="text-2xl font-black text-white tracking-tight">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: summary.currency }).format(summary.grossPay)}
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
              <p className="text-slate-400 text-sm font-medium mb-1">Net Pay</p>
              <h3 className="text-2xl font-black text-white tracking-tight">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: summary.currency }).format(summary.netPay)}
              </h3>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-6 shadow-xl hover:-translate-y-1 transition-transform duration-300">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-pink-500/10 rounded-2xl border border-pink-500/20">
              <PieIcon className="text-pink-400 w-6 h-6" />
            </div>
            <div>
              <p className="text-slate-400 text-sm font-medium mb-1">Total Deductions</p>
              <h3 className="text-2xl font-black text-white tracking-tight">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: summary.currency }).format(summary.totalDeductions)}
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
              <p className="text-slate-400 text-sm font-medium mb-1">Pay Period</p>
              <h3 className="text-lg font-bold text-white truncate">{summary.payPeriod}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-xl">
           <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20">
                <Building2 className="text-indigo-400 w-6 h-6" />
              </div>
              <div>
                <h4 className="text-slate-400 text-sm font-medium">Employer</h4>
                <p className="text-xl font-bold text-white">{summary.employerName}</p>
              </div>
           </div>
           <div className="flex items-center gap-4">
              <div className="p-3 bg-pink-500/10 rounded-2xl border border-pink-500/20">
                <User className="text-pink-400 w-6 h-6" />
              </div>
              <div>
                <h4 className="text-slate-400 text-sm font-medium">Employee</h4>
                <p className="text-xl font-bold text-white">{summary.employeeName}</p>
              </div>
           </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-xl">
          <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
             Deductions Breakdown
          </h3>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deductionsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {deductionsData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    background: 'rgba(15, 23, 42, 0.9)', 
                    border: '1px solid rgba(255,255,255,0.1)', 
                    borderRadius: '16px',
                    backdropFilter: 'blur(12px)'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl p-8 shadow-xl">
        <h3 className="text-2xl font-bold mb-8 text-white flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-xl">
            <TrendingUp className="w-6 h-6 text-indigo-400" />
          </div>
          AI Analysis Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <div 
              key={index} 
              className="p-5 bg-white/5 rounded-2xl border border-white/5 relative overflow-hidden group"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-indigo-500 to-pink-500 opacity-50" />
              <p className="text-slate-300 leading-relaxed pl-2">"{insight}"</p>
            </div>
          ))}
        </div>
      </div>

      {/* Deductions List */}
       <div className="bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-3xl shadow-xl overflow-hidden">
        <div className="p-8 border-b border-white/10">
          <h3 className="text-2xl font-bold text-white">Itemized Deductions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20 text-slate-400 text-sm uppercase tracking-wider">
                <th className="px-8 py-5 font-semibold">Description</th>
                <th className="px-8 py-5 font-semibold">Type</th>
                <th className="px-8 py-5 font-semibold text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {deductions.map((d, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="px-8 py-5 font-medium text-white">{d.description}</td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-white/5 text-slate-400 border border-white/10 rounded-lg text-xs capitalize">
                      {d.type}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right font-bold text-pink-400">
                    - {new Intl.NumberFormat('en-US', { style: 'currency', currency: summary.currency }).format(Math.abs(d.amount))}
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
