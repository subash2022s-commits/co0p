-- ==============================================================================
-- AGRO-AI CROP ADVISORY ASSISTANT - SUPABASE DATABASE MIGRATION
-- Migration: 001_initial_schema.sql
-- Description: Complete production schema with RLS, triggers, indexes, and storage
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. PROFILES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    country TEXT DEFAULT 'India',
    state TEXT,
    district TEXT,
    village TEXT,
    preferred_language TEXT DEFAULT 'en',
    farming_experience INTEGER DEFAULT 0 CHECK (farming_experience >= 0),
    land_area NUMERIC(12,3) CHECK (land_area >= 0),
    land_unit TEXT DEFAULT 'acre' CHECK (land_unit IN ('acre', 'hectare', 'sqm')),
    farming_type TEXT,
    irrigation_available BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 2. FARMS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.farms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_name TEXT NOT NULL,
    location TEXT,
    state TEXT,
    district TEXT,
    soil_type TEXT,
    soil_ph NUMERIC(4,2) CHECK (soil_ph >= 0 AND soil_ph <= 14),
    land_area NUMERIC(12,3) NOT NULL CHECK (land_area > 0),
    land_unit TEXT DEFAULT 'acre' CHECK (land_unit IN ('acre', 'hectare', 'sqm')),
    irrigation_method TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 3. CROP RECOMMENDATIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.crop_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    input_data JSONB NOT NULL,
    recommendations JSONB NOT NULL,
    advisory_language TEXT DEFAULT 'en',
    model_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. SOIL REPORTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.soil_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    soil_data JSONB NOT NULL,
    analysis JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. FERTILIZER ADVISORIES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.fertilizer_advisories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    crop_name TEXT NOT NULL,
    input_data JSONB NOT NULL,
    advisory JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 6. IRRIGATION ADVISORIES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.irrigation_advisories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    crop_name TEXT NOT NULL,
    input_data JSONB NOT NULL,
    advisory JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 7. DISEASE REPORTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.disease_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    crop_name TEXT NOT NULL,
    symptoms TEXT NOT NULL,
    image_path TEXT,
    analysis JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 8. CULTIVATION CALENDARS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.cultivation_calendars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_id UUID REFERENCES public.farms(id) ON DELETE SET NULL,
    crop_name TEXT NOT NULL,
    start_date DATE DEFAULT CURRENT_DATE,
    activities JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 9. CHAT CONVERSATIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.chat_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'New Conversation',
    language TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 10. CHAT MESSAGES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.chat_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 11. AUTOMATIC UPDATED_AT TRIGGER FUNCTION
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach updated_at triggers
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_farms_updated_at ON public.farms;
CREATE TRIGGER set_farms_updated_at
    BEFORE UPDATE ON public.farms
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_cultivation_calendars_updated_at ON public.cultivation_calendars;
CREATE TRIGGER set_cultivation_calendars_updated_at
    BEFORE UPDATE ON public.cultivation_calendars
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_chat_conversations_updated_at ON public.chat_conversations;
CREATE TRIGGER set_chat_conversations_updated_at
    BEFORE UPDATE ON public.chat_conversations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Auto-create profile on signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, preferred_language)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Farmer'),
        COALESCE(NEW.raw_user_meta_data->>'preferred_language', 'en')
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 12. PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_farms_user_id ON public.farms(user_id);
CREATE INDEX IF NOT EXISTS idx_crop_recommendations_user_id ON public.crop_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_crop_recommendations_created_at ON public.crop_recommendations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_soil_reports_user_id ON public.soil_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_soil_reports_created_at ON public.soil_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fertilizer_advisories_user_id ON public.fertilizer_advisories(user_id);
CREATE INDEX IF NOT EXISTS idx_fertilizer_advisories_created_at ON public.fertilizer_advisories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_irrigation_advisories_user_id ON public.irrigation_advisories(user_id);
CREATE INDEX IF NOT EXISTS idx_irrigation_advisories_created_at ON public.irrigation_advisories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_disease_reports_user_id ON public.disease_reports(user_id);
CREATE INDEX IF NOT EXISTS idx_disease_reports_created_at ON public.disease_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_cultivation_calendars_user_id ON public.cultivation_calendars(user_id);
CREATE INDEX IF NOT EXISTS idx_cultivation_calendars_created_at ON public.cultivation_calendars(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_user_id ON public.chat_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_created_at ON public.chat_conversations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON public.chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);

