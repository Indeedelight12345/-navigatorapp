import React, { useState } from 'react';
import { AnalysisForm } from './components/AnalysisForm';
import { Dashboard } from './components/Dashboard';
import { analyzeYouTubeChannel } from './services/geminiService';
import { AnalysisState } from './types';
import { AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AnalysisState>({
    isLoading: false,
    error: null,
    result: null,
  });

  const handleAnalyze = async (url: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const result = await analyzeYouTubeChannel(url);
      setState({
        isLoading: false,
        error: null,
        result: result,
      });
    } catch (error: any) {
      setState({
        isLoading: false,
        error: error.message || 'An unexpected error occurred.',
        result: null,
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 selection:bg-red-500/30">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none fixed"></div>
      
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center font-bold text-white">
              N
            </div>
            <span className="font-bold text-lg tracking-tight">NicheNavigator AI</span>
          </div>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
            <a href="#" className="hover:text-white transition-colors">Features</a>
            <a href="#" className="hover:text-white transition-colors">Pricing</a>
            <a href="#" className="hover:text-white transition-colors">About</a>
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        {!state.result && (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
            <AnalysisForm onAnalyze={handleAnalyze} isLoading={state.isLoading} />
            {state.error && (
              <div className="mt-8 max-w-md w-full bg-red-900/20 border border-red-900/50 text-red-200 p-4 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-bottom-4">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <p className="text-sm">{state.error}</p>
              </div>
            )}
            
            {!state.isLoading && (
               <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl px-4 opacity-50 text-center">
                  <div className="p-4">
                    <h3 className="font-bold text-slate-300 mb-2">Competitor Recon</h3>
                    <p className="text-sm text-slate-500">Instantly find top creators in your niche and see what they're doing right.</p>
                  </div>
                   <div className="p-4">
                    <h3 className="font-bold text-slate-300 mb-2">Content Gaps</h3>
                    <p className="text-sm text-slate-500">Identify high-demand topics that your competitors are missing.</p>
                  </div>
                   <div className="p-4">
                    <h3 className="font-bold text-slate-300 mb-2">Growth Strategy</h3>
                    <p className="text-sm text-slate-500">Get an actionable checklist to improve your thumbnails, titles, and hooks.</p>
                  </div>
               </div>
            )}
          </div>
        )}

        {state.result && (
          <div className="animate-in fade-in zoom-in-95 duration-500">
             <div className="py-6 border-b border-slate-800 bg-slate-900/50">
                <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-slate-200">Analysis Report</h1>
                    <button 
                        onClick={() => setState(prev => ({ ...prev, result: null }))}
                        className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                        Analyze Another
                    </button>
                </div>
             </div>
             <Dashboard data={state.result} />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
