# Design: analyze-payslip

## Context
The current architecture is tightly coupled with "Bank Statement" analysis. The types (`AnalysisResult`), the Gemini logic (`gemini.ts`), and the UI (`Dashboard.tsx`) all assume a bank statement structure (summary, transactions, etc.). To support payslips, we need a more polymorphic or union-based approach.

## Implementation Approach

### 1. Data Modeling Updates
We need to introduce a discriminating union for the analysis results to handle different document types.

```typescript
// Proposed updates to src/types/index.ts
export type AnalysisType = 'statement' | 'payslip';

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
  type: 'tax' | 'insurance' | 'pension' | 'other';
}

export interface PayslipResult {
  type: 'payslip';
  summary: PayslipSummary;
  deductions: PayslipDeduction[];
  insights: string[];
}

export interface StatementResult extends AnalysisResult {
  type: 'statement';
}

export type UniversalAnalysisResult = StatementResult | PayslipResult;
```

### 2. Gemini Logic Refactoring
The `analyzeStatement` function in `src/lib/gemini.ts` should be generalized.
- **Option A (Auto-detection)**: One prompt that asks Gemini to identify the document type and return the appropriate JSON structure.
- **Option B (Explict Mode)**: Separate functions or a parameter for `AnalysisType`.

We will proceed with **Option B** (explicit selection in UI) for better reliability, while allowing Gemini to fallback if it detects a mismatch.

### 3. Component Architecture
- **`App.tsx`**: Add a toggle/select for "Document Type".
- **`FileUpload.tsx`**: No major changes needed, just passes data up.
- **`Dashboard.tsx`**: Refactor to a "Container" components that switches between `StatementDashboard` and `PayslipDashboard` based on the result type.

## Risks / Trade-offs
- **Duplicate Logic**: Having two separate schemas and dashboards increases code volume but ensures high specificity for each document type.
- **Schema Complexity**: `UniversalAnalysisResult` will require type guards throughout the UI, which adds some boilerplate but improves safety.
