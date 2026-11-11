import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { Sprout, LogOut, User, Globe, Menu, Sparkles } from 'lucide-react';

export const Navbar = ({ onToggleSidebar }) => {
  const { user, profile, isDemo, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile Toggle & Logo */}
          <div className="flex items-center gap-3">
            {user && onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                aria-label="Toggle navigation menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-forest-700 flex items-center justify-center text-white shadow-sm group-hover:bg-forest-800 transition-colors">
                <Sprout className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-lg text-forest-950 tracking-tight leading-tight flex items-center gap-1.5">
                  AgroAI
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-forest-100 text-forest-800 px-1.5 py-0.5 rounded">
                    India
                  </span>
                </span>
                <span className="text-[10px] font-medium text-slate-500 hidden sm:inline leading-none">
                  {t('appSubtitle')}
                </span>
              </div>
            </Link>
          </div>

          {/* Right: Language, Demo Tag & Profile */}
          <div className="flex items-center gap-3">
            {/* Demo indicator if active */}
            {isDemo && (
              <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>Demo Mode</span>
              </div>
            )}

            {/* Language Selector */}
            <div className="relative flex items-center">
              <Globe className="w-4 h-4 text-slate-400 absolute left-2.5 pointer-events-none" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="pl-8 pr-7 py-1.5 text-xs font-medium bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-forest-600"
                aria-label="Select Language"
              >
                <option value="en">English</option>
                <option value="kn">ಕನ್ನಡ (Kannada)</option>
              </select>
            </div>

            {user ? (
              <div className="flex items-center gap-2 border-l border-slate-200 pl-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-700"
                >
                  <div className="w-8 h-8 rounded-full bg-forest-100 text-forest-800 font-bold text-xs flex items-center justify-center border border-forest-200">
                    {(profile?.full_name || user.email || 'F')[0].toUpperCase()}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 hidden md:inline max-w-[120px] truncate">
                    {profile?.full_name || user.email?.split('@')[0]}
                  </span>
                </Link>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-700 hover:text-forest-700 px-3 py-2 rounded-lg"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-semibold bg-forest-700 text-white hover:bg-forest-800 px-3.5 py-2 rounded-lg shadow-sm"
                >
                  {t('register')}
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

