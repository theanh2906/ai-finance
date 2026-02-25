# Proposal: analyze-payslip

## Problem Statement
The application "FinAI Analyzer" currently focuses exclusively on analyzing bank statements. However, users often need to track their income and deductions from payslips (salary slips) to maintain a comprehensive financial overview. Currently, there is no structured way to extract and visualize data from these documents within the app.

## Proposed Solution
We will extend the current Gemini-powered analysis capabilities to support payslips. This will include:
1.  **Backend/Logic**: Implementing a new `payslipSchema` and specific prompts for Gemini to accurately extract salary-related fields.
2.  **Frontend/UI**: Updating the upload interface to support multiple document types and creating a dedicated dashboard component (or updating the existing one) to visualize payslip data (Gross vs. Net, Deductions breakdown, etc.).

## Impact
### New Capabilities
- `payslip-extraction`: Ability to extract payroll data including Gross Salary, Net Salary, Taxes, Insurance, Bonuses, and Deductions from images or PDFs.
- `payslip-visualization`: Specialized dashboard charts and summaries for monthly salary trends and deduction breakdowns.

### Modified Capabilities
- `file-upload-interface`: Enhanced to allow users to select document type (Bank Statement vs. Payslip) or support intelligent auto-detection.
- `analysis-engine`: Refactored `gemini.ts` to be modular and handle multiple schemas and document contexts.

## Success Criteria
- Successful extraction of key fields (Net Pay, Gross Pay, Date, Employer) from a variety of payslip formats.
- A functional UI path for uploading and viewing payslip analysis.
- Maintain high accuracy (>90%) for standard field extraction across different languages/formats.
