import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { apiService } from '../services/api.js';
import { AdvisoryHeader } from '../components/agriculture/AdvisoryHeader.jsx';
import { RecommendationCard } from '../components/agriculture/RecommendationCard.jsx';
import { Card, CardHeader, CardBody } from '../components/common/Card.jsx';
import { Button } from '../components/common/Button.jsx';
import { Input } from '../components/common/Input.jsx';
import { Select } from '../components/common/Select.jsx';
import { Toast } from '../components/common/Toast.jsx';
import { ErrorState } from '../components/common/ErrorState.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import { INDIAN_STATES, DISTRICTS_BY_STATE, SOIL_TYPES } from '../utils/indiaAgriData.js';
import { Sprout, ShieldAlert, Sparkles, Filter, Info } from 'lucide-react';

export const CropRecommendationPage = () => {
  const { profile } = useAuth();
  const { language } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Form State initialized from profile where available
  const [formData, setFormData] = useState({
    state: profile?.state || 'Karnataka',
    district: profile?.district || 'Mandya',
    soilType: 'Red Sandy Loam',
    season: 'Kharif',
    landArea: profile?.land_area || 2.0,
    landUnit: profile?.land_unit || 'acre',
    irrigationAvailable: profile?.irrigation_available ?? true,
    soilPH: 6.8,
    nitrogen: 240,
    phosphorus: 18,
    potassium: 160,
    organicCarbon: 0.55,
    preferredCategory: '',
    previousCrop: '',
    language: language || 'en',
  });

  const availableDistricts = DISTRICTS_BY_STATE[formData.state] || [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = {
        ...formData,
        landArea: Number(formData.landArea),
        soilPH: formData.soilPH ? Number(formData.soilPH) : null,
        nitrogen: formData.nitrogen ? Number(formData.nitrogen) : null,
        phosphorus: formData.phosphorus ? Number(formData.phosphorus) : null,
        potassium: formData.potassium ? Number(formData.potassium) : null,
        organicCarbon: formData.organicCarbon ? Number(formData.organicCarbon) : null,
        language,
      };

      const res = await apiService.recommendCrops(payload);
      if (res.success && res.data) {
        setResult(res.data.recommendations || res.data);
        setToast({ message: 'Crop recommendations generated successfully!', type: 'success' });
      }
    } catch (err) {
      console.error('Crop recommendation error:', err);
      setError(err.message || 'Unable to generate crop recommendations. Please verify your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdvisoryHeader
        title="Crop Recommendation Engine"
        subtitle="AI-driven crop suitability rankings based on local soil properties, seasonal windows, and irrigation access"
        icon={Sprout}
      />

      {/* Input Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-forest-700" />
            <h2 className="text-sm font-bold text-slate-900">Enter Field & Cultivation Parameters</h2>
          </div>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="State"
                required
                value={formData.state}
                onChange={(e) => {
                  const newState = e.target.value;
                  const dists = DISTRICTS_BY_STATE[newState] || [];
                  setFormData({
                    ...formData,
                    state: newState,
                    district: dists[0] || '',
                  });
                }}
                options={INDIAN_STATES}
              />

              <Select
                label="District"
                required
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                options={availableDistricts}
              />

              <Select
                label="Agricultural Season"
                required
                value={formData.season}
                onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                options={[
                  { value: 'Kharif', label: 'Kharif (Monsoon / June - Oct)' },
                  { value: 'Rabi', label: 'Rabi (Winter / Oct - March)' },
                  { value: 'Zaid', label: 'Zaid (Summer / March - June)' },
                  { value: 'Year-round', label: 'Perennial / Year-round' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Soil Texture / Type"
                required
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                options={SOIL_TYPES}
              />

              <Input
                label="Cultivable Land Area"
                type="number"
                step="0.1"
                min="0.1"
                required
                value={formData.landArea}
                onChange={(e) => setFormData({ ...formData, landArea: e.target.value })}
              />

              <Select
                label="Land Unit"
                value={formData.landUnit}
                onChange={(e) => setFormData({ ...formData, landUnit: e.target.value })}
                options={[
                  { value: 'acre', label: 'Acres' },
                  { value: 'hectare', label: 'Hectares' },
                  { value: 'sqm', label: 'Square Metres' },
                ]}
              />
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Irrigation Availability</span>
                <span className="text-[11px] text-slate-500">
                  Confirmed water source (Borewell / Canal / Well) vs strictly rainfed
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.irrigationAvailable}
                  onChange={(e) => setFormData({ ...formData, irrigationAvailable: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-forest-600"></div>
              </label>
            </div>

            {/* Optional Soil Lab Test Values */}
            <div className="pt-2 border-t border-slate-100">
              <span className="text-xs font-bold text-slate-700 block mb-2">
                Soil Laboratory Test Values (Optional - leave blank if not tested)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <Input
                  label="Soil pH"
                  type="number"
                  step="0.1"
                  min="0"
                  max="14"
                  placeholder="e.g. 6.8"
                  value={formData.soilPH}
                  onChange={(e) => setFormData({ ...formData, soilPH: e.target.value })}
                />
                <Input
                  label="Nitrogen (N)"
                  type="number"
                  unit="kg/ha"
                  placeholder="e.g. 240"
                  value={formData.nitrogen}
                  onChange={(e) => setFormData({ ...formData, nitrogen: e.target.value })}
                />
                <Input
                  label="Phosphorus (P)"
                  type="number"
                  unit="kg/ha"
                  placeholder="e.g. 18"
                  value={formData.phosphorus}
                  onChange={(e) => setFormData({ ...formData, phosphorus: e.target.value })}
                />
                <Input
                  label="Potassium (K)"
                  type="number"
                  unit="kg/ha"
                  placeholder="e.g. 160"
                  value={formData.potassium}
                  onChange={(e) => setFormData({ ...formData, potassium: e.target.value })}
                />
                <Input
                  label="Organic Carbon"
                  type="number"
                  step="0.05"
                  unit="%"
                  placeholder="e.g. 0.55"
                  value={formData.organicCarbon}
                  onChange={(e) => setFormData({ ...formData, organicCarbon: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" loading={loading} icon={Sparkles} className="w-full sm:w-auto">
                Generate Crop Recommendations
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Loading state */}
      {loading && <LoadingSpinner agricultural message="AgroAI is running agronomic suitability models for your land..." />}

      {/* Error state */}
      {error && <ErrorState message={error} onRetry={handleSubmit} />}

      {/* Results Display */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          {/* Summary Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-forest-800 to-forest-900 text-white shadow-sm">
            <h3 className="text-sm font-bold text-emerald-300 uppercase tracking-wider mb-1">
              Agronomic Assessment Summary
            </h3>
            <p className="text-sm sm:text-base leading-relaxed text-emerald-50">
              {result.summary}
            </p>

            {result.dataLimitations && result.dataLimitations.length > 0 && (
              <div className="mt-4 pt-3 border-t border-forest-700/60 flex items-start gap-2 text-xs text-forest-200">
                <Info className="w-4 h-4 text-sun-400 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-sun-300">Data Limitations: </span>
                  {result.dataLimitations.join(' • ')}
                </div>
              </div>
            )}
          </div>

          {/* Recommendations List */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-4">
              Recommended Crops for Your Field ({result.recommendations?.length || 0})
            </h3>
            <div className="space-y-4">
              {result.recommendations?.map((crop, idx) => (
                <RecommendationCard key={idx} crop={crop} rank={idx + 1} />
              ))}
            </div>
          </div>

          {/* Warnings & Safety Footer */}
          {result.warnings && result.warnings.length > 0 && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-amber-950">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                Agricultural Responsibility Notice
              </span>
              <ul className="list-disc pl-5 space-y-0.5">
                {result.warnings.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

