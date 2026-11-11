import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button.jsx';
import { Sprout, Home } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-forest-100 text-forest-700 flex items-center justify-center mb-4">
        <Sprout className="w-8 h-8" />
      </div>
      <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">404</h1>
      <h2 className="text-lg font-bold text-slate-700 mb-2">Agricultural Field Not Found</h2>
      <p className="text-xs sm:text-sm text-slate-500 max-w-sm mb-6">
        The advisory page you are looking for has been moved, reaped, or does not exist.
      </p>
      <Link to="/dashboard">
        <Button icon={Home}>Return to Farmer Dashboard</Button>
      </Link>
    </div>
  );
};

