import { NextRequest, NextResponse } from 'next/server';
import { transcribeAudioServer } from '@/lib/gemini.server';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fileData, mimeType, audioUrl, apiKey } = body as {
      fileData?: string;
      mimeType?: string;
      audioUrl?: string;
      apiKey: string;
    };

    if (!apiKey) {
      return NextResponse.json({ error: 'Please set your Gemini API Key.' }, { status: 401 });
    }

    let base64Data = '';
    let resolvedMimeType = mimeType || 'audio/mp3';

    if (audioUrl) {
      // Server-side fetch: no CORS restrictions at all!
      const response = await fetch(audioUrl);
      if (!response.ok) {
        return NextResponse.json(
          { error: `Failed to fetch audio from URL: ${response.statusText}` },
          { status: 400 },
        );
      }
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      base64Data = buffer.toString('base64');
      resolvedMimeType = response.headers.get('content-type') || 'audio/mp3';
    } else if (fileData) {
      base64Data = fileData.includes(',') ? fileData.split(',')[1] : fileData;
    } else {
      return NextResponse.json({ error: 'Must provide either audioUrl or fileData' }, { status: 400 });
    }

    const transcript = await transcribeAudioServer(apiKey, base64Data, resolvedMimeType);
    return NextResponse.json({ transcript });
  } catch (error: any) {
    console.error('[/api/transcribe] Error:', error);
    return NextResponse.json({ error: error.message || 'Transcription failed' }, { status: 500 });
  }
}
