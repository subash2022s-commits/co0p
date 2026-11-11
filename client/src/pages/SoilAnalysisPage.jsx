import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { apiService } from '../services/api.js';
import { AdvisoryHeader } from '../components/agriculture/AdvisoryHeader.jsx';
import { SoilMetricBar } from '../components/agriculture/SoilMetricBar.jsx';
import { Card, CardHeader, CardBody } from '../components/common/Card.jsx';
import { Button } from '../components/common/Button.jsx';
import { Input } from '../components/common/Input.jsx';
import { Select } from '../components/common/Select.jsx';
import { Textarea } from '../components/common/Textarea.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Toast } from '../components/common/Toast.jsx';
import { ErrorState } from '../components/common/ErrorState.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import { SOIL_TYPES } from '../utils/indiaAgriData.js';
import { Layers, Sparkles, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Microscope } from 'lucide-react';

export const SoilAnalysisPage = () => {
  const { profile } = useAuth();
  const { language } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    soilType: 'Red Sandy Loam',
    soilPH: 6.5,
    nitrogen: 210,
    phosphorus: 12,
    potassium: 140,
    organicCarbon: 0.42,
    electricalConductivity: 0.8,
    micronutrients: 'Zinc slightly low in previous soil test',
    additionalNotes: 'Field had maize in the last rotation',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = {
        soilType: formData.soilType,
        soilPH: formData.soilPH ? Number(formData.soilPH) : null,
        nitrogen: formData.nitrogen ? Number(formData.nitrogen) : null,
        phosphorus: formData.phosphorus ? Number(formData.phosphorus) : null,
        potassium: formData.potassium ? Number(formData.potassium) : null,
        organicCarbon: formData.organicCarbon ? Number(formData.organicCarbon) : null,
        electricalConductivity: formData.electricalConductivity ? Number(formData.electricalConductivity) : null,
        micronutrients: formData.micronutrients || null,
        additionalNotes: formData.additionalNotes || null,
        language,
      };

      const res = await apiService.analyzeSoil(payload);
      if (res.success && res.data) {
        setResult(res.data.analysis || res.data);
        setToast({ message: 'Soil health analysis completed successfully!', type: 'success' });
      }
    } catch (err) {
      console.error('Soil analysis error:', err);
      setError(err.message || 'Unable to analyze soil test. Please verify inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdvisoryHeader
        title="Soil Health & Fertility Diagnostic"
        subtitle="Evaluate laboratory soil test parameters, identify critical nutrient deficiencies, and receive corrective organic & mineral amendments"
        icon={Layers}
      />

      {/* Soil Parameter Form */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Microscope className="w-4 h-4 text-forest-700" />
            <h2 className="text-sm font-bold text-slate-900">Enter Soil Parameters (Laboratory or Field Observation)</h2>
          </div>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Soil Texture / Category"
                required
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                options={SOIL_TYPES}
              />

              <Input
                label="Soil pH"
                type="number"
                step="0.1"
                min="0"
                max="14"
                placeholder="e.g. 6.5"
                helperText="Optimal range is 6.5 to 7.5"
                value={formData.soilPH}
                onChange={(e) => setFormData({ ...formData, soilPH: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <Input
                label="Available Nitrogen (N)"
                type="number"
                unit="kg/ha"
                placeholder="e.g. 280"
                value={formData.nitrogen}
                onChange={(e) => setFormData({ ...formData, nitrogen: e.target.value })}
              />
              <Input
                label="Available Phosphorus (P)"
                type="number"
                unit="kg/ha"
                placeholder="e.g. 15"
                value={formData.phosphorus}
                onChange={(e) => setFormData({ ...formData, phosphorus: e.target.value })}
              />
              <Input
                label="Available Potassium (K)"
                type="number"
                unit="kg/ha"
                placeholder="e.g. 180"
                value={formData.potassium}
                onChange={(e) => setFormData({ ...formData, potassium: e.target.value })}
              />
              <Input
                label="Organic Carbon (OC)"
                type="number"
                step="0.05"
                unit="%"
                placeholder="e.g. 0.5"
                value={formData.organicCarbon}
                onChange={(e) => setFormData({ ...formData, organicCarbon: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Input
                label="Electrical Conductivity (EC)"
                type="number"
                step="0.1"
                unit="dS/m"
                placeholder="e.g. 0.6"
                helperText="Below 1.0 dS/m indicates non-saline soil"
                value={formData.electricalConductivity}
                onChange={(e) => setFormData({ ...formData, electricalConductivity: e.target.value })}
              />

              <Input
                label="Micronutrient Observations"
                placeholder="e.g. Zinc, Boron, Iron"
                value={formData.micronutrients}
                onChange={(e) => setFormData({ ...formData, micronutrients: e.target.value })}
              />
            </div>

            <Textarea
              label="Additional Field Notes or Previous Amendments"
              rows={2}
              placeholder="e.g. Applied 2 tractor loads of FYM last summer"
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
            />

            <div className="pt-2 flex justify-end">
              <Button type="submit" loading={loading} icon={Sparkles} className="w-full sm:w-auto">
                Analyze Soil Health
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Loading */}
      {loading && <LoadingSpinner agricultural message="Analyzing chemical & physical soil properties..." />}

      {/* Error */}
      {error && <ErrorState message={error} onRetry={handleSubmit} />}

      {/* Results Display */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          {/* Overall Health Overview */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-forest-800 to-forest-900 text-white shadow-sm">
            <div className="flex items-center justify-between gap-3 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Soil Health Diagnosis
              </span>
              <Badge variant="yellow" size="sm">
                pH: {result.soilPHStatus || 'Neutral'}
              </Badge>
            </div>
            <p className="text-sm sm:text-base leading-relaxed text-emerald-50">
              {result.overallAssessment}
            </p>
          </div>

          {/* Metric Status Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <SoilMetricBar
              label="Nitrogen (N)"
              value={formData.nitrogen}
              unit="kg/ha"
              status={result.nutrientAssessment?.nitrogen}
            />
            <SoilMetricBar
              label="Phosphorus (P)"
              value={formData.phosphorus}
              unit="kg/ha"
              status={result.nutrientAssessment?.phosphorus}
            />
            <SoilMetricBar
              label="Potassium (K)"
              value={formData.potassium}
              unit="kg/ha"
              status={result.nutrientAssessment?.potassium}
            />
            <SoilMetricBar
              label="Organic Carbon"
              value={formData.organicCarbon}
              unit="%"
              status={result.nutrientAssessment?.organicCarbon}
            />
          </div>

          {/* Deficiencies vs Excesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-amber-200 bg-amber-50/30">
              <CardBody className="p-5">
                <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Potential Nutrient Deficiencies
                </h3>
                {result.potentialDeficiencies?.length > 0 ? (
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {result.potentialDeficiencies.map((def, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                        <span>{def}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-500">No acute macro-nutrient deficiencies detected.</p>
                )}
              </CardBody>
            </Card>

            <Card className="border-emerald-200 bg-emerald-50/30">
              <CardBody className="p-5">
                <h3 className="text-sm font-bold text-emerald-900 flex items-center gap-2 mb-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Crops Naturally Suited to this Soil
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {result.suitableCrops?.map((crop, i) => (
                    <span key={i} className="text-xs bg-white border border-emerald-200 text-emerald-800 font-semibold px-2.5 py-1 rounded-lg">
                      {crop}
                    </span>
                  ))}
                </div>
              </CardBody>
            </Card>
          </div>

          {/* Actionable Soil Improvement Practices */}
          <Card>
            <CardHeader>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-forest-700" />
                Recommended Soil Improvement Practices
              </h3>
            </CardHeader>
            <CardBody className="space-y-3">
              {result.improvementPractices?.map((practice, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="w-6 h-6 rounded-full bg-forest-100 text-forest-800 text-xs font-bold flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{practice}</p>
                </div>
              ))}

              {result.additionalTestingRequired?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-700 block mb-2">
                    Recommended Follow-up Laboratory Testing:
                  </span>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-600">
                    {result.additionalTestingRequired.map((test, i) => (
                      <span key={i} className="bg-slate-100 px-2.5 py-1 rounded-md">
                        • {test}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

