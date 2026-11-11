import app from './src/app.js';
import http from 'http';

const PORT = 5055;
const server = http.createServer(app);

server.listen(PORT, async () => {
  console.log(`Test server running on port ${PORT}`);

  const testAuthHeader = {
    Authorization: 'Bearer demo-token-eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTEyMzQtMTIzNC0xMjM0NTY3ODkwMTIiLCJlbWFpbCI6InRlc3QuZmFybWVyQGFncm9haS5pbiJ9',
    'Content-Type': 'application/json',
  };

  const tests = [
    {
      name: '1. Health Check',
      url: `http://localhost:${PORT}/api/v1/health`,
      method: 'GET',
      headers: {},
      body: null,
    },
    {
      name: '2. Profile Update',
      url: `http://localhost:${PORT}/api/v1/profile`,
      method: 'PUT',
      headers: testAuthHeader,
      body: JSON.stringify({
        full_name: 'Suresh Patil',
        state: 'Karnataka',
        district: 'Mandya',
        land_area: 3.5,
        land_unit: 'acre',
        preferred_language: 'en',
        farming_experience: 8,
        irrigation_available: true,
      }),
    },
    {
      name: '3. Crop Recommendation',
      url: `http://localhost:${PORT}/api/v1/crop/recommend`,
      method: 'POST',
      headers: testAuthHeader,
      body: JSON.stringify({
        state: 'Karnataka',
        district: 'Mandya',
        soilType: 'Red Sandy Loam',
        season: 'Kharif',
        landArea: 3.5,
        landUnit: 'acre',
        irrigationAvailable: true,
        soilPH: 6.8,
        nitrogen: 240,
        phosphorus: 18,
        potassium: 160,
        language: 'en',
      }),
    },
    {
      name: '4. Soil Analysis',
      url: `http://localhost:${PORT}/api/v1/soil/analyze`,
      method: 'POST',
      headers: testAuthHeader,
      body: JSON.stringify({
        soilType: 'Red Sandy Loam',
        soilPH: 6.5,
        nitrogen: 210,
        phosphorus: 12,
        potassium: 140,
        organicCarbon: 0.45,
        electricalConductivity: 0.7,
        language: 'en',
      }),
    },
    {
      name: '5. Fertilizer Advisory',
      url: `http://localhost:${PORT}/api/v1/fertilizer/recommend`,
      method: 'POST',
      headers: testAuthHeader,
      body: JSON.stringify({
        cropName: 'Paddy (Rice)',
        growthStage: 'Active Tillering / Branching',
        landArea: 3.5,
        landUnit: 'acre',
        soilType: 'Red Sandy Loam',
        soilPH: 6.8,
        farmingMethod: 'integrated',
        language: 'en',
      }),
    },
    {
      name: '6. Irrigation Advisory',
      url: `http://localhost:${PORT}/api/v1/irrigation/recommend`,
      method: 'POST',
      headers: testAuthHeader,
      body: JSON.stringify({
        cropName: 'Paddy (Rice)',
        growthStage: 'Active Tillering / Branching',
        soilType: 'Red Sandy Loam',
        landArea: 3.5,
        landUnit: 'acre',
        irrigationMethod: 'Drip Irrigation',
        waterAvailability: 'moderate',
        temperature: 30,
        humidity: 60,
        language: 'en',
      }),
    },
    {
      name: '7. Disease Analysis',
      url: `http://localhost:${PORT}/api/v1/disease/analyze`,
      method: 'POST',
      headers: testAuthHeader,
      body: JSON.stringify({
        cropName: 'Tomato',
        affectedPart: 'leaves',
        symptoms: 'Concentric dark brown target spots on leaves with yellowing',
        duration: '4 days',
        visibleDamage: 'Lower foliage dropping',
        language: 'en',
      }),
    },
    {
      name: '8. Cultivation Calendar',
      url: `http://localhost:${PORT}/api/v1/calendar/generate`,
      method: 'POST',
      headers: testAuthHeader,
      body: JSON.stringify({
        cropName: 'Paddy (Rice)',
        startDate: '2026-06-15',
        soilType: 'Clayey Soil',
        sowingMethod: 'Transplanting',
        language: 'en',
      }),
    },
    {
      name: '9. Chatbot Conversation & Message',
      url: `http://localhost:${PORT}/api/v1/chat/conversations`,
      method: 'POST',
      headers: testAuthHeader,
      body: JSON.stringify({
        title: 'Soil Nutrition Query',
        language: 'en',
      }),
    },
    {
      name: '10. Dashboard Summary',
      url: `http://localhost:${PORT}/api/v1/dashboard/summary`,
      method: 'GET',
      headers: testAuthHeader,
      body: null,
    },
  ];

  let passed = 0;
  for (const t of tests) {
    try {
      const response = await fetch(t.url, {
        method: t.method,
        headers: t.headers,
        body: t.body,
      });
      const data = await response.json();
      if (response.ok && data.success) {
        console.log(`✅ ${t.name}: PASSED`);
        passed++;
      } else {
        console.error(`❌ ${t.name}: FAILED (Status ${response.status})`, data);
      }
    } catch (err) {
      console.error(`❌ ${t.name}: ERROR`, err.message);
    }
  }

  console.log(`\nResults: ${passed} of ${tests.length} tests passed.`);
  server.close(() => process.exit(passed === tests.length ? 0 : 1));
});