-- ==============================================================================
-- 13. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soil_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fertilizer_advisories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.irrigation_advisories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cultivation_calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- FARMS POLICIES
CREATE POLICY "Users can view own farms"
    ON public.farms FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own farms"
    ON public.farms FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own farms"
    ON public.farms FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own farms"
    ON public.farms FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- CROP RECOMMENDATIONS POLICIES
CREATE POLICY "Users can view own crop recommendations"
    ON public.crop_recommendations FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own crop recommendations"
    ON public.crop_recommendations FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own crop recommendations"
    ON public.crop_recommendations FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- SOIL REPORTS POLICIES
CREATE POLICY "Users can view own soil reports"
    ON public.soil_reports FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own soil reports"
    ON public.soil_reports FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own soil reports"
    ON public.soil_reports FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- FERTILIZER ADVISORIES POLICIES
CREATE POLICY "Users can view own fertilizer advisories"
    ON public.fertilizer_advisories FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own fertilizer advisories"
    ON public.fertilizer_advisories FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own fertilizer advisories"
    ON public.fertilizer_advisories FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- IRRIGATION ADVISORIES POLICIES
CREATE POLICY "Users can view own irrigation advisories"
    ON public.irrigation_advisories FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own irrigation advisories"
    ON public.irrigation_advisories FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- DISEASE REPORTS POLICIES
CREATE POLICY "Users can view own disease reports"
    ON public.disease_reports FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own disease reports"
    ON public.disease_reports FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own disease reports"
    ON public.disease_reports FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- CULTIVATION CALENDARS POLICIES
CREATE POLICY "Users can view own cultivation calendars"
    ON public.cultivation_calendars FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cultivation calendars"
    ON public.cultivation_calendars FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cultivation calendars"
    ON public.cultivation_calendars FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own cultivation calendars"
    ON public.cultivation_calendars FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- CHAT CONVERSATIONS POLICIES
CREATE POLICY "Users can view own chat conversations"
    ON public.chat_conversations FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat conversations"
    ON public.chat_conversations FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own chat conversations"
    ON public.chat_conversations FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own chat conversations"
    ON public.chat_conversations FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- CHAT MESSAGES POLICIES
CREATE POLICY "Users can view messages from own conversations"
    ON public.chat_messages FOR SELECT
    TO authenticated
    USING (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.chat_conversations c
            WHERE c.id = chat_messages.conversation_id AND c.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert messages into own conversations"
    ON public.chat_messages FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = user_id AND
        EXISTS (
            SELECT 1 FROM public.chat_conversations c
            WHERE c.id = conversation_id AND c.user_id = auth.uid()
        )
    );

-- ==============================================================================
-- 14. STORAGE BUCKET CONFIGURATION FOR CROP IMAGES
-- ==============================================================================
-- Insert private storage bucket if storage schema exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.schemata WHERE schema_name = 'storage') THEN
        INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
        VALUES (
            'crop-images',
            'crop-images',
            FALSE,
            5242880, -- 5 MB limit
            ARRAY['image/jpeg', 'image/png', 'image/webp']
        )
        ON CONFLICT (id) DO UPDATE SET
            public = FALSE,
            file_size_limit = 5242880,
            allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

        -- Storage policies for authenticated user folder isolation
        DROP POLICY IF EXISTS "Users can upload their own crop images" ON storage.objects;
        CREATE POLICY "Users can upload their own crop images"
            ON storage.objects FOR INSERT
            TO authenticated
            WITH CHECK (
                bucket_id = 'crop-images' AND
                (storage.foldername(name))[1] = auth.uid()::text
            );

        DROP POLICY IF EXISTS "Users can view their own crop images" ON storage.objects;
        CREATE POLICY "Users can view their own crop images"
            ON storage.objects FOR SELECT
            TO authenticated
            USING (
                bucket_id = 'crop-images' AND
                (storage.foldername(name))[1] = auth.uid()::text
            );

        DROP POLICY IF EXISTS "Users can delete their own crop images" ON storage.objects;
        CREATE POLICY "Users can delete their own crop images"
            ON storage.objects FOR DELETE
            TO authenticated
            USING (
                bucket_id = 'crop-images' AND
                (storage.foldername(name))[1] = auth.uid()::text
            );
    END IF;
END $$;

