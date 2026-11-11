import React from 'react';

export const SoilMetricBar = ({ label, value, status, unit = '' }) => {
  const getStatusColor = (s) => {
    const lower = (s || '').toLowerCase();
    if (lower === 'low' || lower === 'deficient') return 'text-amber-700 bg-amber-100 border-amber-300';
    if (lower === 'high' || lower === 'excess') return 'text-purple-700 bg-purple-100 border-purple-300';
    if (lower === 'medium' || lower === 'optimum' || lower === 'neutral') return 'text-emerald-700 bg-emerald-100 border-emerald-300';
    return 'text-slate-600 bg-slate-100 border-slate-300';
  };

  return (
    <div className="p-3 bg-white rounded-lg border border-slate-200">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold text-slate-700">{label}</span>
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusColor(status)}`}>
          {status || 'Unknown'}
        </span>
      </div>
      <div className="text-sm font-extrabold text-slate-900">
        {value !== null && value !== undefined ? `${value} ${unit}`.trim() : 'Not Tested'}
      </div>
    </div>
  );
};

