-- Database Schema for AI Facebook & Instagram Content Automation Platform
-- Compatible with Supabase PostgreSQL

-- 1. Users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'creator', -- 'admin' or 'creator'
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  active BOOLEAN DEFAULT TRUE
);

-- 2. Social Connections
CREATE TABLE IF NOT EXISTS social_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL, -- 'facebook' or 'instagram'
  page_id VARCHAR(255),
  instagram_user_id VARCHAR(255),
  encrypted_access_token TEXT,
  token_expiry TIMESTAMP WITH TIME ZONE,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Content Preferences
CREATE TABLE IF NOT EXISTS content_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  niche VARCHAR(100) NOT NULL,
  tone VARCHAR(100) NOT NULL,
  posting_frequency VARCHAR(100) NOT NULL,
  topics TEXT[] DEFAULT '{}',
  language VARCHAR(50) DEFAULT 'English',
  style VARCHAR(100) DEFAULT 'Modern & Engaging',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Posts
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL, -- 'facebook', 'instagram', or 'both'
  image_url TEXT,
  caption TEXT NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'scheduled', -- 'draft', 'generating', 'scheduled', 'published', 'failed'
  meta_post_id VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  published_at TIMESTAMP WITH TIME ZONE,
  scheduled_at TIMESTAMP WITH TIME ZONE,
  failure_reason TEXT
);

-- 5. Comment Automations
CREATE TABLE IF NOT EXISTS comment_automations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  keywords TEXT[] NOT NULL,
  dm_message TEXT NOT NULL,
  dm_link TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Automation Logs
CREATE TABLE IF NOT EXISTS automation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_id UUID REFERENCES comment_automations(id) ON DELETE CASCADE,
  commenter_id VARCHAR(255) NOT NULL,
  commenter_handle VARCHAR(255),
  comment_text TEXT NOT NULL,
  comment_id VARCHAR(255) NOT NULL UNIQUE,
  dm_sent BOOLEAN DEFAULT TRUE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. API Providers
CREATE TABLE IF NOT EXISTS api_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'text' or 'image'
  encrypted_api_key TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'active', -- 'active', 'degraded', 'error', 'exhausted'
  daily_usage INT DEFAULT 0,
  quota_limit INT DEFAULT 10000,
  priority INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. API Usage Logs
CREATE TABLE IF NOT EXISTS api_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES api_providers(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT
);
