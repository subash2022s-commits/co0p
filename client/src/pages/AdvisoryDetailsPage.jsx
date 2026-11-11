import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { apiService } from '../services/api.js';
import { AdvisoryHeader } from '../components/agriculture/AdvisoryHeader.jsx';
import { RecommendationCard } from '../components/agriculture/RecommendationCard.jsx';
import { Card, CardHeader, CardBody } from '../components/common/Card.jsx';
import { Button } from '../components/common/Button.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import { ErrorState } from '../components/common/ErrorState.jsx';
import {
  FileText,
  Printer,
  Trash2,
  Calendar,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const AdvisoryDetailsPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const type = searchParams.get('type') || 'crop';

  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchRecord() {
      try {
        setLoading(true);
        let res;
        if (type === 'crop') res = await apiService.getCropRecommendationById(id);
        else if (type === 'soil') res = await apiService.getSoilReportById(id);
        else if (type === 'fertilizer') res = await apiService.getFertilizerAdvisoryById(id);
        else if (type === 'irrigation') res = await apiService.getIrrigationAdvisoryById(id);
        else if (type === 'disease') res = await apiService.getDiseaseReportById(id);
        else if (type === 'calendar') res = await apiService.getCalendarById(id);

        if (res && res.success) {
          setRecord(res.data);
        } else {
          setError('Advisory report not found.');
        }
      } catch (err) {
        setError(err.message || 'Unable to load advisory details.');
      } finally {
        setLoading(false);
      }
    }
    fetchRecord();
  }, [id, type]);

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this advisory permanently?')) return;
    try {
      if (type === 'crop') await apiService.deleteCropRecommendation(id);
      else if (type === 'soil') await apiService.deleteSoilReport(id);
      else if (type === 'fertilizer') await apiService.deleteFertilizerAdvisory(id);
      else if (type === 'irrigation') await apiService.deleteIrrigationAdvisory(id);
      else if (type === 'disease') await apiService.deleteDiseaseReport(id);
      else if (type === 'calendar') await apiService.deleteCalendar(id);
      navigate('/history');
    } catch (err) {
      alert('Failed to delete report: ' + err.message);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading advisory report details..." />;
  }

  if (error || !record) {
    return (
      <div className="space-y-4">
        <AdvisoryHeader title="Advisory Report" backTo="/history" backLabel="Back to History" />
        <ErrorState message={error || 'Record could not be found'} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <AdvisoryHeader
          title={`Advisory Report: ${type.toUpperCase()}`}
          subtitle={`Generated on ${new Date(record.created_at).toLocaleString()}`}
          icon={FileText}
          backTo="/history"
          backLabel="Back to History"
        />

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={Printer} onClick={handlePrint}>
            Print Report
          </Button>
          <Button variant="danger" size="sm" icon={Trash2} onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>

      {/* Render based on advisory type */}
      {type === 'crop' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-sm font-bold text-slate-900">Submitted Field Conditions</h3>
            </CardHeader>
            <CardBody className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-400 block">Location</span>
                <span className="font-semibold text-slate-800">
                  {record.input_data?.district}, {record.input_data?.state}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Season</span>
                <span className="font-semibold text-slate-800">{record.input_data?.season}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Soil</span>
                <span className="font-semibold text-slate-800">{record.input_data?.soilType}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Irrigation</span>
                <span className="font-semibold text-slate-800">
                  {record.input_data?.irrigationAvailable ? 'Available' : 'Rainfed'}
                </span>
              </div>
            </CardBody>
          </Card>

          {/* Recommendations List */}
          <div className="space-y-4">
            {record.recommendations?.recommendations?.map((crop, i) => (
              <RecommendationCard key={i} crop={crop} rank={i + 1} />
            ))}
          </div>
        </div>
      )}

      {type === 'soil' && (
        <Card>
          <CardHeader>
            <h3 className="text-sm font-bold text-slate-900">Soil Diagnostic Assessment</h3>
          </CardHeader>
          <CardBody className="space-y-4 text-xs sm:text-sm">
            <p className="text-slate-700 leading-relaxed">{record.analysis?.overallAssessment}</p>

            <div className="pt-3 border-t border-slate-100">
              <h4 className="font-bold text-slate-800 mb-2">Recommended Amendments:</h4>
              <ul className="list-disc pl-5 space-y-1 text-slate-600">
                {record.analysis?.improvementPractices?.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          </CardBody>
        </Card>
      )}

      {type === 'fertilizer' && (
        <Card>
          <CardHeader>
            <h3 className="text-sm font-bold text-slate-900">Fertilizer Guidance for {record.crop_name}</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {record.advisory?.recommendations?.map((rec, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800">{rec.fertilizerCategory}</span>
                    {rec.quantity && (
                      <Badge variant="forest">
                        {rec.quantity} {rec.quantityUnit}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-2">{rec.reason}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {type === 'disease' && (
        <Card>
          <CardHeader>
            <h3 className="text-sm font-bold text-slate-900">Disease Pathology Report ({record.crop_name})</h3>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <span className="font-bold text-slate-700 block mb-1">Reported Symptoms:</span>
              <p className="text-slate-600">{record.symptoms}</p>
            </div>

            {record.analysis?.possibleConditions?.map((cond, i) => (
              <div key={i} className="p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-slate-900">{cond.name}</h4>
                  <Badge variant="forest">{cond.confidenceLevel} Confidence</Badge>
                </div>
                <div className="text-xs text-slate-600 space-y-1">
                  {cond.supportingSymptoms?.map((s, idx) => (
                    <p key={idx}>• {s}</p>
                  ))}
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      )}
    </div>
  );
};

