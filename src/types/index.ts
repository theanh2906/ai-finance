export interface Transaction {
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
}

export type AnalysisType = "statement" | "payslip";

export interface StatementSummary {
  bankName: string;
  accountHolder: string;
  period: string;
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  currency: string;
}

export interface StatementResult {
  type: "statement";
  summary: StatementSummary;
  transactions: Transaction[];
  insights: string[];
}

export interface PayslipSummary {
  employerName: string;
  employeeName: string;
  payPeriod: string;
  grossPay: number;
  netPay: number;
  totalDeductions: number;
  currency: string;
}

export interface PayslipDeduction {
  description: string;
  amount: number;
  type: "tax" | "insurance" | "pension" | "other";
}

export interface PayslipResult {
  type: "payslip";
  summary: PayslipSummary;
  deductions: PayslipDeduction[];
  insights: string[];
}

export type UniversalAnalysisResult = StatementResult | PayslipResult;

// Compatibility type for existing code that hasn't been migrated yet
export type AnalysisResult = StatementResult;

export interface AppState {
  apiKey: string;
  analysisResult: UniversalAnalysisResult | null;
  isLoading: boolean;
  error: string | null;
}
