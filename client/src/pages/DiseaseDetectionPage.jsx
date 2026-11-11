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
import { CROPS_CATALOG } from '../utils/indiaAgriData.js';
import { Bug, Sparkles, Upload, Image as ImageIcon, AlertTriangle, ShieldCheck, CheckCircle2, X } from 'lucide-react';

export const DiseaseDetectionPage = () => {
  const { language } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    cropName: 'Tomato',
    affectedPart: 'leaves',
    symptoms: 'Brown concentric ring spots on lower leaves with yellow halo',
    duration: '5 days',
    visibleDamage: 'Lower foliage turning brittle; spreading upwards',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setToast({ message: 'Only JPEG, PNG, and WebP images are allowed.', type: 'error' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setToast({ message: 'Image size must be less than 5 MB.', type: 'error' });
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImageFile(null);
    if (imagePreview) URL.revokeObjectURL(imagePreview);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const dataPayload = new FormData();
      dataPayload.append('cropName', formData.cropName);
      dataPayload.append('affectedPart', formData.affectedPart);
      dataPayload.append('symptoms', formData.symptoms);
      dataPayload.append('duration', formData.duration);
      dataPayload.append('visibleDamage', formData.visibleDamage || '');
      dataPayload.append('language', language || 'en');

      if (imageFile) {
        dataPayload.append('image', imageFile);
      }

      const res = await apiService.analyzeDisease(dataPayload);
      if (res.success && res.data) {
        setResult(res.data.analysis || res.data);
        setToast({ message: 'Crop disease diagnosis completed!', type: 'success' });
      }
    } catch (err) {
      console.error('Disease detection error:', err);
      setError(err.message || 'Unable to complete disease diagnosis.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <AdvisoryHeader
        title="Crop Disease & Pest Diagnosis"
        subtitle="Identify plant pathogens, insect attacks, and physiological disorders with Integrated Pest Management (IPM) guidance"
        icon={Bug}
      />

      <Card>
        <CardHeader>
          <h2 className="text-sm font-bold text-slate-900">Symptom Observation & Optional Leaf/Plant Photo</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Select
                label="Affected Crop"
                required
                value={formData.cropName}
                onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                options={CROPS_CATALOG}
              />

              <Select
                label="Affected Plant Part"
                required
                value={formData.affectedPart}
                onChange={(e) => setFormData({ ...formData, affectedPart: e.target.value })}
                options={[
                  { value: 'leaves', label: 'Leaves / Foliage' },
                  { value: 'stem', label: 'Stem / Branch / Bark' },
                  { value: 'root', label: 'Root / Collar / Crown' },
                  { value: 'fruit', label: 'Fruit / Pod / Earhead' },
                  { value: 'flower', label: 'Flower / Inflorescence' },
                  { value: 'whole_plant', label: 'Entire Plant / Wilting' },
                ]}
              />

              <Input
                label="Problem Duration"
                required
                placeholder="e.g. 4 days, 1 week"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              />
            </div>

            <Textarea
              label="Observable Symptoms & Markings"
              required
              rows={3}
              placeholder="Describe discoloration, spots (color, size, ring pattern), wilting, powdery mildew, insect bites, or sticky sap..."
              value={formData.symptoms}
              onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
            />

            <Input
              label="Visible Insects, Larvae, or Physical Damage (Optional)"
              placeholder="e.g. Small green caterpillars under leaves, stem holes"
              value={formData.visibleDamage}
              onChange={(e) => setFormData({ ...formData, visibleDamage: e.target.value })}
            />

            {/* Image Upload Box */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Upload Plant Photo (Optional - Leaf, Stem, or Pest)
              </label>
              {!imagePreview ? (
                <label className="border-2 border-dashed border-slate-300 hover:border-forest-500 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className="p-3 rounded-full bg-forest-50 text-forest-700 mb-2">
                    <Upload className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">Click to upload photo or take picture</span>
                  <span className="text-[11px] text-slate-400 mt-0.5">JPEG, PNG, or WebP up to 5MB</span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              ) : (
                <div className="relative inline-block border rounded-xl overflow-hidden shadow-sm bg-slate-100">
                  <img src={imagePreview} alt="Crop symptom preview" className="h-44 w-auto object-cover" />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 text-white hover:bg-red-700 shadow"
                    title="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" loading={loading} icon={Sparkles} className="w-full sm:w-auto">
                Diagnose Crop Health
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Loading */}
      {loading && <LoadingSpinner agricultural message="Cross-referencing pathology patterns & symptom taxonomy..." />}

      {/* Error */}
      {error && <ErrorState message={error} onRetry={handleSubmit} />}

      {/* Results Display */}
      {result && (
        <div className="space-y-6 animate-fade-in">
          {/* Possible Conditions */}
          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3">Diagnostic Findings</h3>
            <div className="space-y-4">
              {result.possibleConditions?.map((cond, idx) => (
                <Card key={idx} hover className="border-slate-200">
                  <div className="px-5 py-4 bg-gradient-to-r from-forest-50 to-white border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 uppercase tracking-wider block">Condition #{idx + 1}</span>
                      <h4 className="text-base font-bold text-slate-900">{cond.name}</h4>
                    </div>
                    <Badge variant={cond.confidenceLevel?.toLowerCase() === 'high' ? 'forest' : 'yellow'}>
                      Confidence: {cond.confidenceLevel || 'Moderate'}
                    </Badge>
                  </div>

                  <CardBody className="space-y-3">
                    {/* Supporting symptoms */}
                    <div>
                      <span className="text-xs font-bold text-slate-700 block mb-1">Supporting Evidence:</span>
                      <ul className="space-y-1 text-xs text-slate-600">
                        {cond.supportingSymptoms?.map((s, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-forest-600 font-bold">•</span>
                            <span>{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Alternative Causes */}
                    {cond.alternativeCauses?.length > 0 && (
                      <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                        <span className="font-bold text-slate-800 block mb-0.5">Alternative Possible Causes:</span>
                        <span className="text-slate-600">{cond.alternativeCauses.join('; ')}</span>
                      </div>
                    )}

                    {/* Inspection steps */}
                    {cond.recommendedInspection?.length > 0 && (
                      <div>
                        <span className="text-xs font-bold text-slate-700 block mb-1">Recommended Physical Inspection:</span>
                        <ul className="space-y-1 text-xs text-slate-600">
                          {cond.recommendedInspection.map((ins, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-amber-500 font-bold">→</span>
                              <span>{ins}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardBody>
                </Card>
              ))}
            </div>
          </div>

          {/* Integrated Pest Management (IPM) & Biological Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-emerald-200 bg-emerald-50/20">
              <CardBody className="p-5">
                <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  Integrated Pest Management (IPM)
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {result.integratedPestManagement?.map((ipm, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{ipm}</span>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>

            <Card className="border-sky-200 bg-sky-50/20">
              <CardBody className="p-5">
                <h4 className="text-xs font-bold text-sky-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-sky-700" />
                  Preventive & Sanitation Measures
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700">
                  {result.preventiveMeasures?.map((pm, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-sky-600 font-bold">•</span>
                      <span>{pm}</span>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          </div>

          {/* Treatment Guidance */}
          {result.treatmentGuidance?.length > 0 && (
            <Card>
              <CardHeader>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Responsible Treatment Protocol
                </h4>
              </CardHeader>
              <CardBody>
                <ul className="space-y-2 text-xs text-slate-700">
                  {result.treatmentGuidance.map((tg, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded-full bg-forest-100 text-forest-800 text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <span className="pt-0.5 leading-relaxed">{tg}</span>
                    </li>
                  ))}
                </ul>
              </CardBody>
            </Card>
          )}

          {/* Mandatory Safety Warnings */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
            <span className="font-bold flex items-center gap-1.5 text-amber-950">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              Critical Pathology & Regulatory Notice
            </span>
            <p>
              AI visual and symptom identification is a decision-support aid. Never apply unverified chemicals or off-label pesticides. Always consult your district Krishi Vigyan Kendra (KVK) officer for laboratory pathology verification if symptoms are spreading rapidly.
            </p>
          </div>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

