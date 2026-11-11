# 🌾 AgroAI: AI-Powered Agriculture Crop Advisory Assistant

> **Smart Farming Starts with Smarter Decisions.**  
> A complete, production-ready agricultural intelligence platform engineered to assist farmers across India with personalized crop suitability recommendations, soil health diagnosis, balanced fertilizer scheduling, water-efficient irrigation timing, crop pathology, and cultivation timelines.

---

## 🌟 Key Features

### 1. 🌾 Crop Recommendation Engine
- Recommends crops based on geographical district, soil texture, N-P-K levels, pH, agricultural season (Kharif, Rabi, Zaid, Perennial), and irrigation status.
- Evaluates suitability scores (0-100), suitability classifications, water requirements, estimated growth durations, regional sowing periods, and cultivation risks.

### 2. 🧪 Soil Health & Fertility Analysis
- Interprets laboratory test results (pH, Nitrogen, Phosphorus, Potassium, Organic Carbon, Electrical Conductivity, and Micronutrients).
- Identifies acute nutrient deficiencies and excesses, with tailored recommendations for organic amendments (FYM, compost, green manuring, gypsum/lime).

### 3. 🧪 Balanced Fertilizer & Nutrition Planning
- Stage-by-stage crop nutrition guidance combining organic base manures, biofertilizers, and calibrated N-P-K dosages (e.g. kg/acre).
- Enforces strict chemical handling safety and prevents toxic combinations.

### 4. 💧 Smart Irrigation Scheduling
- Custom irrigation timings based on crop physiological growth stage, soil type, and water availability (abundant, moderate, scarce).
- Identifies drought-stress indicators vs. waterlogging hazards, with water-saving techniques (drip scheduling, organic mulching).

### 5. 🐛 Crop Disease & Pest Diagnosis
- Diagnoses crop symptoms by affected plant part (leaves, stem, root, fruit, flower) and observable damage.
- Supports optional leaf/plant photo upload with binary file signature validation (magic bytes).
- Delivers Integrated Pest Management (IPM), cultural sanitation, biological controls, and local Krishi Vigyan Kendra (KVK) consultation advisories.

### 6. 📅 Interactive Cultivation Calendar
- Chronological 11-stage crop schedule from summer land preparation to post-harvest storage.
- Interactive activity checklist allowing farmers to mark tasks as completed, with a dynamic progress bar.

### 7. 🤖 Multilingual Agricultural Chatbot
- 24/7 conversational agricultural guidance powered by Google Gemini.
- Supports **English** and **Kannada (ಕನ್ನಡ)** with easy extensibility to Hindi, Telugu, Tamil, and Malayalam.
- Maintains conversation context and provides clickable suggested inquiries.

### 8. 📊 Farmer Dashboard & History
- Real database-derived statistics: total advisories, active cultivation calendars, and profile completion gauge.
- Searchable, filterable advisory history with printable report views and deletion capability.

---

## 🛠️ Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React.js 18 + Vite | Component-based, responsive SPA |
| **Styling** | Tailwind CSS | Mobile-first agricultural design system |
| **Icons** | Lucide React | Clean, accessible agricultural icons |
| **Backend** | Node.js + Express.js | Modular REST API architecture |
| **AI Integration** | Google Gemini (`@google/genai`) | Official Google GenAI SDK with structured JSON schemas |
| **Database** | Supabase PostgreSQL | Relational database with UUIDs, indexes & triggers |
| **Security** | Row Level Security (RLS) | Farmer data isolation per authenticated user ID |
| **File Storage** | Supabase Storage | Private bucket for crop disease photos |
| **Validation** | Zod | Centralized schemas for requests and AI responses |
| **HTTP Security** | Helmet, CORS, Rate Limit | Production-grade API defense |

---

## 📁 Repository Structure

