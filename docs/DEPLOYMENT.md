# AgroAI - Production Deployment Guide

This guide details how to deploy the **AgroAI Crop Advisory Assistant** to production cloud platforms.

---

## 1. Architecture Overview

```text
[ Farmer's Browser / Mobile ]
           │
           ▼
[ Vercel / Netlify Frontend ]  (React.js + Tailwind CSS)
           │
    HTTPS API Calls (Bearer Token)
           │
           ▼
[ Render / Railway / Cloud Run Backend ]  (Node.js + Express.js)
     │                     │
     │ REST API            │ Gemini API
     ▼                     ▼
[ Supabase PostgreSQL ]   [ Google Gemini AI ]
(RLS & Auth & Storage)     (@google/genai)
```

---

## 2. Frontend Deployment (Vercel)

1. Connect your repository to [Vercel](https://vercel.com).
2. Configure project settings:
   - **Framework Preset**: Vite
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add Environment Variables:
   - `VITE_API_BASE_URL`: `https://your-backend-service.onrender.com/api/v1`
   - `VITE_SUPABASE_URL`: `https://<your-project-id>.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `<your-supabase-anon-key>`
4. Deploy.

---

## 3. Backend Deployment (Render / Cloud Run / Railway)

### Using Render:
1. Create a **New Web Service** linked to your repository.
2. Configure settings:
   - **Root Directory**: `server`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. Configure Environment Variables in Render Dashboard:
   - `NODE_ENV`: `production`
   - `PORT`: `10000`
   - `CLIENT_URL`: `https://your-frontend.vercel.app`
   - `SUPABASE_URL`: `https://<your-project-id>.supabase.co`
   - `SUPABASE_ANON_KEY`: `<your-supabase-anon-key>`
   - `SUPABASE_SERVICE_ROLE_KEY`: `<your-supabase-service-role-key>`
   - `GEMINI_API_KEY`: `<your-google-ai-studio-gemini-key>`
   - `GEMINI_MODEL`: `gemini-2.5-flash`
4. Deploy the service.

---

## 4. Production Database Configuration (Supabase)

1. Run `supabase/migrations/001_initial_schema.sql` in the Supabase SQL editor.
2. Confirm RLS is enabled on all 10 tables:
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
   ```
   *All tables must show `rowsecurity = true`.*
3. Verify the private storage bucket `crop-images` is active.
4. Set allowed Redirect URLs in Supabase Authentication -> URL Configuration to match your production Vercel domain (`https://your-frontend.vercel.app/**`).

---

## 5. Security Checklist Before Going Live

- [ ] Helmet headers active on Express backend.
- [ ] CORS allowlist strictly set to production frontend domain.
- [ ] Gemini API key stored exclusively on server; never present in frontend bundles.
- [ ] Supabase Service Role key restricted strictly to backend administrative operations.
- [ ] Image uploads enforce 5MB size limit, allowed MIME types, and binary file signatures.
- [ ] Rate limiting active on all `/api/` routes (200 requests per 15 min window).
- [ ] HTTPS enforced across client and server.

