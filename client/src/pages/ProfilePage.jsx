import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { apiService } from '../services/api.js';
import { AdvisoryHeader } from '../components/agriculture/AdvisoryHeader.jsx';
import { Card, CardHeader, CardBody } from '../components/common/Card.jsx';
import { Button } from '../components/common/Button.jsx';
import { Input } from '../components/common/Input.jsx';
import { Select } from '../components/common/Select.jsx';
import { Modal } from '../components/common/Modal.jsx';
import { Toast } from '../components/common/Toast.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import { INDIAN_STATES, DISTRICTS_BY_STATE, SOIL_TYPES, IRRIGATION_METHODS } from '../utils/indiaAgriData.js';
import { User, MapPin, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export const ProfilePage = () => {
  const { user, profile, updateProfile } = useAuth();
  const { setLanguage: setGlobalLang } = useLanguage();

  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    country: 'India',
    state: 'Karnataka',
    district: 'Mandya',
    village: '',
    preferred_language: 'en',
    farming_experience: 5,
    land_area: 2.0,
    land_unit: 'acre',
    farming_type: 'Integrated / Mixed',
    irrigation_available: true,
  });

  // Farms State
  const [farms, setFarms] = useState([]);
  const [loadingFarms, setLoadingFarms] = useState(true);
  const [isFarmModalOpen, setIsFarmModalOpen] = useState(false);
  const [newFarm, setNewFarm] = useState({
    farm_name: '',
    state: 'Karnataka',
    district: 'Mandya',
    soil_type: 'Red Sandy Loam',
    soil_ph: 6.8,
    land_area: 2.0,
    land_unit: 'acre',
    irrigation_method: 'Drip Irrigation',
  });
  const [savingFarm, setSavingFarm] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        country: profile.country || 'India',
        state: profile.state || 'Karnataka',
        district: profile.district || 'Mandya',
        village: profile.village || '',
        preferred_language: profile.preferred_language || 'en',
        farming_experience: profile.farming_experience ?? 5,
        land_area: profile.land_area ?? 2.0,
        land_unit: profile.land_unit || 'acre',
        farming_type: profile.farming_type || 'Integrated / Mixed',
        irrigation_available: Boolean(profile.irrigation_available),
      });
    }
  }, [profile]);

  useEffect(() => {
    async function fetchFarms() {
      try {
        setLoadingFarms(true);
        const res = await apiService.getFarms();
        if (res.success) {
          setFarms(res.data || []);
        }
      } catch (err) {
        console.error('Failed to fetch farms:', err);
      } finally {
        setLoadingFarms(false);
      }
    }
    fetchFarms();
  }, []);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile(formData);
      setGlobalLang(formData.preferred_language);
      setToast({ message: 'Farmer profile updated successfully!', type: 'success' });
    } catch (err) {
      setToast({ message: err.message || 'Failed to update profile.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddFarm = async (e) => {
    e.preventDefault();
    setSavingFarm(true);
    try {
      const res = await apiService.createFarm(newFarm);
      if (res.success) {
        setFarms([res.data, ...farms]);
        setIsFarmModalOpen(false);
        setNewFarm({
          farm_name: '',
          state: formData.state,
          district: formData.district,
          soil_type: 'Red Sandy Loam',
          soil_ph: 6.8,
          land_area: 2.0,
          land_unit: 'acre',
          irrigation_method: 'Drip Irrigation',
        });
        setToast({ message: 'New farm plot recorded!', type: 'success' });
      }
    } catch (err) {
      setToast({ message: err.message || 'Failed to save farm.', type: 'error' });
    } finally {
      setSavingFarm(false);
    }
  };

  const handleDeleteFarm = async (farmId) => {
    if (!window.confirm('Delete this farm plot?')) return;
    try {
      const res = await apiService.deleteFarm(farmId);
      if (res.success) {
        setFarms(farms.filter((f) => f.id !== farmId));
        setToast({ message: 'Farm plot removed.', type: 'info' });
      }
    } catch (err) {
      setToast({ message: err.message || 'Failed to delete farm.', type: 'error' });
    }
  };

  const availableDistricts = DISTRICTS_BY_STATE[formData.state] || [];

  return (
    <div>
      <AdvisoryHeader
        title="Farmer Profile & Land Management"
        subtitle="Maintain your personal agricultural background, primary land holding, and individual farm plots"
        icon={User}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Profile Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h2 className="text-base font-bold text-slate-900">Personal & Agricultural Information</h2>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

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

                  <Input
                    label="Village / Locality"
                    placeholder="e.g. Maddur Taluk"
                    value={formData.village}
                    onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input
                    label="Farming Experience"
                    type="number"
                    min="0"
                    unit="Years"
                    value={formData.farming_experience}
                    onChange={(e) =>
                      setFormData({ ...formData, farming_experience: parseInt(e.target.value) || 0 })
                    }
                  />

                  <Input
                    label="Total Land Area"
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={formData.land_area}
                    onChange={(e) =>
                      setFormData({ ...formData, land_area: parseFloat(e.target.value) || 0 })
                    }
                  />

                  <Select
                    label="Land Unit"
                    value={formData.land_unit}
                    onChange={(e) => setFormData({ ...formData, land_unit: e.target.value })}
                    options={[
                      { value: 'acre', label: 'Acres' },
                      { value: 'hectare', label: 'Hectares' },
                      { value: 'sqm', label: 'Square Metres' },
                    ]}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    label="Farming Type"
                    value={formData.farming_type}
                    onChange={(e) => setFormData({ ...formData, farming_type: e.target.value })}
                    options={[
                      { value: 'Integrated / Mixed', label: 'Integrated / Mixed Farming' },
                      { value: 'Conventional Chemical', label: 'Conventional / Standard' },
                      { value: 'Organic Certified', label: 'Organic Certified' },
                      { value: 'Natural / ZBNF', label: 'Natural Farming (ZBNF)' },
                    ]}
                  />

                  <Select
                    label="Preferred Language"
                    value={formData.preferred_language}
                    onChange={(e) => setFormData({ ...formData, preferred_language: e.target.value })}
                    options={[
                      { value: 'en', label: 'English' },
                      { value: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
                      { value: 'hi', label: 'हिन्दी (Hindi)' },
                    ]}
                  />
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">Irrigation Availability</span>
                    <span className="text-[11px] text-slate-500">
                      Do you have borewell, canal, or drip water access?
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.irrigation_available}
                      onChange={(e) =>
                        setFormData({ ...formData, irrigation_available: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-forest-600"></div>
                  </label>
                </div>

                <div className="pt-2">
                  <Button type="submit" loading={saving} className="w-full sm:w-auto">
                    Save Profile Information
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        </div>

        {/* Right Col: Registered Farm Plots */}
        <div>
          <Card>
            <CardHeader className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Farm Plots ({farms.length})</h3>
              <Button size="sm" icon={Plus} onClick={() => setIsFarmModalOpen(true)}>
                Add Plot
              </Button>
            </CardHeader>
            <CardBody className="p-0">
              {loadingFarms ? (
                <div className="p-6 text-center text-xs text-slate-500">Loading farm plots...</div>
              ) : farms.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  <p>No separate farm plots added.</p>
                  <p className="text-slate-400 mt-1">
                    Add specific plots to run crop & soil advisories per field.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {farms.map((farm) => (
                    <div key={farm.id} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">{farm.farm_name}</h4>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3 h-3" />
                            {farm.district}, {farm.state}
                          </span>
                        </div>
                        <button
                          onClick={() => handleDeleteFarm(farm.id)}
                          className="text-slate-400 hover:text-red-600 p-1"
                          title="Delete farm plot"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1.5 text-[10px]">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-medium">
                          {farm.land_area} {farm.land_unit}
                        </span>
                        {farm.soil_type && (
                          <span className="bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded font-medium">
                            {farm.soil_type}
                          </span>
                        )}
                        {farm.irrigation_method && (
                          <span className="bg-sky-50 text-sky-800 px-2 py-0.5 rounded font-medium">
                            {farm.irrigation_method}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Add Farm Plot Modal */}
      <Modal
        isOpen={isFarmModalOpen}
        onClose={() => setIsFarmModalOpen(false)}
        title="Add Farm Plot"
      >
        <form onSubmit={handleAddFarm} className="space-y-4">
          <Input
            label="Plot Name / Identification"
            required
            placeholder="e.g. North Canal Plot, Survey No 42"
            value={newFarm.farm_name}
            onChange={(e) => setNewFarm({ ...newFarm, farm_name: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Area"
              type="number"
              step="0.1"
              required
              value={newFarm.land_area}
              onChange={(e) =>
                setNewFarm({ ...newFarm, land_area: parseFloat(e.target.value) || 0 })
              }
            />
            <Select
              label="Unit"
              value={newFarm.land_unit}
              onChange={(e) => setNewFarm({ ...newFarm, land_unit: e.target.value })}
              options={[
                { value: 'acre', label: 'Acre' },
                { value: 'hectare', label: 'Hectare' },
              ]}
            />
          </div>

          <Select
            label="Soil Type"
            value={newFarm.soil_type}
            onChange={(e) => setNewFarm({ ...newFarm, soil_type: e.target.value })}
            options={SOIL_TYPES}
          />

          <Select
            label="Irrigation Method"
            value={newFarm.irrigation_method}
            onChange={(e) => setNewFarm({ ...newFarm, irrigation_method: e.target.value })}
            options={IRRIGATION_METHODS}
          />

          <div className="pt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsFarmModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={savingFarm}>
              Save Farm Plot
            </Button>
          </div>
        </form>
      </Modal>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