```text
├── client/                     # React.js Frontend
│   ├── public/logo.svg         # AgroAI branding
│   ├── src/
│   │   ├── components/         # Reusable UI, layout & agricultural components
│   │   ├── context/            # AuthContext (Supabase + Demo) & LanguageContext
│   │   ├── pages/              # 15 application pages (Landing, Dashboard, Advisories...)
│   │   ├── services/           # Axios API client & Supabase client
│   │   ├── utils/              # Indian agronomic datasets (States, Crops, Soils)
│   │   ├── App.jsx             # React Router configuration
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
│
├── server/                     # Node.js + Express Backend
│   ├── src/
│   │   ├── config/             # Supabase & Gemini SDK initialization
│   │   ├── controllers/        # Route controllers
│   │   ├── middleware/         # Auth, Zod validation, error handler, Multer upload
│   │   ├── prompts/            # AgroAI system prompt and language instructions
│   │   ├── routes/             # REST endpoints under /api/v1
│   │   ├── schemas/            # Zod validation schemas
│   │   ├── services/           # Gemini AI service & database persistence layer
│   │   ├── app.js              # Express app with Helmet, CORS, rate limiting
│   │   └── server.js           # Server bootstrap
│   ├── test-endpoints.js       # Automated integration test suite
│   ├── .env.example
│   └── package.json
│
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql  # Complete production PostgreSQL migration with RLS
│
├── docs/
│   ├── SETUP.md                # Local setup instructions
│   ├── API_DOCUMENTATION.md    # Complete REST API reference
│   └── DEPLOYMENT.md           # Production deployment guide
│
├── .gitignore
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Install Dependencies

In the root directory, install dependencies for both server and client:

```bash
# Server setup
cd server
npm install

# Client setup
cd ../client
npm install
```

### 2. Configure Environment Variables

**Backend (`server/.env`):**
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173

# Supabase Credentials (optional for demo, required for production)
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Google Gemini API Key (from https://aistudio.google.com/)
GEMINI_API_KEY=your-gemini-api-key
GEMINI_MODEL=gemini-2.5-flash
```

**Frontend (`client/.env`):**
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Run Development Servers

```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

> 💡 **Instant Evaluation Mode:** Even before setting up your Supabase or Gemini keys, you can click **"Explore as Demo Farmer (Instant Access)"** on the login page to immediately test all forms, advisory engines, and dashboards!

---

## 🗄️ Database Setup (Supabase PostgreSQL)

1. Open your Supabase project dashboard at [supabase.com](https://supabase.com).
2. Go to **SQL Editor**.
3. Run the SQL file:
   [`supabase/migrations/001_initial_schema.sql`](supabase/migrations/001_initial_schema.sql).
4. This script automatically provisions:
   - All 10 tables with foreign keys and cascade deletions.
   - `updated_at` triggers and user onboarding functions.
   - B-Tree indexes on `user_id` and query timestamps.
   - Complete Row Level Security (RLS) policies.
   - Private Supabase Storage bucket `crop-images` with folder-level user access policies.

---

## 🧪 Testing

Run the automated integration test suite covering all 10 endpoints:

```bash
cd server
npm test
```

Sample output:
```text
✅ 1. Health Check: PASSED
✅ 2. Profile Update: PASSED
✅ 3. Crop Recommendation: PASSED
✅ 4. Soil Analysis: PASSED
✅ 5. Fertilizer Advisory: PASSED
✅ 6. Irrigation Advisory: PASSED
✅ 7. Disease Analysis: PASSED
✅ 8. Cultivation Calendar: PASSED
✅ 9. Chatbot Conversation & Message: PASSED
✅ 10. Dashboard Summary: PASSED
```

---

## 🛡️ Agricultural Safety & Responsibility

- AgroAI does not fabricate weather data, soil values, or market prices.
- Suitability scores are advisory ranking indicators, not yield guarantees.
- Always consult your local **Krishi Vigyan Kendra (KVK)** or agricultural extension officer before applying chemical interventions.

---

## 📄 License
This project is licensed under the ISC License.

