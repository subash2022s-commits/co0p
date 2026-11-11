import React from 'react';
import { Card, CardBody } from '../common/Card.jsx';
import { Badge } from '../common/Badge.jsx';
import { SuitabilityIndicator } from './SuitabilityIndicator.jsx';
import { Clock, Calendar, Droplets, AlertTriangle, ArrowRight, ShieldCheck } from 'lucide-react';

export const RecommendationCard = ({ crop, rank = 1 }) => {
  return (
    <Card hover className="overflow-hidden border-slate-200">
      <div className="bg-gradient-to-r from-forest-50 to-white px-6 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-full bg-forest-700 text-white font-bold text-xs flex items-center justify-center">
            #{rank}
          </span>
          <h3 className="text-lg font-bold text-slate-900">{crop.cropName}</h3>
          <Badge variant={crop.suitabilityScore >= 80 ? 'forest' : 'yellow'}>
            {crop.suitabilityLevel || 'Recommended'}
          </Badge>
        </div>
        <div className="w-full sm:w-48">
          <SuitabilityIndicator score={crop.suitabilityScore} level={crop.suitabilityLevel} />
        </div>
      </div>

      <CardBody className="space-y-4">
        <p className="text-sm text-slate-700 leading-relaxed">{crop.reason}</p>

        {/* Quick parameters grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <Clock className="w-4 h-4 text-forest-600 flex-shrink-0" />
            <div className="text-xs">
              <span className="text-slate-400 block">Duration</span>
              <span className="font-semibold text-slate-800">{crop.estimatedDurationDays} Days</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <Calendar className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <div className="text-xs">
              <span className="text-slate-400 block">Sowing Window</span>
              <span className="font-semibold text-slate-800">{crop.sowingPeriod}</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
            <Droplets className="w-4 h-4 text-sky-600 flex-shrink-0" />
            <div className="text-xs">
              <span className="text-slate-400 block">Water Need</span>
              <span className="font-semibold text-slate-800">{crop.waterRequirement}</span>
            </div>
          </div>
        </div>

        {/* Compatibility notes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
            <span className="font-bold text-emerald-900 block mb-0.5">🌱 Soil Compatibility</span>
            <span className="text-emerald-800">{crop.soilCompatibility}</span>
          </div>
          <div className="p-3 rounded-lg bg-sky-50/50 border border-sky-100">
            <span className="font-bold text-sky-900 block mb-0.5">☀️ Climate Fit</span>
            <span className="text-sky-800">{crop.climateCompatibility}</span>
          </div>
        </div>

        {/* Risks & Next Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {crop.risks && crop.risks.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-amber-900 flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                Identified Cultivation Risks
              </h4>
              <ul className="space-y-1">
                {crop.risks.map((risk, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {crop.nextSteps && crop.nextSteps.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-forest-900 flex items-center gap-1.5 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-forest-600" />
                Recommended Next Steps
              </h4>
              <ul className="space-y-1">
                {crop.nextSteps.map((step, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                    <ArrowRight className="w-3 h-3 text-forest-600 flex-shrink-0 mt-0.5" />
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};

