import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar.jsx';
import { Footer } from '../components/layout/Footer.jsx';
import { Button } from '../components/common/Button.jsx';
import { Card, CardBody } from '../components/common/Card.jsx';
import { Badge } from '../components/common/Badge.jsx';
import {
  Sprout,
  Layers,
  FlaskConical,
  Droplets,
  Bug,
  CalendarCheck,
  BotMessageSquare,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Languages,
  Sparkles,
  TrendingUp,
} from 'lucide-react';

export const LandingPage = () => {
  const features = [
    {
      icon: Sprout,
      title: 'Crop Suitability Engine',
      description: 'Receive AI-ranked crop recommendations aligned with your specific district, soil texture, NPK levels, and seasonal rainfall.',
      link: '/crop-recommendation',
      tag: 'India-First',
    },
    {
      icon: Layers,
      title: 'Soil Health Analysis',
      description: 'Interpret soil laboratory reports with instant deficiency diagnosis, organic matter recommendations, and pH balancing.',
      link: '/soil-analysis',
      tag: 'Laboratory Data',
    },
    {
      icon: FlaskConical,
      title: 'Balanced Fertilizer Advisory',
      description: 'Stage-by-stage nutrient planning combining organic manure, biofertilizers, and calibrated N-P-K dosages to cut input costs.',
      link: '/fertilizer-advisory',
      tag: 'Cost Reduction',
    },
    {
      icon: Droplets,
      title: 'Smart Irrigation Scheduling',
      description: 'Conserve water through precision timing, drought-stress indicator tracking, and drip scheduling tailored to crop growth stages.',
      link: '/irrigation-advisory',
      tag: 'Water Efficient',
    },
    {
      icon: Bug,
      title: 'Crop Disease & Pest Diagnosis',
      description: 'Upload crop photos and symptom descriptions for Integrated Pest Management (IPM), cultural controls, and safety precautions.',
      link: '/disease-detection',
      tag: 'IPM Focus',
    },
    {
      icon: CalendarCheck,
      title: 'Step-by-Step Cultivation Calendar',
      description: 'A complete timeline from summer land preparation to post-harvest storage with interactive task tracking for your field.',
      link: '/cultivation-calendar',
      tag: 'Timeline',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Register & Add Farm Details',
      desc: 'Enter your location, land area, soil type, and irrigation facilities.',
    },
    {
      num: '02',
      title: 'Submit Field Information',
      desc: 'Select an advisory module and provide observed parameters or test reports.',
    },
    {
      num: '03',
      title: 'Receive Actionable AI Advice',
      desc: 'Get structured agronomic guidance in your preferred language (English or Kannada).',
    },
    {
      num: '04',
      title: 'Track & Implement Tasks',
      desc: 'Follow the cultivation timeline and review previous reports in your advisory history.',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-forest-950 via-forest-900 to-forest-800 text-white py-20 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#22c55e_1px,transparent_1px)] [background-size:24px_24px]" />
        
        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-800/80 border border-forest-600/50 text-forest-200 text-xs font-semibold mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI-Powered Agricultural Intelligence for Indian Farmers</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight mb-6">
            Smart Farming Starts with <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-green-200 to-sun-400">
              Smarter Decisions.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/90 max-w-3xl mx-auto mb-10 leading-relaxed font-normal">
            Get personalized crop recommendations, soil insights, irrigation guidance, and AI-powered agricultural support for better farming decisions.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-forest-950 font-bold px-8 shadow-lg shadow-amber-500/20">
                Get Started Free
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <a href="#features">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-white/10 text-white hover:bg-white/20 border-white/20">
                Explore Features
              </Button>
            </a>
          </div>

          {/* Value Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 pt-10 border-t border-forest-800/60 max-w-4xl mx-auto">
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-amber-400">100%</span>
              <span className="text-xs text-forest-200 mt-1">Responsible AI</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-emerald-300">English + ಕನ್ನಡ</span>
              <span className="text-xs text-forest-200 mt-1">Multilingual Guidance</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-amber-400">IPM & Organic</span>
              <span className="text-xs text-forest-200 mt-1">Sustainable Practices</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl font-black text-emerald-300">RLS Secured</span>
              <span className="text-xs text-forest-200 mt-1">Private Farmer Data</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Feature Cards */}
      <section id="features" className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <h2 className="text-xs font-bold uppercase tracking-wider text-forest-700 mb-2">
              Comprehensive Advisory Suite
            </h2>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">
              Everything Needed for Modern, Informed Agriculture
            </h3>
            <p className="text-sm text-slate-600 mt-3">
              Designed for small, medium, and large-scale farming communities to eliminate guesswork and maximize yields sustainably.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <Card key={index} hover className="border-slate-200/90 flex flex-col justify-between">
                  <CardBody className="p-7">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl bg-forest-100 text-forest-800 flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </div>
                      <Badge variant="forest">{feat.tag}</Badge>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-2">{feat.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                      {feat.description}
                    </p>
                    <Link
                      to={feat.link}
                      className="inline-flex items-center text-xs font-bold text-forest-700 hover:text-forest-900 gap-1.5"
                    >
                      <span>Try This Advisory</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </CardBody>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-bold uppercase tracking-wider text-forest-700 mb-2">
              Simple 4-Step Process
            </h2>
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">
              How AgroAI Assists Your Farm
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((st, i) => (
              <div key={i} className="flex flex-col items-center md:items-start text-center md:text-left">
                <span className="text-3xl font-black text-forest-200 mb-2 font-mono">{st.num}</span>
                <h4 className="text-base font-bold text-slate-900 mb-2">{st.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Responsible AI Banner */}
      <section className="py-14 bg-emerald-900 text-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-800 text-emerald-300 mb-4">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Our Responsible Agriculture Guarantee</h3>
          <p className="text-sm text-emerald-100/90 leading-relaxed mb-6">
            AgroAI never fabricates weather readings or soil laboratory results. Recommendations are generated from factual input parameters, acknowledge data limitations transparently, and advocate Integrated Pest Management and laboratory soil testing.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-emerald-200 font-semibold">
            <span>✓ No yield guarantees</span>
            <span>✓ No unverified pesticide dosages</span>
            <span>✓ Local KVK consultation guidance</span>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-slate-50 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Ready to Make Smarter Crop Decisions?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mb-8 max-w-xl mx-auto">
            Join forward-thinking farmers, agricultural students, and consultants optimizing crop productivity with AgroAI.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-forest-700 hover:bg-forest-800 text-white font-bold px-8 shadow-md">
              Start Free Agriculture Advisory
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

