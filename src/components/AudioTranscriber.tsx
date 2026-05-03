'use client';

import { useState, useEffect } from 'react';
import { Copy, RefreshCw, Upload, Link as LinkIcon, FileAudio, Play } from 'lucide-react';

interface AudioTranscriberProps {
  apiKey: string;
  initialUrl?: string;
}

export function AudioTranscriber({ apiKey, initialUrl }: AudioTranscriberProps) {
  const [inputType, setInputType] = useState<'upload' | 'url'>('upload');
  const [audioUrl, setAudioUrl] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [transcript, setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Auto-populate URL and trigger transcription when initialUrl is provided via query param
  useEffect(() => {
    if (!initialUrl) return;
    setInputType('url');
    setAudioUrl(initialUrl);
    if (!apiKey) return; // User will need to enter API key then trigger manually
    setIsLoading(true);
    setError(null);
    fetch('/api/transcribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ audioUrl: initialUrl, apiKey }),
    })
      .then((res) => res.json().then((data) => ({ ok: res.ok, data })))
      .then(({ ok, data }) => {
        if (!ok) throw new Error(data.error || 'Transcription failed');
        setTranscript(data.transcript);
      })
      .catch((err: any) => setError(err.message || 'An error occurred during transcription.'))
      .finally(() => setIsLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopy = () => {
    if (transcript) {
      navigator.clipboard.writeText(transcript);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setAudioUrl('');
    setAudioFile(null);
    setTranscript('');
    setError(null);
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleTranscribe = async () => {
    if (!apiKey) {
      setError('Please set your Gemini API Key first.');
      return;
    }

    if (inputType === 'upload' && !audioFile) {
      setError('Please select an audio file to transcribe.');
      return;
    }
    if (inputType === 'url' && !audioUrl) {
      setError('Please enter an audio URL.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      let body: Record<string, string>;

      if (inputType === 'upload' && audioFile) {
        const base64Data = await fileToBase64(audioFile);
        body = { fileData: base64Data, mimeType: audioFile.type || 'audio/mp3', apiKey };
      } else {
        body = { audioUrl, apiKey };
      }

      const res = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Transcription failed');

      setTranscript(data.transcript);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred during transcription.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-10 max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="space-y-6 text-center">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 text-pink-300 text-sm font-medium mb-4">
          Powered by Gemini 3 Flash Preview
        </div>
        <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight">
          Transcribe <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-indigo-400">Audio</span> magically
        </h2>
        <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Convert any speech to text instantly. Upload a file or paste a URL to get started.
        </p>
      </div>

      <div className="w-full max-w-2xl space-y-6">
        {/* Input Selector */}
        <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl w-full">
          <button
            onClick={() => setInputType('upload')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 ${
              inputType === 'upload'
              ? 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span className="font-semibold">Upload File</span>
          </button>
          <button
            onClick={() => setInputType('url')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 ${
              inputType === 'url'
              ? 'bg-gradient-to-r from-indigo-600 to-pink-600 text-white shadow-lg'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span className="font-semibold">Use URL</span>
          </button>
        </div>

        {/* Input Content */}
        <div className="p-8 bg-white/5 border border-white/10 rounded-2xl w-full">
          {inputType === 'upload' ? (
            <div className="w-full">
              <label
                htmlFor="audio-upload"
                className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl transition-all duration-300 cursor-pointer ${
                  audioFile
                    ? 'border-pink-500/50 bg-pink-500/10'
                    : 'border-white/20 hover:border-indigo-400/50 bg-black/20 hover:bg-black/40'
                }`}
              >
                <input
                  id="audio-upload"
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setAudioFile(file);
                  }}
                />
                {audioFile ? (
                  <div className="flex flex-col items-center text-pink-300 gap-3">
                    <FileAudio className="w-10 h-10" />
                    <span className="font-medium">{audioFile.name}</span>
                    <span className="text-sm opacity-70">{(audioFile.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-slate-400 gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-2">
                      <Upload className="w-6 h-6 text-indigo-400" />
                    </div>
                    <span className="font-semibold text-slate-300">Click to upload audio</span>
                    <span className="text-sm">MP3, WAV, M4A, etc.</span>
                  </div>
                )}
              </label>
            </div>
          ) : (
            <div className="w-full space-y-4">
              <label className="text-sm font-medium text-slate-300">Audio URL</label>
              <input
                type="url"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                placeholder="https://example.com/audio.mp3"
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all font-mono text-sm"
              />
              <p className="text-xs text-slate-500">
                ✅ Server-side fetch — no CORS restrictions on any URL.
              </p>
            </div>
          )}

          <div className="mt-8 flex justify-center">
            <button
              onClick={handleTranscribe}
              disabled={isLoading || (inputType === 'upload' ? !audioFile : !audioUrl)}
              className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white rounded-xl font-bold shadow-lg shadow-pink-500/25 transition-all overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 hover:scale-105 active:scale-95"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Transcribing...
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 fill-current" />
                  Start Transcription
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm w-full text-center">
            {error}
          </div>
        )}

        {/* Transcript Output */}
        {transcript && (
          <div className="w-full mt-10 animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <FileAudio className="w-5 h-5 text-pink-400" />
                Transcription Result
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                  title="Copy Transcript"
                >
                  {copied ? <span className="text-green-400 text-sm font-medium px-2">Copied!</span> : <Copy className="w-5 h-5" />}
                </button>
                <button
                  onClick={handleReset}
                  className="p-2 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
                  title="Reset"
                >
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-2xl pointer-events-none" />
              <textarea
                readOnly
                value={transcript}
                className="w-full h-80 bg-black/40 border border-white/10 rounded-2xl p-6 text-slate-300 leading-relaxed font-medium focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all resize-y"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
