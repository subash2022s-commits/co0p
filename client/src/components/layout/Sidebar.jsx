import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext.jsx';
import {
  LayoutDashboard,
  Sprout,
  Layers,
  FlaskConical,
  Droplets,
  Bug,
  CalendarCheck,
  BotMessageSquare,
  History,
  User,
  Settings,
  X,
} from 'lucide-react';

export const Sidebar = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  const navItems = [
    { to: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { to: '/crop-recommendation', label: t('cropRecommendation'), icon: Sprout },
    { to: '/soil-analysis', label: t('soilAnalysis'), icon: Layers },
    { to: '/fertilizer-advisory', label: t('fertilizerAdvisory'), icon: FlaskConical },
    { to: '/irrigation-advisory', label: t('irrigationAdvisory'), icon: Droplets },
    { to: '/disease-detection', label: t('diseaseDetection'), icon: Bug },
    { to: '/cultivation-calendar', label: t('cultivationCalendar'), icon: CalendarCheck },
    { to: '/ai-assistant', label: t('aiAssistant'), icon: BotMessageSquare, highlight: true },
    { to: '/history', label: t('advisoryHistory'), icon: History },
    { to: '/profile', label: t('profile'), icon: User },
    { to: '/settings', label: t('settings'), icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar sidebar */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-100 lg:hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Navigation</span>
          <button onClick={onClose} className="p-1 rounded-md text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => onClose?.()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-forest-100 text-forest-900 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  } ${item.highlight ? 'border border-forest-200 bg-forest-50/50' : ''}`
                }
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 ${
                    item.highlight ? 'text-forest-700' : 'text-slate-500'
                  }`}
                />
                <span className="truncate">{item.label}</span>
                {item.highlight && (
                  <span className="ml-auto text-[10px] bg-forest-600 text-white font-bold px-1.5 py-0.5 rounded-full uppercase">
                    AI
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Safety Reminder */}
        <div className="p-3 m-3 bg-emerald-50/80 border border-emerald-200 rounded-xl text-[11px] text-emerald-900">
          <p className="font-semibold mb-0.5 flex items-center gap-1">
            🌱 AgroAI Advisory Notice
          </p>
          <p className="text-emerald-700 leading-tight">
            Field decisions should consider local weather and agricultural extension (KVK) guidance.
          </p>
        </div>
      </aside>
    </>
  );
};

