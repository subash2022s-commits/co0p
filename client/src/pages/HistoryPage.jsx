import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService } from '../services/api.js';
import { AdvisoryHeader } from '../components/agriculture/AdvisoryHeader.jsx';
import { Card, CardHeader, CardBody } from '../components/common/Card.jsx';
import { Button } from '../components/common/Button.jsx';
import { Input } from '../components/common/Input.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { Toast } from '../components/common/Toast.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import {
  History,
  Search,
  Filter,
  Trash2,
  ExternalLink,
  Sprout,
  Layers,
  FlaskConical,
  Droplets,
  Bug,
  CalendarCheck,
} from 'lucide-react';

export const HistoryPage = () => {
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [records, setRecords] = useState([]);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchAllHistory();
  }, []);

  const fetchAllHistory = async () => {
    try {
      setLoading(true);
      const [crops, soil, fertilizers, irrigations, diseases, calendars] = await Promise.all([
        apiService.getCropRecommendations(),
        apiService.getSoilReports(),
        apiService.getFertilizerAdvisories(),
        apiService.getIrrigationAdvisories(),
        apiService.getDiseaseReports(),
        apiService.getCalendars(),
      ]);

      const merged = [
        ...(crops.data || []).map((c) => ({
          id: c.id,
          type: 'crop',
          title: `Crop Recommendation (${c.input_data?.season || 'Seasonal'})`,
          cropName: c.recommendations?.recommendations?.[0]?.cropName || 'Multiple crops',
          summary: c.recommendations?.summary || 'Suitability assessment',
          created_at: c.created_at,
          data: c,
        })),
        ...(soil.data || []).map((s) => ({
          id: s.id,
          type: 'soil',
          title: `Soil Health Analysis`,
          cropName: s.soil_data?.soilType || 'Soil Test',
          summary: s.analysis?.overallAssessment || 'Soil diagnostic',
          created_at: s.created_at,
          data: s,
        })),
        ...(fertilizers.data || []).map((f) => ({
          id: f.id,
          type: 'fertilizer',
          title: `Fertilizer Advisory (${f.crop_name})`,
          cropName: f.crop_name,
          summary: `Stage: ${f.input_data?.growthStage || 'Vegetative'}`,
          created_at: f.created_at,
          data: f,
        })),
        ...(irrigations.data || []).map((i) => ({
          id: i.id,
          type: 'irrigation',
          title: `Irrigation Schedule (${i.crop_name})`,
          cropName: i.crop_name,
          summary: i.advisory?.waterRequirement || 'Water plan',
          created_at: i.created_at,
          data: i,
        })),
        ...(diseases.data || []).map((d) => ({
          id: d.id,
          type: 'disease',
          title: `Disease Diagnosis (${d.crop_name})`,
          cropName: d.crop_name,
          summary: d.symptoms || 'Symptoms observed',
          created_at: d.created_at,
          data: d,
        })),
        ...(calendars.data || []).map((cal) => ({
          id: cal.id,
          type: 'calendar',
          title: `Cultivation Calendar (${cal.crop_name})`,
          cropName: cal.crop_name,
          summary: `${cal.activities?.length || 0} farming stages scheduled`,
          created_at: cal.created_at,
          data: cal,
        })),
      ];

      merged.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      setRecords(merged);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm('Delete this advisory record from your history?')) return;
    try {
      if (type === 'crop') await apiService.deleteCropRecommendation(id);
      else if (type === 'soil') await apiService.deleteSoilReport(id);
      else if (type === 'fertilizer') await apiService.deleteFertilizerAdvisory(id);
      else if (type === 'irrigation') await apiService.deleteIrrigationAdvisory(id);
      else if (type === 'disease') await apiService.deleteDiseaseReport(id);
      else if (type === 'calendar') await apiService.deleteCalendar(id);

      setRecords(records.filter((r) => r.id !== id));
      setToast({ message: 'Record deleted successfully.', type: 'info' });
    } catch (err) {
      setToast({ message: err.message || 'Failed to delete record.', type: 'error' });
    }
  };

  const filtered = records.filter((r) => {
    const matchesType = filterType === 'all' || r.type === filterType;
    const matchesSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cropName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.summary?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'crop':
        return Sprout;
      case 'soil':
        return Layers;
      case 'fertilizer':
        return FlaskConical;
      case 'irrigation':
        return Droplets;
      case 'disease':
        return Bug;
      case 'calendar':
        return CalendarCheck;
      default:
        return History;
    }
  };

  return (
    <div className="space-y-6">
      <AdvisoryHeader
        title="Advisory & Field Records History"
        subtitle="Search, review, and manage previously generated agricultural recommendations and crop schedules"
        icon={History}
      />

      {/* Filter & Search Bar */}
      <Card>
        <CardBody className="p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Type filter tabs */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {[
              { id: 'all', label: 'All' },
              { id: 'crop', label: 'Crops' },
              { id: 'soil', label: 'Soil' },
              { id: 'fertilizer', label: 'Fertilizer' },
              { id: 'irrigation', label: 'Irrigation' },
              { id: 'disease', label: 'Disease' },
              { id: 'calendar', label: 'Calendar' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filterType === tab.id
                    ? 'bg-forest-700 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search history..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-forest-600 bg-white"
            />
          </div>
        </CardBody>
      </Card>

      {/* Records Table / List */}
      <Card>
        <CardBody className="p-0">
          {loading ? (
            <LoadingSpinner message="Fetching past advisories..." />
          ) : filtered.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-400">
              No historical advisory records matching your search or filter.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filtered.map((item) => {
                const Icon = getIcon(item.type);
                return (
                  <div
                    key={item.id}
                    className="p-4 sm:p-5 hover:bg-slate-50 transition-colors flex items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-forest-50 text-forest-700 flex items-center justify-center flex-shrink-0 mt-0.5 sm:mt-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                            {item.title}
                          </h4>
                          <Badge variant="slate" size="xs">
                            {item.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-500 truncate max-w-xl">{item.summary}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          Recorded: {new Date(item.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Link to={`/history/${item.id}?type=${item.type}`}>
                        <Button size="sm" variant="outline" icon={ExternalLink}>
                          View
                        </Button>
                      </Link>
                      <button
                        onClick={() => handleDelete(item.id, item.type)}
                        className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardBody>
      </Card>

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

