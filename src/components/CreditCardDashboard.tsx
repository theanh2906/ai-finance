import React from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { CreditCard, Calendar, DollarSign, ExternalLink } from 'lucide-react';
import type { CreditCardResult } from '../types';

interface CreditCardDashboardProps {
  data: CreditCardResult;
}

const COLORS = ['#6366f1', '#ec4899', '#14b8a6', '#f59e0b', '#8b5cf6', '#ef4444', '#10b981', '#3b82f6'];

export const CreditCardDashboard: React.FC<CreditCardDashboardProps> = ({ data }) => {
  const { summary, categories, insights } = data;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: summary.currency || 'VND',
    }).format(amount);
  };

  const chartData = categories.map(cat => ({
    name: cat.category,
    value: cat.amount,
  })).sort((a, b) => b.value - a.value);

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-indigo-500/50 transition-colors"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors" />
          <div className="relative">
            <div className="w-12 h-12 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-4">
              <CreditCard className="w-6 h-6 text-indigo-400" />
            </div>
            <p className="text-slate-400 font-medium mb-1">Chủ thẻ</p>
            <h3 className="text-2xl font-bold text-white truncate" title={summary.cardHolder}>
              {summary.cardHolder}
            </h3>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-6 relative overflow-hidden group hover:border-pink-500/50 transition-colors"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-colors" />
          <div className="relative">
            <div className="w-12 h-12 bg-pink-500/20 rounded-2xl flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-pink-400" />
            </div>
            <p className="text-slate-400 font-medium mb-1">Kỳ sao kê</p>
            <h3 className="text-2xl font-bold text-white truncate" title={summary.statementDate}>
              {summary.statementDate}
            </h3>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-indigo-500 to-pink-500 rounded-3xl p-6 relative overflow-hidden text-white shadow-xl shadow-indigo-500/20"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
          <div className="relative">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
              <DollarSign className="w-6 h-6 text-white" />
            </div>
            <p className="text-white/80 font-medium mb-1">Tổng chi tiêu mới</p>
            <h3 className="text-3xl font-bold">
              {formatCurrency(summary.totalNewCharges)}
            </h3>
          </div>
        </motion.div>
      </div>

      <div className="flex flex-col gap-8">
        {/* Visual Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-5 sm:p-8 flex flex-col"
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
              <PieChart className="w-5 h-5" />
            </span>
            Phân bổ chi tiêu
          </h3>
          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={100}
                  outerRadius={140}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(1)}%`}
                  labelLine={{ stroke: 'rgba(255,255,255,0.2)' }}
                >
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => formatCurrency(Number(value))}
                  contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Detailed Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-5 sm:p-8 overflow-hidden flex flex-col"
        >
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-pink-500/20 flex items-center justify-center text-pink-400">
              <ExternalLink className="w-5 h-5" />
            </span>
            Chi tiết hạng mục
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10 text-slate-400">
                  <th className="py-3 pr-4 sm:py-4 sm:pr-6 font-medium min-w-[150px]">Hạng mục</th>
                  <th className="py-3 px-4 sm:py-4 sm:px-6 font-medium text-right">Số tiền</th>
                  <th className="py-3 px-4 sm:py-4 sm:px-6 font-medium text-right">Tỷ trọng</th>
                  <th className="py-3 pl-4 sm:py-4 sm:pl-6 font-medium min-w-[250px]">Ghi chú chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {categories.sort((a,b) => b.amount - a.amount).map((cat, idx) => (
                  <tr key={idx} className="hover:bg-white/5 transition-colors group">
                    <td className="py-3 pr-4 sm:py-4 sm:pr-6 font-semibold">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        <span className="truncate">{cat.category}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 sm:py-4 sm:px-6 font-bold text-white whitespace-nowrap text-right">{formatCurrency(cat.amount)}</td>
                    <td className="py-3 px-4 sm:py-4 sm:px-6">
                      <div className="flex items-center gap-3 justify-end">
                        <div className="w-16 h-2 bg-white/10 rounded-full overflow-hidden flex-shrink-0">
                          <div 
                            className="h-full rounded-full" 
                            style={{ 
                              width: `${cat.percentage}%`,
                              backgroundColor: COLORS[idx % COLORS.length]
                            }} 
                          />
                        </div>
                        <span className="text-sm font-medium whitespace-nowrap w-12 text-right">{cat.percentage.toFixed(1)}%</span>
                      </div>
                    </td>
                    <td className="py-3 pl-4 sm:py-4 sm:pl-6 text-sm text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                      {cat.note}
                    </td>
                  </tr>
                ))}
                {/* Total Row */}
                <tr className="border-t border-white/20">
                  <td className="py-4 pr-4 sm:pr-6 font-bold text-lg text-white">TỔNG CHI TIÊU MỚI</td>
                  <td className="py-4 px-4 sm:px-6 font-bold text-lg text-white whitespace-nowrap text-right">{formatCurrency(summary.totalNewCharges)}</td>
                  <td className="py-4 px-4 sm:px-6 font-bold text-lg text-white text-right">100%</td>
                  <td className="py-4 pl-4 sm:pl-6 text-sm text-slate-400">Toàn bộ chi tiêu trong kỳ</td>
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* AI Insights */}
      {insights && insights.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-indigo-500/10 border border-indigo-500/20 rounded-3xl p-5 sm:p-6 md:p-8"
        >
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-indigo-300">
             <SparklesIcon className="w-5 h-5" /> 
             Phân tích từ AI
          </h3>
          <ul className="space-y-3">
            {insights.map((insight, idx) => (
              <li key={idx} className="flex gap-3 text-indigo-100/80 leading-relaxed">
                <span className="text-indigo-400 font-bold mt-0.5">•</span>
                {insight}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  );
};

const SparklesIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
  </svg>
);
