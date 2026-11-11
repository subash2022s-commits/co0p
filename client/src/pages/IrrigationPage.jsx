import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { apiService } from '../services/api.js';
import { AdvisoryHeader } from '../components/agriculture/AdvisoryHeader.jsx';
import { Card, CardHeader, CardBody } from '../components/common/Card.jsx';
import { Button } from '../components/common/Button.jsx';
import { Input } from '../components/common/Input.jsx';
import { Select } from '../components/common/Select.jsx';
import { Toast } from '../components/common/Toast.jsx';
import { ErrorState } from '../components/common/ErrorState.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import { CROPS_CATALOG, GROWTH_STAGES, SOIL_TYPES, IRRIGATION_METHODS } from '../utils/indiaAgriData.js';
import { Droplets, Sparkles, Clock, AlertCircle, ShieldAlert, Waves } from 'lucide-react';

export const IrrigationPage = () => {
  const { profile } = useAuth();
  const { language } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    cropName: 'Paddy (Rice)',
    growthStage: 'Active Tillering / Branching',
    soilType: 'Red Sandy Loam',
    landArea: profile?.land_area || 2.0,
    landUnit: profile?.land_unit || 'acre',
    irrigationMethod: 'Drip Irrigation',
    waterAvailability: 'moderate',
    lastRainfall: 'No rain in last 5 days',
    temperature: 31,
    humidity: 65,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = {
        cropName: formData.cropName,
        growthStage: formData.growthStage,
        soilType: formData.soilType,
        landArea: Number(formData.landArea),
        landUnit: formData.landUnit,
        irrigationMethod: formData.irrigationMethod,
        waterAvailability: formData.waterAvailability,
        lastRainfall: formData.lastRainfall || null,
        temperature: formData.temperature ? Number(formData.temperature) : null,
        humidity: formData.humidity ? Number(formData.humidity) : null,
        language,
      };

      const res = await apiService.recommendIrrigation(payload);
      if (res.success && res.data) {
        setResult(res.data.advisory || res.data);
        setToast({ message: 'Irrigation advisory generated!', type: 'success' });
      }
    } catch (err) {
      console.error('Irrigation advisory error:', err);
      setError(err.message || 'Failed to generate irrigation advice.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdvisoryHeader
        title="Smart Irrigation & Water Management"
        subtitle="Growth-stage water scheduling, drought mitigation, evaporation reduction, and drainage safeguarding"
        icon={Droplets}
      />

      <Card>
        <CardHeader>
          <h2 className="text-sm font-bold text-slate-900">Crop, Soil & Water Parameters</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Crop"
                required
                value={formData.cropName}
                onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                options={CROPS_CATALOG}
              />

              <Select
                label="Growth Stage"
                required
                value={formData.growthStage}
                onChange={(e) => setFormData({ ...formData, growthStage: e.target.value })}
                options={GROWTH_STAGES}
              />

              <Select
                label="Soil Type"
                required
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                options={SOIL_TYPES}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Irrigation Method"
                required
                value={formData.irrigationMethod}
                onChange={(e) => setFormData({ ...formData, irrigationMethod: e.target.value })}
                options={IRRIGATION_METHODS}
              />

              <Select
                label="Water Source Availability"
                value={formData.waterAvailability}
                onChange={(e) => setFormData({ ...formData, waterAvailability: e.target.value })}
                options={[
                  { value: 'abundant', label: 'Abundant (Continuous source)' },
                  { value: 'moderate', label: 'Moderate (Borewell / Rotational canal)' },
                  { value: 'scarce', label: 'Scarce (Limited / Drought prone)' },
                ]}
              />

              <Input
                label="Recent Rainfall Status"
                placeholder="e.g. Light shower 3 days ago"
                value={formData.lastRainfall}
                onChange={(e) => setFormData({ ...formData, lastRainfall: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <Input
                label="Land Area"
                type="number"
                step="0.1"
                min="0.1"
                required
                value={formData.landArea}
                onChange={(e) => setFormData({ ...formData, landArea: e.target.value })}
              />

              <Select
                label="Unit"
                value={formData.landUnit}
                onChange={(e) => setFormData({ ...formData, landUnit: e.target.value })}
                options={[
                  { value: 'acre', label: 'Acres' },
                  { value: 'hectare', label: 'Hectares' },
                ]}
              />

              <Input
                label="Daytime Temp (°C)"
                type="number"
                placeholder="e.g. 32"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
              />

              <Input
                label="Humidity (%)"
                type="number"
                placeholder="e.g. 60"
                value={formData.humidity}
                onChange={(e) => setFormData({ ...formData, humidity: e.target.value })}
              />
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" loading={loading} icon={Sparkles} className="w-full sm:w-auto">
                Generate Irrigation Plan
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Loading */}
      {loading && <LoadingSpinner agricultural message="Calculating crop evapotranspiration & irrigation timing..." />}

      {/* Error */}
      {error && <ErrorState message={error} onRetry={handleSubmit} />}

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          {/* Requirement Overview */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-sky-900 to-forest-900 text-white shadow-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
              Water Requirement Assessment
            </span>
            <p className="text-sm sm:text-base leading-relaxed text-sky-50 mt-1">
              {result.waterRequirement}
            </p>
          </div>

          {/* Timed Recommendations */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3">Recommended Timing & Frequency</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.irrigationRecommendations?.map((rec, i) => (
                <Card key={i} hover className="p-5 border-slate-200">
                  <div className="flex items-center gap-2 text-xs font-bold text-sky-900 mb-2">
                    <Clock className="w-4 h-4 text-sky-600" />
                    <span>{rec.timing}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed mb-3">{rec.reason}</p>
                  <div className="text-[11px] text-slate-500 font-medium">Method: {rec.method}</div>
                </Card>
              ))}
            </div>
          </div>

          {/* Conservation vs Stress Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-emerald-200 bg-emerald-50/20">
              <CardBody className="p-5">
                <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Waves className="w-4 h-4 text-emerald-700" />
                  Water Conservation Techniques
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {result.waterConservationMethods?.map((m, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>

            <Card className="border-amber-200 bg-amber-50/20">
              <CardBody className="p-5">
                <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  Water Stress Indicators
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {result.waterStressIndicators?.map((ind, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{ind}</span>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </div>

          {/* Drainage Advice */}
          {result.drainageAdvice?.length > 0 && (
            <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-700">
              <span className="font-bold text-slate-900 block mb-1">Drainage Management:</span>
              <p>{result.drainageAdvice.join(' ')}</p>
            </div>
          )}
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

