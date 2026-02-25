# Tasks: analyze-payslip

## 1. Data Model & Types
- [x] 1.1 Update `src/types/index.ts` to include `AnalysisType`, `PayslipResult`, and `UniversalAnalysisResult` as defined in `design.md`.
- [x] 1.2 Update `AppState` to use `UniversalAnalysisResult` instead of `AnalysisResult | null`.

## 2. Gemini Logic Refactoring
- [x] 2.1 Refactor `src/lib/gemini.ts` to support multiple schemas.
- [x] 2.2 Implement `payslipSchema` in `src/lib/gemini.ts` following `specs/payslip-extraction/spec.md`.
- [x] 2.3 Update `analyzeStatement` to accept a `type: AnalysisType` parameter and use the appropriate schema and prompt.

## 3. Core UI Updates
- [x] 3.1 Update `src/App.tsx` state to handle the selected document type (`statement` vs `payslip`).
- [x] 3.2 Add a document type selector (toggle or tabs) in `src/App.tsx` before the `FileUpload` component.
- [x] 3.3 Pass the selected document type to the Gemini analysis function.

## 4. Dashboard Enhancements
- [x] 4.1 Create `src/components/StatementDashboard.tsx` by moving current dashboard logic there.
- [x] 4.2 Create `src/components/PayslipDashboard.tsx` with specialized visualizations for Gross/Net Pay and Deductions.
- [x] 4.3 Update `src/components/Dashboard.tsx` to act as a switcher/container that renders the correct dashboard based on the result type.

## 5. Testing & Validation
- [x] 5.1 Verify bank statement analysis still works correctly.
- [x] 5.2 Test payslip analysis with sample documents (English and Vietnamese).
- [x] 5.3 Ensure responsive design for both dashboard types.
