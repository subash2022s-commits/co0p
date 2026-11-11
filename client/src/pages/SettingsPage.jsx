import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { AdvisoryHeader } from '../components/agriculture/AdvisoryHeader.jsx';
import { Card, CardHeader, CardBody } from '../components/common/Card.jsx';
import { Button } from '../components/common/Button.jsx';
import { Select } from '../components/common/Select.jsx';
import { Input } from '../components/common/Input.jsx';
import { Toast } from '../components/common/Toast.jsx';
import { Settings, Globe, Shield, Lock, CheckCircle2 } from 'lucide-react';

export const SettingsPage = () => {
  const { user, profile, updateProfile } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const [toast, setToast] = useState(null);
  const [selectedLang, setSelectedLang] = useState(language);
  const [savingLang, setSavingLang] = useState(false);

  const handleLanguageSave = async (e) => {
    e.preventDefault();
    setSavingLang(true);
    try {
      setLanguage(selectedLang);
      await updateProfile({ preferred_language: selectedLang });
      setToast({ message: 'Language preferences saved!', type: 'success' });
    } catch (err) {
      setToast({ message: 'Saved locally.', type: 'info' });
    } finally {
      setSavingLang(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <AdvisoryHeader
        title="Application Settings"
        subtitle="Manage advisory language, account credentials, and data privacy"
        icon={Settings}
      />

      {/* Language Preference */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-forest-700" />
            <h2 className="text-sm font-bold text-slate-900">Regional Language Selection</h2>
          </div>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleLanguageSave} className="space-y-4">
            <p className="text-xs text-slate-500">
              Select the primary language in which AgroAI will formulate agricultural advice, chatbot explanations, and crop plans.
            </p>

            <div className="max-w-xs">
              <Select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
                  { value: 'hi', label: 'हिन्दी (Hindi)' },
                  { value: 'te', label: 'తెలుగు (Telugu)' },
                  { value: 'ta', label: 'தமிழ் (Tamil)' },
                ]}
              />
            </div>

            <Button type="submit" loading={savingLang} size="sm">
              Save Language
            </Button>
          </form>
        </CardBody>
      </Card>

      {/* Privacy & RLS Data Protection */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-forest-700" />
            <h2 className="text-sm font-bold text-slate-900">Farmer Data Privacy & Protection</h2>
          </div>
        </CardHeader>
        <CardBody className="space-y-3 text-xs text-slate-600">
          <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-100 flex items-start gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-emerald-900 block mb-0.5">
                Row Level Security (RLS) Active
              </span>
              <p className="text-emerald-800">
                Your farm parcels, soil tests, crop schedules, and chat history are isolated to your unique authenticated user account. No cross-farmer data leakage is permitted.
              </p>
            </div>
          </div>
          <p>
            AgroAI stores only farm-relevant parameters necessary to compute agronomic advice. You have the right to inspect, download, or delete your advisory records at any time.
          </p>
        </CardBody>
      </Card>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

