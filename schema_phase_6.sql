-- StudyGenie Phase 6: Core Features & Vector DB Schema

-- 1. Enable pgvector Extension (Required for AI Embeddings)
-- Note: This must be run as superuser (usually default on Supabase)
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Documents Table (Tracks uploaded files)
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'documents' AND policyname = 'Users can view own documents') THEN
        CREATE POLICY "Users can view own documents" ON public.documents FOR SELECT USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'documents' AND policyname = 'Users can insert own documents') THEN
        CREATE POLICY "Users can insert own documents" ON public.documents FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'documents' AND policyname = 'Users can delete own documents') THEN
        CREATE POLICY "Users can delete own documents" ON public.documents FOR DELETE USING (auth.uid() = user_id);
    END IF;
END $$;


-- 3. Document Embeddings Table (Vector Database)
CREATE TABLE IF NOT EXISTS public.document_embeddings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
    content TEXT NOT NULL,
    embedding vector(1536), -- Dimension for OpenAI text-embedding-3-small
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.document_embeddings ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'document_embeddings' AND policyname = 'Users can view own embeddings') THEN
        CREATE POLICY "Users can view own embeddings" ON public.document_embeddings FOR SELECT 
        USING (document_id IN (SELECT id FROM public.documents WHERE user_id = auth.uid()));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'document_embeddings' AND policyname = 'Users can insert own embeddings') THEN
        CREATE POLICY "Users can insert own embeddings" ON public.document_embeddings FOR INSERT 
        WITH CHECK (document_id IN (SELECT id FROM public.documents WHERE user_id = auth.uid()));
    END IF;
END $$;

-- RPC Function for Similarity Search
CREATE OR REPLACE FUNCTION match_document_embeddings (
  query_embedding vector(1536),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id UUID,
  document_id UUID,
  content TEXT,
  similarity float
)
LANGUAGE sql STABLE
AS $$
  SELECT
    document_embeddings.id,
    document_embeddings.document_id,
    document_embeddings.content,
    1 - (document_embeddings.embedding <=> query_embedding) as similarity
  FROM document_embeddings
  WHERE 1 - (document_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY document_embeddings.embedding <=> query_embedding
  LIMIT match_count;
$$;


-- 4. Quizzes Table (Saves generated quizzes)
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    topic TEXT NOT NULL,
    questions JSONB NOT NULL, -- Full quiz payload JSON
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quizzes' AND policyname = 'Users can view own quizzes') THEN
        CREATE POLICY "Users can view own quizzes" ON public.quizzes FOR SELECT USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quizzes' AND policyname = 'Users can insert own quizzes') THEN
        CREATE POLICY "Users can insert own quizzes" ON public.quizzes FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;


-- 5. Quiz Attempts Table (Tracks performance history)
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    score INTEGER NOT NULL,
    max_score INTEGER NOT NULL,
    duration_seconds INTEGER,
    attempted_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quiz_attempts' AND policyname = 'Users can view own attempts') THEN
        CREATE POLICY "Users can view own attempts" ON public.quiz_attempts FOR SELECT USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'quiz_attempts' AND policyname = 'Users can insert own attempts') THEN
        CREATE POLICY "Users can insert own attempts" ON public.quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;


-- 6. Study Sessions Table (Analytics Tracking)
CREATE TABLE IF NOT EXISTS public.study_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    topic TEXT NOT NULL,
    duration_seconds INTEGER NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ended_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'study_sessions' AND policyname = 'Users can view own sessions') THEN
        CREATE POLICY "Users can view own sessions" ON public.study_sessions FOR SELECT USING (auth.uid() = user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'study_sessions' AND policyname = 'Users can insert own sessions') THEN
        CREATE POLICY "Users can insert own sessions" ON public.study_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;
