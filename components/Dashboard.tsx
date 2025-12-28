import React from 'react';
import { AnalysisResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Target, TrendingUp, Users, CheckCircle2, Award, Zap } from 'lucide-react';

interface DashboardProps {
  data: AnalysisResult;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
        <p className="font-semibold text-slate-200">{label}</p>
        <p className="text-emerald-400">
          Avg Views: {payload[0].value.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      
      {/* Top Section: Niche Identity */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Target className="w-32 h-32 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-slate-100 mb-2 flex items-center gap-2">
            <Target className="w-5 h-5 text-red-500" />
            Niche Identification
          </h2>
          <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400 mb-4">
            {data.niche}
          </div>
          <p className="text-slate-400 leading-relaxed mb-4">{data.channelOverview}</p>
          <div className="flex items-center gap-2 text-sm text-slate-500 bg-slate-950/50 p-3 rounded-lg border border-slate-800 w-fit">
            <Users className="w-4 h-4" />
            <span>Target Audience: {data.targetAudience}</span>
          </div>
        </div>

        {/* Quick Wins / Patterns */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl">
          <h2 className="text-xl font-bold text-slate-100 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-500" />
            Winning Patterns
          </h2>
          <ul className="space-y-3">
            {data.winningPatterns.map((pattern, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-slate-300 text-sm">{pattern}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Competitor Analysis Chart & Cards */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Award className="w-6 h-6 text-yellow-500" />
          Competitor Landscape
        </h2>
        
        {/* Chart */}
        <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl h-[400px]">
          <h3 className="text-lg font-semibold text-slate-400 mb-6">Average Views per Video (Estimated)</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.competitors} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis stroke="#94a3b8" tick={{ fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(value) => `${value / 1000}k`} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1e293b' }} />
              <Bar dataKey="avgViewsPerVideo" radius={[6, 6, 0, 0]}>
                {data.competitors.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#ef4444' : '#f97316'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Competitor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data.competitors.map((competitor, idx) => (
            <div key={idx} className="bg-slate-900 rounded-xl border border-slate-800 p-6 hover:border-slate-700 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg text-slate-100 group-hover:text-red-400 transition-colors">{competitor.name}</h3>
                <span className="text-xs font-mono bg-slate-800 text-slate-400 px-2 py-1 rounded">
                  {competitor.estimatedSubscribers} subs
                </span>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Top Strength</p>
                  <p className="text-sm text-slate-300">{competitor.strength}</p>
                </div>
                <div className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Top Performer</p>
                  <p className="text-sm text-red-200 font-medium line-clamp-2">"{competitor.topVideoTitle}"</p>
                  <p className="text-xs text-slate-400 mt-2 italic">{competitor.whyItWorks}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="space-y-6">
         <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Zap className="w-6 h-6 text-yellow-400" />
          Strategic Action Plan
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {data.recommendations.map((rec, idx) => (
            <div key={idx} className="bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-800 p-6 rounded-xl hover:shadow-lg transition-shadow relative overflow-hidden">
               <div className={`absolute top-0 left-0 w-1 h-full ${
                  rec.impactLevel === 'High' ? 'bg-emerald-500' : rec.impactLevel === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
               }`}></div>
               <div className="flex justify-between items-start mb-2">
                 <h3 className="font-bold text-lg text-slate-100">{rec.title}</h3>
                 <div className="flex gap-2">
                   <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded border ${
                      rec.difficulty === 'Easy' ? 'border-emerald-900 text-emerald-400 bg-emerald-900/20' : 
                      rec.difficulty === 'Moderate' ? 'border-yellow-900 text-yellow-400 bg-yellow-900/20' : 
                      'border-red-900 text-red-400 bg-red-900/20'
                   }`}>
                     {rec.difficulty}
                   </span>
                 </div>
               </div>
               <p className="text-slate-400 text-sm mb-4">{rec.description}</p>
               <div className="flex items-center gap-2 text-xs font-medium">
                 <span className="text-slate-500">Impact:</span>
                 <span className={`${
                    rec.impactLevel === 'High' ? 'text-emerald-400' : 'text-yellow-400'
                 }`}>
                   {rec.impactLevel} Priority
                 </span>
               </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
