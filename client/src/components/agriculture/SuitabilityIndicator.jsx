import React from 'react';

export const SuitabilityIndicator = ({ score = 80, level = 'High' }) => {
  let color = 'text-emerald-600 bg-emerald-50 border-emerald-200';
  let barColor = 'bg-emerald-500';

  if (score < 50 || level.toLowerCase() === 'low') {
    color = 'text-amber-700 bg-amber-50 border-amber-200';
    barColor = 'bg-amber-500';
  } else if (score < 75 || level.toLowerCase() === 'medium') {
    color = 'text-sky-700 bg-sky-50 border-sky-200';
    barColor = 'bg-sky-500';
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex flex-col items-center">
        <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center border font-extrabold ${color}`}>
          <span className="text-base leading-none">{score}</span>
          <span className="text-[10px] opacity-75 font-semibold mt-0.5">/100</span>
        </div>
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between text-xs font-semibold mb-1">
          <span className="text-slate-600">Suitability Level</span>
          <span className="capitalize">{level}</span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${Math.min(100, Math.max(0, score))}%` }}
          />
        </div>
      </div>
    </div>
  );
};

