import React from 'react';
import type { UniversalAnalysisResult } from '../types';
import { StatementDashboard } from './StatementDashboard';
import { PayslipDashboard } from './PayslipDashboard';

interface DashboardProps {
  data: UniversalAnalysisResult;
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  if (data.type === 'statement') {
    return <StatementDashboard data={data} />;
  }

  if (data.type === 'payslip') {
    return <PayslipDashboard data={data} />;
  }

  return (
    <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-3xl text-red-400 text-center">
      Unsupported analysis type.
    </div>
  );
};
