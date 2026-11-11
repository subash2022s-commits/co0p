import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach Bearer token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('agroai_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unified response handling
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'An error occurred',
      code: error.response?.data?.error?.code || 'NETWORK_ERROR',
      details: error.response?.data?.error?.details || [],
      status: error.response?.status,
    };
    return Promise.reject(customError);
  }
);

export const apiService = {
  // Health
  checkHealth: () => api.get('/health'),

  // Profile & Farms
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
  getFarms: () => api.get('/farms'),
  createFarm: (data) => api.post('/farms', data),
  deleteFarm: (id) => api.delete(`/farms/${id}`),

  // Crop Recommendation
  recommendCrops: (data) => api.post('/crop/recommend', data),
  getCropRecommendations: () => api.get('/crop/recommendations'),
  getCropRecommendationById: (id) => api.get(`/crop/recommendations/${id}`),
  deleteCropRecommendation: (id) => api.delete(`/crop/recommendations/${id}`),

  // Soil Analysis
  analyzeSoil: (data) => api.post('/soil/analyze', data),
  getSoilReports: () => api.get('/soil/reports'),
  getSoilReportById: (id) => api.get(`/soil/reports/${id}`),
  deleteSoilReport: (id) => api.delete(`/soil/reports/${id}`),

  // Fertilizer
  recommendFertilizer: (data) => api.post('/fertilizer/recommend', data),
  getFertilizerAdvisories: () => api.get('/fertilizer/advisories'),
  getFertilizerAdvisoryById: (id) => api.get(`/fertilizer/advisories/${id}`),
  deleteFertilizerAdvisory: (id) => api.delete(`/fertilizer/advisories/${id}`),

  // Irrigation
  recommendIrrigation: (data) => api.post('/irrigation/recommend', data),
  getIrrigationAdvisories: () => api.get('/irrigation/advisories'),
  getIrrigationAdvisoryById: (id) => api.get(`/irrigation/advisories/${id}`),
  deleteIrrigationAdvisory: (id) => api.delete(`/irrigation/advisories/${id}`),

  // Disease Detection
  analyzeDisease: (formData) =>
    api.post('/disease/analyze', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getDiseaseReports: () => api.get('/disease/reports'),
  getDiseaseReportById: (id) => api.get(`/disease/reports/${id}`),
  deleteDiseaseReport: (id) => api.delete(`/disease/reports/${id}`),

  // Cultivation Calendar
  generateCalendar: (data) => api.post('/calendar/generate', data),
  getCalendars: () => api.get('/calendar'),
  getCalendarById: (id) => api.get(`/calendar/${id}`),
  updateCalendarActivities: (id, activities) => api.put(`/calendar/${id}`, { activities }),
  deleteCalendar: (id) => api.delete(`/calendar/${id}`),

  // Chat
  listConversations: () => api.get('/chat/conversations'),
  createConversation: (data) => api.post('/chat/conversations', data),
  getConversationMessages: (id) => api.get(`/chat/conversations/${id}`),
  sendMessage: (id, message, language) => api.post(`/chat/conversations/${id}/messages`, { message, language }),
  deleteConversation: (id) => api.delete(`/chat/conversations/${id}`),

  // Dashboard
  getDashboardSummary: () => api.get('/dashboard/summary'),
  getRecentActivities: () => api.get('/dashboard/recent-activities'),
  getUpcomingTasks: () => api.get('/dashboard/upcoming-tasks'),
};

