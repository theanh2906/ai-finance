import { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { Dashboard } from './components/Dashboard';
import { analyzeDocument } from './lib/gemini';
import type { AnalysisType, UniversalAnalysisResult } from './types';
import { Bot, RefreshCw, Github, FileText, CreditCard } from 'lucide-react';

function App() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
  const [result, setResult] = useState<UniversalAnalysisResult | null>(null);
  const [docType, setDocType] = useState<AnalysisType>('statement');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (file: File) => {
    if (!apiKey) {
      setError("VITE_GEMINI_API_KEY is not set in the .env file.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Data = e.target?.result as string;
        try {
          const analysis = await analyzeDocument(apiKey, base64Data, file.type, docType);
          setResult(analysis);
        } catch (err: any) {
          setError(err.message || "An error occurred during analysis.");
        } finally {
          setLoading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError("Failed to process file.");
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-slate-50 font-sans selection:bg-indigo-500/30 flex flex-col">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={handleReset}>
            <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-pink-500 rounded-xl rotate-12 group-hover:rotate-0 transition-transform duration-300 shadow-lg shadow-indigo-500/20">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-100 to-indigo-300 tracking-tight">
              FinAI Analyzer
            </h1>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-2.5 hover:bg-white/10 rounded-xl transition-colors hover:text-white"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-12 lg:py-20 relative z-10 w-full flex flex-col justify-center">
        {!apiKey && (
          <div className="mb-8 p-6 bg-red-500/10 border border-red-500/20 rounded-2xl flex flex-col items-center justify-center text-center">
            <h3 className="text-red-400 font-bold mb-2 text-lg">Missing API Key</h3>
            <p className="text-red-200 text-sm max-w-lg">
              Please create a <code className="bg-black/30 px-2 py-1 rounded">.env</code> file in the root directory and set <code className="bg-black/30 px-2 py-1 rounded">VITE_GEMINI_API_KEY="your_api_key_here"</code>.
            </p>
          </div>
        )}

        <div className="w-full">
          {!result ? (
            <div className="flex flex-col items-center justify-center space-y-12 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="space-y-6 text-center">
                <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-sm font-medium mb-4">
                  Powered by Google Gemini-1.5-Flash
                </div>
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight leading-tight">
                  Analyze your <br className="hidden md:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400">financial docs</span> instantly
                </h2>
                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                  Unlock powerful financial insights from your data in seconds. Select a document type and upload your file.
                </p>
              </div>

              {/* Document Type Selector */}
              <div className="flex p-1 bg-white/5 border border-white/10 rounded-2xl w-full max-w-md mx-auto">
                <button
                  onClick={() => setDocType('statement')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 ${
                    docType === 'statement' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span className="font-semibold">Bank Statement</span>
                </button>
                <button
                  onClick={() => setDocType('payslip')}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl transition-all duration-300 ${
                    docType === 'payslip' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span className="font-semibold">Payslip</span>
                </button>
              </div>
              
              <div className="w-full">
                <FileUpload onFileSelect={handleFileSelect} isLoading={loading} />
              </div>

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm max-w-md w-full text-center">
                  {error}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-white/10">
                <div>
                  <h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-2">
                    {result.type === 'statement' ? result.summary.bankName : result.summary.employerName} Analysis
                  </h2>
                  <p className="text-slate-400 text-lg flex items-center gap-2">
                    Extracted details for <strong className="text-white bg-white/10 px-3 py-1 rounded-lg">
                      {result.type === 'statement' ? result.summary.accountHolder : result.summary.employeeName}
                    </strong>
                  </p>
                </div>
                <button 
                  onClick={handleReset}
                  className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-xl font-medium transition-all flex items-center gap-2 hover:scale-105 active:scale-95 shadow-lg whitespace-nowrap"
                >
                  <RefreshCw className="w-4 h-4" />
                  Upload Another
                </button>
              </div>
              
              <Dashboard data={result} />
            </div>
          )}
        </div>
      </main>

      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px]" />
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pink-600/10 blur-[120px]" />
      </div>
    </div>
  );
}

export default App;
