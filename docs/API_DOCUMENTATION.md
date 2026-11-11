# AgroAI Assistant - REST API Documentation

Base URL: `/api/v1`

All protected endpoints require an `Authorization` header:
`Authorization: Bearer <supabase_access_token>`

All responses follow the unified standard:
```json
// Success
{
  "success": true,
  "message": "Advisory generated successfully",
  "data": { ... },
  "error": null
}

// Error
{
  "success": false,
  "message": "Validation failed for request data",
  "data": null,
  "error": {
    "code": "VALIDATION_ERROR",
    "details": ["landArea: Land area must be greater than 0"]
  }
}
```

---

## Endpoints Summary

### 1. System Health
- `GET /health`
  - Public endpoint.
  - Returns server uptime, Supabase connection status, and Gemini model status.

---

### 2. Farmer Profile & Land Holdings
- `GET /profile`
  - Retrieves authenticated farmer's profile, experience, land area, and preferred language.
- `PUT /profile`
  - Updates profile information (validated with Zod `profileUpdateSchema`).
- `GET /farms`
  - Lists all farm plots belonging to the authenticated farmer.
- `POST /farms`
  - Adds a new farm plot with soil type, pH, area, and irrigation method.
- `DELETE /farms/:id`
  - Deletes a user-owned farm plot.

---

### 3. Crop Recommendation Engine
- `POST /crop/recommend`
  - Generates AI-ranked crop recommendations based on location, season, soil type, NPK, pH, and irrigation availability.
  - Returns suitability scores (0-100), suitability classifications, duration, sowing periods, risks, and next steps.
- `GET /crop/recommendations`
  - Retrieves previously saved crop recommendation advisories for the user.
- `GET /crop/recommendations/:id`
  - Retrieves a specific crop recommendation report.
- `DELETE /crop/recommendations/:id`
  - Deletes the recommendation report.

---

### 4. Soil Health Analysis
- `POST /soil/analyze`
  - Evaluates soil pH, N, P, K, organic carbon, and electrical conductivity.
  - Identifies nutrient deficiencies, excesses, naturally suited crops, and organic/mineral soil amendments.
- `GET /soil/reports`
  - Lists historical soil health reports.
- `GET /soil/reports/:id`
  - Retrieves an individual soil report.
- `DELETE /soil/reports/:id`
  - Deletes the soil report.

---

### 5. Fertilizer & Crop Nutrition
- `POST /fertilizer/recommend`
  - Formulates stage-specific fertilizer guidance (basal, vegetative top dressing, flowering).
  - Supplies calibrated dosages (e.g. kg/acre) and handling safety precautions.
- `GET /fertilizer/advisories`
  - Lists past fertilizer advisories.
- `GET /fertilizer/advisories/:id`
  - Retrieves an individual fertilizer advisory.
- `DELETE /fertilizer/advisories/:id`
  - Deletes the fertilizer advisory.

---

### 6. Smart Irrigation Management
- `POST /irrigation/recommend`
  - Computes water requirements, optimal application timing, drip scheduling, and drought stress indicators.
- `GET /irrigation/advisories`
  - Lists irrigation advisories.
- `GET /irrigation/advisories/:id`
  - Retrieves an individual irrigation advisory.
- `DELETE /irrigation/advisories/:id`
  - Deletes the irrigation advisory.

---

### 7. Disease & Pest Diagnosis
- `POST /disease/analyze`
  - Accepts multipart form data with symptom description, affected plant part, duration, and optional crop photo.
  - Validates image magic bytes signature to prevent spoofed uploads.
  - Returns probable disease names, confidence levels, alternative causes, and Integrated Pest Management (IPM) measures.
- `GET /disease/reports`
  - Lists past disease reports.
- `GET /disease/reports/:id`
  - Retrieves an individual disease report.
- `DELETE /disease/reports/:id`
  - Deletes the disease report.

---

### 8. Cultivation Calendar
- `POST /calendar/generate`
  - Creates a chronological 11-stage farming timeline from land preparation to harvest.
- `GET /calendar`
  - Lists active cultivation calendars.
- `GET /calendar/:id`
  - Retrieves calendar details.
- `PUT /calendar/:id`
  - Updates activity completion status.
- `DELETE /calendar/:id`
  - Deletes the calendar.

---

### 9. Agricultural Chatbot
- `GET /chat/conversations`
  - Lists chat conversations.
- `POST /chat/conversations`
  - Initializes a new chat session.
- `GET /chat/conversations/:id`
  - Retrieves message history for the conversation.
- `POST /chat/conversations/:id/messages`
  - Sends user message and receives structured, bilingual Gemini AI responses.
- `DELETE /chat/conversations/:id`
  - Deletes the conversation and all associated messages.

---

### 10. Dashboard Metrics
- `GET /dashboard/summary`
  - Returns real count of advisories, profile completion percentage, and farm count.
- `GET /dashboard/recent-activities`
  - Returns merged stream of recent farmer advisories.
- `GET /dashboard/upcoming-tasks`
  - Returns pending tasks extracted from active cultivation calendars.

