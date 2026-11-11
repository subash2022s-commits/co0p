import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useLanguage } from '../context/LanguageContext.jsx';
import { Button } from '../components/common/Button.jsx';
import { Input } from '../components/common/Input.jsx';
import { Select } from '../components/common/Select.jsx';
import { Card, CardBody } from '../components/common/Card.jsx';
import { Sprout, Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react';

export const RegisterPage = () => {
  const { register } = useAuth();
  const { setLanguage: setGlobalLang } = useLanguage();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [preferredLanguage, setPreferredLanguage] = useState('en');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (!agreeTerms) {
      setError('Please agree to the agricultural terms and advisory conditions.');
      return;
    }

    setLoading(true);
    try {
      await register(email, password, fullName, preferredLanguage);
      setGlobalLang(preferredLanguage);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
          <div className="w-12 h-12 rounded-2xl bg-forest-700 flex items-center justify-center text-white shadow-md group-hover:bg-forest-800 transition-colors">
            <Sprout className="w-7 h-7" />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">AgroAI</span>
        </Link>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Farmer Account</h2>
        <p className="mt-1 text-xs text-slate-500">Join AgroAI to receive personalized crop and field intelligence</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="shadow-lg border-slate-200">
          <CardBody className="p-8">
            {error && (
              <div className="mb-6 p-3.5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-xs text-red-800">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Farmer Full Name"
                id="fullName"
                type="text"
                required
                icon={User}
                placeholder="e.g. Ramesh Gowda"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />

              <Input
                label="Email Address"
                id="email"
                type="email"
                required
                icon={Mail}
                placeholder="farmer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Password"
                  id="password"
                  type="password"
                  required
                  icon={Lock}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Input
                  label="Confirm Password"
                  id="confirmPassword"
                  type="password"
                  required
                  icon={Lock}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>

              <Select
                label="Preferred Language for AI Guidance"
                id="preferredLanguage"
                value={preferredLanguage}
                onChange={(e) => setPreferredLanguage(e.target.value)}
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'kn', label: 'ಕನ್ನಡ (Kannada)' },
                  { value: 'hi', label: 'हिन्दी (Hindi)' },
                  { value: 'te', label: 'తెలుగు (Telugu)' },
                  { value: 'ta', label: 'தமிழ் (Tamil)' },
                ]}
              />

              <div className="flex items-start gap-2 pt-2">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="mt-1 rounded text-forest-600 focus:ring-forest-500 border-slate-300"
                />
                <label htmlFor="agreeTerms" className="text-xs text-slate-600 leading-tight">
                  I understand that AI advisories are decision-support recommendations and agree to verify chemical interventions with local agricultural extension officers.
                </label>
              </div>

              <div className="pt-2">
                <Button type="submit" loading={loading} className="w-full">
                  Create Farmer Profile
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center text-xs text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-forest-700 hover:text-forest-900">
                Sign in here
              </Link>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

