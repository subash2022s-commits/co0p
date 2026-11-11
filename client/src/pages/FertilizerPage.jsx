import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { apiService } from '../services/api.js';
import { AdvisoryHeader } from '../components/agriculture/AdvisoryHeader.jsx';
import { Card, CardHeader, CardBody } from '../components/common/Card.jsx';
import { Button } from '../components/common/Button.jsx';
import { Input } from '../components/common/Input.jsx';
import { Select } from '../components/common/Select.jsx';
import { Textarea } from '../components/common/Textarea.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Toast } from '../components/common/Toast.jsx';
import { ErrorState } from '../components/common/ErrorState.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import { CROPS_CATALOG, GROWTH_STAGES, SOIL_TYPES } from '../utils/indiaAgriData.js';
import { FlaskConical, Sparkles, AlertTriangle, ShieldAlert, CheckCircle2, ArrowRight } from 'lucide-react';

export const FertilizerPage = () => {
  const { profile } = useAuth();
  const { language } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    cropName: 'Paddy (Rice)',
    cropVariety: 'JGL 1798',
    growthStage: 'Active Tillering / Branching',
    landArea: profile?.land_area || 2.0,
    landUnit: profile?.land_unit || 'acre',
    soilType: 'Red Sandy Loam',
    soilPH: 6.8,
    nitrogen: 220,
    phosphorus: 16,
    potassium: 150,
    farmingMethod: 'integrated',
    currentFertilizerUsage: 'Applied 1 bag DAP at transplanting',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = {
        cropName: formData.cropName,
        cropVariety: formData.cropVariety || null,
        growthStage: formData.growthStage,
        landArea: Number(formData.landArea),
        landUnit: formData.landUnit,
        soilType: formData.soilType || null,
        soilPH: formData.soilPH ? Number(formData.soilPH) : null,
        nitrogen: formData.nitrogen ? Number(formData.nitrogen) : null,
        phosphorus: formData.phosphorus ? Number(formData.phosphorus) : null,
        potassium: formData.potassium ? Number(formData.potassium) : null,
        farmingMethod: formData.farmingMethod,
        currentFertilizerUsage: formData.currentFertilizerUsage || null,
        language,
      };

      const res = await apiService.recommendFertilizer(payload);
      if (res.success && res.data) {
        setResult(res.data.advisory || res.data);
        setToast({ message: 'Fertilizer advisory generated!', type: 'success' });
      }
    } catch (err) {
      console.error('Fertilizer advisory error:', err);
      setError(err.message || 'Failed to generate fertilizer guidance.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdvisoryHeader
        title="Balanced Fertilizer & Crop Nutrition"
        subtitle="Scientific dosage planning combining organic base manure, bio-stimulants, and calibrated stage-by-stage macro/micro nutrients"
        icon={FlaskConical}
      />

      <Card>
        <CardHeader>
          <h2 className="text-sm font-bold text-slate-900">Crop Growth & Fertilizer Parameters</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Target Crop"
                required
                value={formData.cropName}
                onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                options={CROPS_CATALOG}
              />

              <Input
                label="Crop Variety (Optional)"
                placeholder="e.g. Sona Masoori, MTU 1010"
                value={formData.cropVariety}
                onChange={(e) => setFormData({ ...formData, cropVariety: e.target.value })}
              />

              <Select
                label="Current Growth Stage"
                required
                value={formData.growthStage}
                onChange={(e) => setFormData({ ...formData, growthStage: e.target.value })}
                options={GROWTH_STAGES}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Cultivated Area"
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

              <Select
                label="Farming Philosophy"
                value={formData.farmingMethod}
                onChange={(e) => setFormData({ ...formData, farmingMethod: e.target.value })}
                options={[
                  { value: 'integrated', label: 'Integrated Nutrient Management (Recommended)' },
                  { value: 'organic', label: '100% Organic (Manures & Biofertilizers)' },
                  { value: 'natural', label: 'Zero-Budget Natural Farming (ZBNF)' },
                  { value: 'conventional', label: 'Conventional / Standard Chemical' },
                ]}
              />
            </div>

            <Textarea
              label="Current / Previous Fertilizers Applied (Optional)"
              rows={2}
              placeholder="e.g. Applied 50kg Urea and 50kg DAP 2 weeks ago"
              value={formData.currentFertilizerUsage}
              onChange={(e) => setFormData({ ...formData, currentFertilizerUsage: e.target.value })}
            />

            <div className="pt-2 flex justify-end">
              <Button type="submit" loading={loading} icon={Sparkles} className="w-full sm:w-auto">
                Generate Nutrient Guidance
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Loading */}
      {loading && <LoadingSpinner agricultural message="Formulating balanced nutritional schedule..." />}

      {/* Error */}
      {error && <ErrorState message={error} onRetry={handleSubmit} />}

      {/* Results */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          {/* Stage Requirement Overview */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-forest-800 to-forest-900 text-white shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Nutrient Demand for {result.cropName} ({result.growthStage})
              </span>
            </div>
            <ul className="space-y-1 text-xs sm:text-sm text-emerald-50">
              {result.nutrientAssessment?.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-sun-400 font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations List */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3">
              Application Schedule ({result.recommendations?.length || 0} stages)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.recommendations?.map((rec, i) => (
                <Card key={i} hover className="border-slate-200">
                  <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800">{rec.fertilizerCategory}</span>
                    {rec.quantity && (
                      <Badge variant="forest">
                        {rec.quantity} {rec.quantityUnit}
                      </Badge>
                    )}
                  </div>
                  <CardBody className="p-5 space-y-3">
                    <p className="text-xs text-slate-600 leading-relaxed">{rec.reason}</p>
                    <div className="space-y-1.5 text-xs text-slate-700 pt-2 border-t border-slate-100">
                      <div>
                        <span className="font-semibold text-slate-500">Timing: </span>
                        <span>{rec.applicationTiming}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-slate-500">Method: </span>
                        <span>{rec.applicationMethod}</span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>

          {/* Safety Precautions & Chemical Warnings */}
          <Card className="border-amber-200 bg-amber-50/20">
            <CardHeader className="border-amber-200/50">
              <h3 className="text-xs font-bold text-amber-950 uppercase tracking-wider flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-600" />
                Handling Safety & Mixing Precautions
              </h3>
            </CardHeader>
            <CardBody className="space-y-2 text-xs text-slate-700">
              <ul className="list-disc pl-5 space-y-1">
                {result.safetyPrecautions?.map((sec, i) => (
                  <li key={i}>{sec}</li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

