# AgroAI Crop Advisory Assistant - Setup & Installation Guide

This guide walks you through setting up **AgroAI**, an intelligent, responsible agricultural advisory platform built with **React.js**, **Node.js/Express**, **Supabase PostgreSQL & Authentication (with RLS)**, and **Google Gemini AI** (via `@google/genai`).

---

## 1. System Requirements

- **Node.js**: v20+ or v22 LTS (recommended: v22.14.0+)
- **npm**: v10+
- **Supabase Account**: (Free tier at [supabase.com](https://supabase.com))
- **Google Gemini API Key**: (Free tier at [Google AI Studio](https://aistudio.google.com/))

---

## 2. Quick Start (Demo Mode)

AgroAI is designed with **zero-friction local evaluation**. If you haven't set up Supabase or Gemini yet, the platform immediately functions in safe Demo Mode:

```bash
# 1. Start the Backend Server (Terminal 1)
cd server
npm install
npm run dev

# 2. Start the Frontend Client (Terminal 2)
cd client
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. You can click **"Explore as Demo Farmer (Instant Access)"** on the login page to evaluate all 15 advisory features, live forms, and interactive cultivation calendars immediately!

---

## 3. Connecting Production Supabase Database & Auth

### Step 3.1: Create a Supabase Project
1. Log in to [Supabase](https://supabase.com) and click **New Project**.
2. Select your closest AWS/GCP region (e.g., `ap-south-1` for India).

### Step 3.2: Run Database Migration
1. In your Supabase dashboard, navigate to **SQL Editor**.
2. Open the file `supabase/migrations/001_initial_schema.sql` from this repository.
3. Paste the entire SQL content into the SQL Editor and click **Run**.
4. This will create:
   - All 10 application tables (`profiles`, `farms`, `crop_recommendations`, `soil_reports`, `fertilizer_advisories`, `irrigation_advisories`, `disease_reports`, `cultivation_calendars`, `chat_conversations`, `chat_messages`).
   - Automated `updated_at` triggers and user profile creation hooks.
   - All performance indexes.
   - Strict Row Level Security (RLS) policies guaranteeing user isolation.
   - Private Supabase Storage bucket `crop-images` with user folder policies.

### Step 3.3: Configure Supabase Environment Variables

In `server/.env`:
```env
SUPABASE_URL=https://<your-project-id>.supabase.co
SUPABASE_ANON_KEY=<your-anon-public-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-secret-key>
```

In `client/.env`:
```env
VITE_SUPABASE_URL=https://<your-project-id>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-public-key>
```

---

## 4. Connecting Google Gemini AI

1. Obtain an API key from [Google AI Studio](https://aistudio.google.com/).
2. In `server/.env`, set:
```env
GEMINI_API_KEY=AIzaSy...your-real-key
GEMINI_MODEL=gemini-2.5-flash
```

*Note: The Gemini API key is strictly server-side and never exposed to the React frontend.*

---

## 5. Verification & Health Checks

Run the automated integration test suite:

```bash
cd server
npm test
```

Expected output:
```text
Test server running on port 5055
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

Results: 10 of 10 tests passed.
```

