-- =========================================================
-- AI Facebook & Instagram Content Automation Platform
-- Supabase PostgreSQL Production Schema Migration (PRD Version 2.0)
-- =========================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ---------------------------------------------------------
-- 1. USERS / PROFILES TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'creator' CHECK (role IN ('creator', 'admin')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    TO authenticated
    USING ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING ((select auth.uid()) = id)
    WITH CHECK ((select auth.uid()) = id);

CREATE POLICY "Admins can manage all profiles"
    ON public.profiles FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = (select auth.uid()) AND role = 'admin'
        )
    );

-- ---------------------------------------------------------
-- 2. SOCIAL CONNECTIONS TABLE (Meta Graph & Instagram API)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.social_connections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    platform TEXT NOT NULL CHECK (platform IN ('facebook', 'instagram')),
    page_id TEXT,
    page_name TEXT,
    instagram_user_id TEXT,
    instagram_handle TEXT,
    encrypted_access_token TEXT NOT NULL,
    token_expiry TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'disconnected')),
    connected_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, platform)
);

-- Index for user account queries
CREATE INDEX IF NOT EXISTS idx_social_conn_user_platform ON public.social_connections(user_id, platform);

-- Enable RLS
ALTER TABLE public.social_connections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators can view own connections"
    ON public.social_connections FOR SELECT
    TO authenticated
    USING ((select auth.uid()) = user_id);

CREATE POLICY "Creators can manage own connections"
    ON public.social_connections FOR ALL
    TO authenticated
    USING ((select auth.uid()) = user_id)
    WITH CHECK ((select auth.uid()) = user_id);

-- ---------------------------------------------------------
-- 3. CONTENT PREFERENCES TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.content_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    niche TEXT NOT NULL DEFAULT 'Fitness',
    frequency TEXT NOT NULL DEFAULT 'once_daily',
    tones JSONB NOT NULL DEFAULT '["Professional", "Inspirational"]'::jsonb,
    topics JSONB NOT NULL DEFAULT '["Health", "Nutrition", "Workout"]'::jsonb,
    language TEXT NOT NULL DEFAULT 'English',
    hashtag_mode TEXT NOT NULL DEFAULT 'automatic',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.content_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators manage own preferences"
    ON public.content_preferences FOR ALL
    TO authenticated
    USING ((select auth.uid()) = user_id)
    WITH CHECK ((select auth.uid()) = user_id);

-- ---------------------------------------------------------
-- 4. POSTS TABLE (AI Generated & Scheduled Posts)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    caption TEXT NOT NULL,
    image_url TEXT NOT NULL,
    hashtags JSONB DEFAULT '[]'::jsonb,
    platform TEXT NOT NULL CHECK (platform IN ('facebook', 'instagram', 'both')),
    status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('draft', 'scheduled', 'publishing', 'published', 'failed')),
    scheduled_at TIMESTAMPTZ NOT NULL,
    published_at TIMESTAMPTZ,
    meta_post_id TEXT,
    failure_reason TEXT,
    ai_provider_used TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for post queues and scheduled queries
CREATE INDEX IF NOT EXISTS idx_posts_user_status ON public.posts(user_id, status);
CREATE INDEX IF NOT EXISTS idx_posts_scheduled_queue ON public.posts(status, scheduled_at) WHERE status = 'scheduled';

-- Enable RLS
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators manage own posts"
    ON public.posts FOR ALL
    TO authenticated
    USING ((select auth.uid()) = user_id)
    WITH CHECK ((select auth.uid()) = user_id);

-- ---------------------------------------------------------
-- 5. AUTOMATIONS TABLE (Comment-to-DM Rules)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.automations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    post_id UUID REFERENCES public.posts(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    trigger_keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
    dm_message TEXT NOT NULL,
    dm_link TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
    triggered_count INT NOT NULL DEFAULT 0,
    dms_sent_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_automations_user ON public.automations(user_id, status);

-- Enable RLS
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators manage own automations"
    ON public.automations FOR ALL
    TO authenticated
    USING ((select auth.uid()) = user_id)
    WITH CHECK ((select auth.uid()) = user_id);

-- ---------------------------------------------------------
-- 6. AUTOMATION ACTIVITY LOGS TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.automation_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    automation_id UUID NOT NULL REFERENCES public.automations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    commenter_handle TEXT NOT NULL,
    comment_text TEXT NOT NULL,
    matched_keyword TEXT,
    dm_status TEXT NOT NULL CHECK (dm_status IN ('sent', 'failed', 'not_triggered')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_auto_logs_user ON public.automation_activity_logs(user_id, created_at DESC);

-- Enable RLS
ALTER TABLE public.automation_activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Creators view own activity logs"
    ON public.automation_activity_logs FOR SELECT
    TO authenticated
    USING ((select auth.uid()) = user_id);

-- ---------------------------------------------------------
-- 7. AI PROVIDERS TABLE (Admin Managed Pool)
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('text', 'image')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'error', 'disabled')),
    quota_usage INT NOT NULL DEFAULT 0,
    priority INT NOT NULL DEFAULT 1,
    encrypted_api_key TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.ai_providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins manage AI providers"
    ON public.ai_providers FOR ALL
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = (select auth.uid()) AND role = 'admin'
        )
    );

-- ---------------------------------------------------------
-- 8. SYSTEM ACTIVITY LOGS TABLE
-- ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.system_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    event TEXT NOT NULL,
    platform TEXT NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('success', 'error', 'warning', 'info')),
    details TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_system_logs_created ON public.system_logs(created_at DESC);

-- Enable RLS
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins view system logs"
    ON public.system_logs FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = (select auth.uid()) AND role = 'admin'
        )
    );
