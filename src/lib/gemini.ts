import {
  GoogleGenerativeAI,
  SchemaType,
  HarmCategory,
  HarmBlockThreshold,
  type Schema,
} from "@google/generative-ai";
import type { UniversalAnalysisResult, AnalysisType } from "../types";

const creditCardSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    summary: {
      type: SchemaType.OBJECT,
      properties: {
        cardHolder: { type: SchemaType.STRING },
        statementDate: { type: SchemaType.STRING },
        totalNewCharges: { type: SchemaType.NUMBER },
        currency: { type: SchemaType.STRING, description: "e.g., VND, USD" },
      },
      required: ["cardHolder", "statementDate", "totalNewCharges", "currency"],
    },
    categories: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          category: {
            type: SchemaType.STRING,
            description:
              "Vietnamese translated categories like Sức khỏe & Y tế, Ăn uống & Siêu thị, ...",
          },
          amount: { type: SchemaType.NUMBER },
          percentage: {
            type: SchemaType.NUMBER,
            description: "Percentage of total new charges (0 to 100)",
          },
          note: {
            type: SchemaType.STRING,
            description:
              "Summarized note about the largest expenses or related details in this category",
          },
        },
        required: ["category", "amount", "percentage", "note"],
      },
    },
    insights: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.STRING,
      },
    },
  },
  required: ["summary", "categories", "insights"],
};

const statementSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    summary: {
      type: SchemaType.OBJECT,
      properties: {
        bankName: { type: SchemaType.STRING },
        accountHolder: { type: SchemaType.STRING },
        period: { type: SchemaType.STRING },
        totalIncome: { type: SchemaType.NUMBER },
        totalExpense: { type: SchemaType.NUMBER },
        netBalance: { type: SchemaType.NUMBER },
        currency: { type: SchemaType.STRING },
      },
      required: [
        "bankName",
        "accountHolder",
        "period",
        "totalIncome",
        "totalExpense",
        "netBalance",
        "currency",
      ],
    },
    transactions: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          date: { type: SchemaType.STRING, description: "YYYY-MM-DD" },
          description: { type: SchemaType.STRING },
          amount: { type: SchemaType.NUMBER },
          type: { type: SchemaType.STRING, description: "income or expense" },
          category: {
            type: SchemaType.STRING,
            description: "e.g., Food, Rent, Salary, etc.",
          },
        },
        required: ["date", "description", "amount", "type", "category"],
      },
    },
    insights: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.STRING,
      },
    },
  },
  required: ["summary", "transactions", "insights"],
};

const payslipSchema: Schema = {
  type: SchemaType.OBJECT,
  properties: {
    summary: {
      type: SchemaType.OBJECT,
      properties: {
        employerName: { type: SchemaType.STRING },
        employeeName: { type: SchemaType.STRING },
        payPeriod: { type: SchemaType.STRING },
        grossPay: { type: SchemaType.NUMBER },
        netPay: { type: SchemaType.NUMBER },
        totalDeductions: { type: SchemaType.NUMBER },
        currency: { type: SchemaType.STRING },
      },
      required: [
        "employerName",
        "employeeName",
        "payPeriod",
        "grossPay",
        "netPay",
        "totalDeductions",
        "currency",
      ],
    },
    deductions: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          description: { type: SchemaType.STRING },
          amount: { type: SchemaType.NUMBER },
          type: {
            type: SchemaType.STRING,
            description: "tax | insurance | pension | other",
          },
        },
        required: ["description", "amount", "type"],
      },
    },
    insights: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
  },
  required: ["summary", "deductions", "insights"],
};

const SYSTEM_PROMPT = `
You are an expert financial analyst. Your task is to analyze financial documents (bank statements or payslips).
The user will provide an image or text of a document.

Guidelines:
1. Handle multiple languages and currencies. 
2. Be as accurate as possible with amounts, dates, and names.
3. If a required field is not found, DO NOT leave it out. Use "N/A" for strings and 0 for numbers.
4. For payslips, ensure you extract all deduction line items correctly.
`;

export async function analyzeDocument(
  apiKey: string,
  fileData: string,
  mimeType: string,
  type: AnalysisType = "statement",
): Promise<UniversalAnalysisResult> {
  const genAI = new GoogleGenerativeAI(apiKey);

  let schema = statementSchema;
  let prompt =
    "Analyze this bank statement. Provide a summary and a list of transactions.";

  if (type === "payslip") {
    schema = payslipSchema;
    prompt =
      "Analyze this payslip. Provide a summary including Gross Pay, Net Pay, and a detailed list of deductions.";
  } else if (type === "credit_card") {
    schema = creditCardSchema;
    prompt =
      "Analyze this credit card statement. Provide a summary with total new charges. Group all expenses into categories (like Sức khỏe & Y tế, Ăn uống & Siêu thị, v.v.), calculate the total amount per category, the percentage of each category relative to the total, and add a brief note for each category highlighting key expenses or details. Write the note and categories in Vietnamese.";
  }

  const model = genAI.getGenerativeModel({
    model: "gemini-3-flash-preview",
    systemInstruction: SYSTEM_PROMPT,
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema,
    },
  });

  const parts = [
    {
      inlineData: {
        data: fileData.split(",")[1] || fileData,
        mimeType,
      },
    },
    { text: prompt },
  ];

  try {
    const result = await model.generateContent(parts);
    const response = await result.response;
    const text = response.text();

    try {
      const parsed = JSON.parse(text);
      // Add discrimination type
      return { ...parsed, type } as UniversalAnalysisResult;
    } catch (parseError) {
      console.error("JSON Parse Error. Raw text:", text);
      throw new Error("Gemini returned an invalid response format.");
    }
  } catch (rawError: any) {
    console.error("Gemini API Error details:", rawError);

    // Check for common safety filter rejection
    if (rawError.message?.includes("SAFETY")) {
      throw new Error(
        "Analysis blocked by safety filters. Payslips contain sensitive data that some AI settings may restrict.",
      );
    }

    throw new Error(
      `Failed to analyze ${type}. ${rawError.message || "Please check your API key and file format."}`,
    );
  }
}

// Keep alias for compatibility if needed, but updated to use new function
/** @deprecated Use analyzeDocument instead */
export async function analyzeStatement(
  apiKey: string,
  fileData: string,
  mimeType: string,
): Promise<UniversalAnalysisResult> {
  return analyzeDocument(apiKey, fileData, mimeType, "statement");
}
