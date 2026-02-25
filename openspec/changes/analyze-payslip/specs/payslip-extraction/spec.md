# Spec: payslip-extraction

## Requirements
Extract structured data from payroll documents (payslips/salary slips) using Gemini AI.

### Requirement: Document Recognition
- **Given**: An image or PDF document.
- **When**: The user selects "Payslip" mode or auto-detection is active.
- **Then**: The system should identify key payroll entities regardless of layout.

### Requirement: Data Extraction Fields
- **Given**: A valid payslip.
- **When**: Analyzed by Gemini.
- **Then**: Extract the following fields:
    - `employerName`: String
    - `employeeName`: String
    - `payPeriod`: String (e.g., "August 2025")
    - `grossPay`: Number
    - `netPay`: Number
    - `totalDeductions`: Number
    - `currency`: String (ISO code or symbol)
    - `deductions`: Array of `{ description: string, amount: number, type: 'tax' | 'insurance' | 'pension' | 'other' }`

### Requirement: JSON Schema Validation
- **Given**: Gemini response.
- **When**: In payslip mode.
- **Then**: The response MUST strictly follow the `PayslipResult` schema defined in the design document.

### Requirement: Multi-language Support
- **Given**: Payslips in different languages (English, Vietnamese, etc.).
- **When**: Analyzed.
- **Then**: Labels should be correctly mapped to the schema fields (e.g., "Lương gộp" -> `grossPay`).
