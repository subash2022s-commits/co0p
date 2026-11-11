import React from 'react';
import { Loader2, Sprout } from 'lucide-react';

export const LoadingSpinner = ({ message = 'Loading...', size = 'md', agricultural = false }) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      {agricultural ? (
        <div className="relative mb-4">
          <div className="w-14 h-14 rounded-full bg-forest-100 flex items-center justify-center animate-pulse">
            <Sprout className="w-7 h-7 text-forest-700 animate-bounce" />
          </div>
        </div>
      ) : (
        <Loader2 className={`animate-spin text-forest-600 mb-3 ${size === 'lg' ? 'w-10 h-10' : 'w-6 h-6'}`} />
      )}
      <p className="text-sm font-medium text-slate-600">{message}</p>
    </div>
  );
};

export const LoadingScreen = ({ message = 'Initializing AgroAI platform...' }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="w-16 h-16 rounded-2xl bg-forest-700 flex items-center justify-center shadow-lg shadow-forest-900/20 mb-4 animate-pulse">
        <Sprout className="w-9 h-9 text-white" />
      </div>
      <h2 className="text-xl font-bold text-slate-800 mb-1">AgroAI</h2>
      <p className="text-sm text-slate-500">{message}</p>
    </div>
  );
};

