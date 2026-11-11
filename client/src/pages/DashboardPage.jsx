import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { apiService } from '../services/api.js';
import { Card, CardHeader, CardBody } from '../components/common/Card.jsx';
import { Button } from '../components/common/Button.jsx';
import { Badge } from '../components/common/Badge.jsx';
import { LoadingSpinner } from '../components/common/LoadingSpinner.jsx';
import {
  Sprout,
  Layers,
  FlaskConical,
  Droplets,
  Bug,
  CalendarCheck,
  BotMessageSquare,
  ArrowRight,
  Sparkles,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

export const DashboardPage = () => {
  const { user, profile } = useAuth();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [recentActivities, setRecentActivities] = useState([]);
  const [upcomingTasks, setUpcomingTasks] = useState([]);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        const [sumRes, actRes, taskRes] = await Promise.all([
          apiService.getDashboardSummary(),
          apiService.getRecentActivities(),
          apiService.getUpcomingTasks(),
        ]);

        if (sumRes.success) setSummary(sumRes.data);
        if (actRes.success) setRecentActivities(actRes.data || []);
        if (taskRes.success) setUpcomingTasks(taskRes.data || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  const quickActions = [
    {
      title: 'Find Suitable Crops',
      desc: 'Based on your season, soil & water',
      to: '/crop-recommendation',
      icon: Sprout,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      title: 'Analyze Soil Test',
      desc: 'Interpret NPK, pH & health',
      to: '/soil-analysis',
      icon: Layers,
      color: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      title: 'Fertilizer Guidance',
      desc: 'Calculate balanced nutrition',
      to: '/fertilizer-advisory',
      icon: FlaskConical,
      color: 'bg-purple-50 text-purple-800 border-purple-200',
    },
    {
      title: 'Irrigation Timing',
      desc: 'Save water & optimize moisture',
      to: '/irrigation-advisory',
      icon: Droplets,
      color: 'bg-sky-50 text-sky-800 border-sky-200',
    },
    {
      title: 'Diagnose Disease / Pest',
      desc: 'Upload photo & inspect symptoms',
      to: '/disease-detection',
      icon: Bug,
      color: 'bg-rose-50 text-rose-800 border-rose-200',
    },
    {
      title: 'Ask Agricultural AI',
      desc: '24/7 bilingual chat assistant',
      to: '/ai-assistant',
      icon: BotMessageSquare,
      color: 'bg-forest-50 text-forest-800 border-forest-200',
    },
  ];

  if (loading) {
    return <LoadingSpinner agricultural message="Fetching your farm records and agricultural intelligence..." />;
  }

  const farmerName = profile?.full_name || user?.user_metadata?.full_name || 'Farmer';
  const locationText = [profile?.district, profile?.state].filter(Boolean).join(', ') || 'India';

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-forest-900 via-forest-800 to-forest-700 text-white p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-forest-800/80 border border-forest-600/60 text-forest-200 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-sun-400" />
              <span>AgroAI Smart Advisory Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Namaste, {farmerName}!
            </h1>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xl">
              Here is your agricultural health overview for <span className="font-semibold text-white">{locationText}</span>.
            </p>
          </div>

          {/* Profile Completion Indicator */}
          <div className="bg-forest-950/40 backdrop-blur-sm border border-forest-700/50 rounded-xl p-4 min-w-[200px]">
            <div className="flex items-center justify-between text-xs mb-1.5 font-semibold">
              <span className="text-forest-200">Profile Readiness</span>
              <span className="text-sun-400">{summary?.profileCompletion ?? 60}%</span>
            </div>
            <div className="w-full h-2 bg-forest-900 rounded-full overflow-hidden">
              <div
                className="h-full bg-sun-400 rounded-full transition-all duration-500"
                style={{ width: `${summary?.profileCompletion ?? 60}%` }}
              />
            </div>
            <Link to="/profile" className="text-[11px] text-emerald-300 hover:underline mt-2 block font-medium">
              Update Land & Soil Details →
            </Link>
          </div>
        </div>
      </div>

      {/* Real Statistics derived from DB */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card hover className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Advisories</span>
            <div className="p-2 rounded-lg bg-forest-50 text-forest-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{summary?.totalAdvisories ?? 0}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Recorded on farm</span>
        </Card>

        <Card hover className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Crop Recommendations</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <Sprout className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{summary?.cropsCount ?? 0}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Suitability analyses</span>
        </Card>

        <Card hover className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Soil & Nutrition Reports</span>
            <div className="p-2 rounded-lg bg-amber-50 text-amber-700">
              <FlaskConical className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">
            {(summary?.soilReportsCount ?? 0) + (summary?.fertilizerCount ?? 0)}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">Field analyses completed</span>
        </Card>

        <Card hover className="p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Cultivation Calendars</span>
            <div className="p-2 rounded-lg bg-sky-50 text-sky-700">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{summary?.calendarsCount ?? 0}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Active crop schedules</span>
        </Card>
      </div>

      {/* Quick Advisory Actions */}
      <div>
        <h2 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
          <span>Quick Agricultural Advisories</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <Link key={i} to={action.to} className="group">
                <Card hover className="p-4 h-full flex items-start gap-4">
                  <div className={`p-3 rounded-xl border flex-shrink-0 ${action.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-forest-700 transition-colors flex items-center justify-between">
                      <span>{action.title}</span>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-forest-600 transition-transform group-hover:translate-x-0.5" />
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 leading-snug">{action.desc}</p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Upcoming Tasks & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
        {/* Upcoming Field Tasks from Active Calendar */}
        <Card className="flex flex-col">
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-4 h-4 text-forest-700" />
              <h3 className="text-sm font-bold text-slate-900">Upcoming Farming Tasks</h3>
            </div>
            <Link to="/cultivation-calendar" className="text-xs font-semibold text-forest-700 hover:underline">
              View Calendar →
            </Link>
          </CardHeader>
          <CardBody className="p-0 flex-1">
            {upcomingTasks.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                <p>No pending calendar tasks.</p>
                <Link to="/cultivation-calendar" className="mt-2 inline-block font-semibold text-forest-700">
                  + Generate a crop cultivation schedule
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {upcomingTasks.map((task, idx) => (
                  <div key={idx} className="p-4 hover:bg-slate-50/60 transition-colors flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-forest-600 mt-1.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {task.cropName} • {task.stage}
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium flex-shrink-0">
                          Day {task.dayFromStart}-{task.dayToStart}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                        {task.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Recent Advisory History */}
        <Card className="flex flex-col">
          <CardHeader className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-forest-700" />
              <h3 className="text-sm font-bold text-slate-900">Recent Advisories</h3>
            </div>
            <Link to="/history" className="text-xs font-semibold text-forest-700 hover:underline">
              Full History →
            </Link>
          </CardHeader>
          <CardBody className="p-0 flex-1">
            {recentActivities.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500">
                <p>No previous advisories recorded yet.</p>
                <p className="mt-1 text-slate-400">Run a crop recommendation or soil test to begin.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentActivities.slice(0, 5).map((act) => (
                  <Link
                    key={act.id}
                    to={`/history/${act.id}?type=${act.type}`}
                    className="p-4 hover:bg-slate-50/60 transition-colors flex items-center justify-between gap-3 block group"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 group-hover:text-forest-700 transition-colors truncate">
                          {act.title}
                        </span>
                        <Badge variant="slate" size="xs">
                          {act.type}
                        </Badge>
                      </div>
                      <p className="text-xs text-slate-500 truncate mt-0.5">{act.summary}</p>
                    </div>
                    <span className="text-[11px] text-slate-400 flex-shrink-0">
                      {new Date(act.date).toLocaleDateString()}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

