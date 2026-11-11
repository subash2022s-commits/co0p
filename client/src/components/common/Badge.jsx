import React from 'react';

export const Badge = ({ children, variant = 'forest', size = 'sm', className = '' }) => {
  const variants = {
    forest: 'bg-forest-100 text-forest-800 border-forest-200',
    green: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    yellow: 'bg-amber-100 text-amber-800 border-amber-200',
    red: 'bg-red-100 text-red-800 border-red-200',
    blue: 'bg-sky-100 text-sky-800 border-sky-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
  };

  const sizes = {
    xs: 'px-2 py-0.5 text-[11px] font-medium',
    sm: 'px-2.5 py-1 text-xs font-semibold',
    md: 'px-3 py-1.5 text-sm font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${variants[variant] || variants.forest} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
};

