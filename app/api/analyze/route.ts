import { NextRequest, NextResponse } from 'next/server';
import { analyzeDocumentServer } from '@/lib/gemini.server';
import type { AnalysisType } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileData, mimeType, type, apiKey } = body as {
      fileData: string;
      mimeType: string;
      type: AnalysisType;
      apiKey: string;
    };

    if (!apiKey) {
      return NextResponse.json({ error: 'Please set your Gemini API Key.' }, { status: 401 });
    }

    if (!fileData || !mimeType || !type) {
      return NextResponse.json({ error: 'Missing required fields: fileData, mimeType, type' }, { status: 400 });
    }

    const result = await analyzeDocumentServer(apiKey, fileData, mimeType, type);
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('[/api/analyze] Error:', error);
    return NextResponse.json({ error: error.message || 'Analysis failed' }, { status: 500 });
  }
}
