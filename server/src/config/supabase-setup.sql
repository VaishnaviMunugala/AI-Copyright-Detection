-- AI Copyright Detection System - Supabase Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content entries table
CREATE TABLE IF NOT EXISTS content_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  raw_content TEXT NOT NULL,
  fingerprint TEXT NOT NULL,
  embedding_vector JSONB,
  certificate_id TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Detections table
CREATE TABLE IF NOT EXISTS detections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  input_content TEXT NOT NULL,
  similarity_score NUMERIC(5,2) NOT NULL,
  match_level TEXT NOT NULL CHECK (match_level IN ('Original', 'Partial Match', 'High Match')),
  matched_sources JSONB DEFAULT '[]'::jsonb,
  explanation TEXT,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Thresholds table
CREATE TABLE IF NOT EXISTS thresholds (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  threshold_type TEXT UNIQUE NOT NULL CHECK (threshold_type IN ('original', 'partial', 'high')),
  min_score NUMERIC(5,2) NOT NULL,
  max_score NUMERIC(5,2) NOT NULL,
  semantic_weight NUMERIC(3,2) DEFAULT 0.4,
  structural_weight NUMERIC(3,2) DEFAULT 0.3,
  hash_weight NUMERIC(3,2) DEFAULT 0.3,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_content_entries_owner ON content_entries(owner_id);
CREATE INDEX IF NOT EXISTS idx_content_entries_category ON content_entries(category_id);
CREATE INDEX IF NOT EXISTS idx_content_entries_fingerprint ON content_entries(fingerprint);
CREATE INDEX IF NOT EXISTS idx_detections_user ON detections(user_id);
CREATE INDEX IF NOT EXISTS idx_detections_created ON detections(created_at DESC);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_entries_updated_at BEFORE UPDATE ON content_entries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_thresholds_updated_at BEFORE UPDATE ON thresholds
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE detections ENABLE ROW LEVEL SECURITY;
ALTER TABLE thresholds ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Categories policies (public read, admin write)
CREATE POLICY "Anyone can view categories" ON categories
  FOR SELECT USING (true);

-- Content entries policies
CREATE POLICY "Users can view their own content" ON content_entries
  FOR SELECT USING (auth.uid()::text = owner_id::text);

CREATE POLICY "Users can insert their own content" ON content_entries
  FOR INSERT WITH CHECK (auth.uid()::text = owner_id::text);

CREATE POLICY "Users can update their own content" ON content_entries
  FOR UPDATE USING (auth.uid()::text = owner_id::text);

CREATE POLICY "Users can delete their own content" ON content_entries
  FOR DELETE USING (auth.uid()::text = owner_id::text);

-- Detections policies
CREATE POLICY "Users can view their own detections" ON detections
  FOR SELECT USING (auth.uid()::text = user_id::text OR user_id IS NULL);

CREATE POLICY "Anyone can insert detections" ON detections
  FOR INSERT WITH CHECK (true);

-- Thresholds policies (public read)
CREATE POLICY "Anyone can view thresholds" ON thresholds
  FOR SELECT USING (true);
