import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { LanguageProvider } from './context/LanguageContext.jsx';
import { ProtectedRoute } from './components/layout/ProtectedRoute.jsx';
import { DashboardLayout } from './components/layout/DashboardLayout.jsx';

// Pages
import { LandingPage } from './pages/LandingPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { CropRecommendationPage } from './pages/CropRecommendationPage.jsx';
import { SoilAnalysisPage } from './pages/SoilAnalysisPage.jsx';
import { FertilizerPage } from './pages/FertilizerPage.jsx';
import { IrrigationPage } from './pages/IrrigationPage.jsx';
import { DiseaseDetectionPage } from './pages/DiseaseDetectionPage.jsx';
import { CalendarPage } from './pages/CalendarPage.jsx';
import { AssistantPage } from './pages/AssistantPage.jsx';
import { HistoryPage } from './pages/HistoryPage.jsx';
import { AdvisoryDetailsPage } from './pages/AdvisoryDetailsPage.jsx';
import { SettingsPage } from './pages/SettingsPage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';

export function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes wrapped in DashboardLayout */}
            <Route
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/crop-recommendation" element={<CropRecommendationPage />} />
              <Route path="/soil-analysis" element={<SoilAnalysisPage />} />
              <Route path="/fertilizer-advisory" element={<FertilizerPage />} />
              <Route path="/irrigation-advisory" element={<IrrigationPage />} />
              <Route path="/disease-detection" element={<DiseaseDetectionPage />} />
              <Route path="/cultivation-calendar" element={<CalendarPage />} />
              <Route path="/ai-assistant" element={<AssistantPage />} />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/history/:id" element={<AdvisoryDetailsPage />} />
              <Route path="/settings" element={<SettingsPage />} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;

