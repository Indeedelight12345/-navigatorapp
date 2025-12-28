import React, { useState } from 'react';
import { Search, Youtube, Loader2 } from 'lucide-react';

interface AnalysisFormProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

export const AnalysisForm: React.FC<AnalysisFormProps> = ({ onAnalyze, isLoading }) => {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 mb-4">
          NicheNavigator AI
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Uncover hidden opportunities, analyze competitors, and dominate your YouTube niche with AI-driven insights.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-orange-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
        <div className="relative bg-slate-900 rounded-xl shadow-2xl border border-slate-800 p-2 flex items-center">
          <div className="pl-4 text-slate-500">
            <Youtube className="w-6 h-6" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste YouTube Channel or Video URL..."
            className="w-full bg-transparent border-none text-slate-100 placeholder-slate-500 focus:ring-0 text-lg py-3 px-4"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !url.trim()}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200
              ${isLoading 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-gradient-to-r from-red-600 to-orange-600 text-white hover:from-red-500 hover:to-orange-500 shadow-lg shadow-red-900/20'
              }
            `}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <Search className="w-5 h-5" />
                <span>Analyze</span>
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-6 flex justify-center gap-4 text-sm text-slate-500">
        <span>try:</span>
        <button 
          onClick={() => setUrl('https://www.youtube.com/channel/UCZiMbBhKff7TunQTACvOywA')}
          className="text-slate-400 hover:text-red-400 underline decoration-dotted transition-colors"
        >
          Sample Channel
        </button>
        <button 
          onClick={() => setUrl('https://www.youtube.com/watch?v=jfKfPfyJRdk')}
          className="text-slate-400 hover:text-red-400 underline decoration-dotted transition-colors"
        >
          Lofi Girl
        </button>
      </div>
    </div>
  );
};
