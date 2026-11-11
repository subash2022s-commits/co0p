import React from 'react';
import { Sprout, ShieldAlert, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';

export const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-forest-700 flex items-center justify-center text-white">
                <Sprout className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-forest-950">AgroAI Assistant</span>
            </div>
            <p className="text-xs text-slate-500 max-w-sm mb-4 leading-relaxed">
              Empowering farmers across India with AI-powered agricultural intelligence, crop suitability modeling, and sustainable field practices.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Built with care for the farming community</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
              Advisory Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>Crop Suitability Engine</li>
              <li>Soil Health Diagnostics</li>
              <li>Fertilizer & Nutrition Plans</li>
              <li>Smart Irrigation Guidance</li>
              <li>Disease & Pest Identification</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-3">
              Important Notice
            </h4>
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg text-[11px] text-amber-900 leading-normal flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <p>
                Recommendations are advisory aids. Farmers must verify chemical treatments with certified agricultural officers before field application.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} AgroAI Assistant. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>India Agriculture Edition</span>
            <span>•</span>
            <span>English / ಕನ್ನಡ</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

