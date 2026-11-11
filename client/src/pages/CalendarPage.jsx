import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { apiService } from '../services/api.js';
import { AdvisoryHeader } from '../components/agriculture/AdvisoryHeader.jsx';
import { Card, CardHeader, CardBody } from '../components/common/Card.jsx';
import { Button } from '../components/common/Button.jsx';
import { Input } from '../components/common/Input.jsx';
import { Select } from '../components/common/Select.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Toast } from '../components/common/Toast.jsx';
import { ErrorState } from '../components/common/ErrorState.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import { CROPS_CATALOG, SOIL_TYPES } from '../utils/indiaAgriData.js';
import { CalendarCheck, Sparkles, CheckCircle2, Circle, Clock, AlertTriangle, Trash2 } from 'lucide-react';

export const CalendarPage = () => {
  const { profile } = useAuth();
  const { language } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [calendars, setCalendars] = useState([]);
  const [selectedCalendar, setSelectedCalendar] = useState(null);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    cropName: 'Paddy (Rice)',
    startDate: new Date().toISOString().split('T')[0],
    sowingMethod: 'Transplanting in puddled field',
    soilType: 'Clayey Soil',
  });

  useEffect(() => {
    fetchCalendars();
  }, []);

  const fetchCalendars = async () => {
    try {
      const res = await apiService.getCalendars();
      if (res.success && res.data) {
        setCalendars(res.data);
        if (res.data.length > 0 && !selectedCalendar) {
          setSelectedCalendar(res.data[0]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch calendars:', err);
    }
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await apiService.generateCalendar({
        ...formData,
        state: profile?.state || 'Karnataka',
        language,
      });

      if (res.success && res.data) {
        setCalendars([res.data, ...calendars]);
        setSelectedCalendar(res.data);
        setToast({ message: 'Crop cultivation calendar generated!', type: 'success' });
      }
    } catch (err) {
      console.error('Calendar generation error:', err);
      setError(err.message || 'Unable to generate cultivation calendar.');
    } finally {
      setLoading(false);
    }
  };

  const toggleActivity = async (index) => {
    if (!selectedCalendar) return;

    const updatedActivities = [...selectedCalendar.activities];
    updatedActivities[index] = {
      ...updatedActivities[index],
      completed: !updatedActivities[index].completed,
    };

    // Optimistically update UI
    const updatedCal = { ...selectedCalendar, activities: updatedActivities };
    setSelectedCalendar(updatedCal);
    setCalendars(calendars.map((c) => (c.id === selectedCalendar.id ? updatedCal : c)));

    try {
      await apiService.updateCalendarActivities(selectedCalendar.id, updatedActivities);
      setToast({
        message: updatedActivities[index].completed ? 'Activity marked complete!' : 'Activity marked pending.',
        type: 'info',
      });
    } catch (err) {
      console.error('Failed to update activity:', err);
      // Revert on error
      fetchCalendars();
    }
  };

  const handleDeleteCalendar = async (id) => {
    if (!window.confirm('Delete this cultivation calendar?')) return;
    try {
      await apiService.deleteCalendar(id);
      const remaining = calendars.filter((c) => c.id !== id);
      setCalendars(remaining);
      setSelectedCalendar(remaining[0] || null);
      setToast({ message: 'Cultivation calendar deleted.', type: 'info' });
    } catch (err) {
      setToast({ message: err.message || 'Failed to delete calendar.', type: 'error' });
    }
  };

  const completedCount = selectedCalendar?.activities?.filter((a) => a.completed).length || 0;
  const totalCount = selectedCalendar?.activities?.length || 0;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      <AdvisoryHeader
        title="Crop Cultivation Calendar & Field Timeline"
        subtitle="Chronological farming schedule from land preparation to harvest with interactive activity tracking"
        icon={CalendarCheck}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Form & Saved Calendars List */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-sm font-bold text-slate-900">Generate New Cultivation Timeline</h2>
            </CardHeader>
            <CardBody>
              <form onSubmit={handleGenerate} className="space-y-4">
                <Select
                  label="Target Crop"
                  required
                  value={formData.cropName}
                  onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                  options={CROPS_CATALOG}
                />

                <Input
                  label="Sowing / Planned Start Date"
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                />

                <Select
                  label="Soil Type"
                  value={formData.soilType}
                  onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                  options={SOIL_TYPES}
                />

                <Input
                  label="Sowing / Planting Method"
                  placeholder="e.g. Line sowing, nursery transplanting"
                  value={formData.sowingMethod}
                  onChange={(e) => setFormData({ ...formData, sowingMethod: e.target.value })}
                />

                <Button type="submit" loading={loading} icon={Sparkles} className="w-full">
                  Create Timeline
                </Button>
              </form>
            </CardBody>
          </Card>

          {/* Saved Calendars Selector */}
          <Card>
            <CardHeader className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Your Crop Calendars ({calendars.length})
              </h3>
            </CardHeader>
            <CardBody className="p-0">
              {calendars.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400">
                  No calendars created yet. Generate one above!
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {calendars.map((cal) => (
                    <div
                      key={cal.id}
                      onClick={() => setSelectedCalendar(cal)}
                      className={`p-3.5 cursor-pointer flex items-center justify-between transition-colors ${
                        selectedCalendar?.id === cal.id
                          ? 'bg-forest-50 border-l-4 border-forest-600'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <span className="text-xs font-bold text-slate-900 block truncate">
                          {cal.crop_name}
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Started: {cal.start_date || 'Current date'}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteCalendar(cal.id);
                        }}
                        className="text-slate-300 hover:text-red-600 p-1"
                        title="Delete calendar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
        </div>

        {/* Right 2 Columns: Timeline View */}
        <div className="lg:col-span-2 space-y-4">
          {error && <ErrorState message={error} onRetry={handleGenerate} />}

          {loading ? (
            <LoadingSpinner agricultural message="Generating chronological timeline and field operations..." />
          ) : selectedCalendar ? (
            <Card>
              {/* Header with Progress Bar */}
              <div className="p-6 bg-gradient-to-r from-forest-800 to-forest-900 text-white rounded-t-xl">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                      Cultivation Timeline
                    </span>
                    <h3 className="text-xl font-black">{selectedCalendar.crop_name}</h3>
                  </div>
                  <Badge variant="yellow" size="md">
                    {completedCount} of {totalCount} Activities Completed ({completionPercentage}%)
                  </Badge>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2.5 bg-forest-950 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sun-400 rounded-full transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>

              {/* Activities Checklist */}
              <CardBody className="p-6">
                <div className="space-y-4">
                  {selectedCalendar.activities?.map((act, index) => {
                    const isDone = Boolean(act.completed);
                    return (
                      <div
                        key={index}
                        onClick={() => toggleActivity(index)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-4 ${
                          isDone
                            ? 'bg-slate-50 border-slate-200 opacity-75'
                            : 'bg-white border-slate-200/90 hover:border-forest-400 hover:shadow-sm'
                        }`}
                      >
                        <button
                          type="button"
                          className="mt-0.5 text-forest-600 focus:outline-none"
                        >
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-forest-600 fill-forest-100" />
                          ) : (
                            <Circle className="w-5 h-5 text-slate-300 hover:text-forest-500" />
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                            <span
                              className={`text-sm font-bold ${
                                isDone ? 'line-through text-slate-500' : 'text-slate-900'
                              }`}
                            >
                              {act.stage}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                                Day {act.dayFromStart} - {act.dayToStart}
                              </span>
                              <Badge
                                variant={
                                  act.importance === 'high'
                                    ? 'red'
                                    : act.importance === 'medium'
                                    ? 'yellow'
                                    : 'slate'
                                }
                                size="xs"
                              >
                                {act.importance}
                              </Badge>
                            </div>
                          </div>
                          <p
                            className={`text-xs leading-relaxed ${
                              isDone ? 'text-slate-400' : 'text-slate-600'
                            }`}
                          >
                            {act.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>
          ) : (
            <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
              <CalendarCheck className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-700">No Calendar Selected</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Select an existing crop calendar from the left or generate a new one for your target crop.
              </p>
            </div>
          )}
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

