-- 1. Create tables
CREATE TABLE departments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  short_code text UNIQUE,
  college_name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  department_id uuid NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  semester smallint NOT NULL CHECK (semester BETWEEN 3 AND 8),
  name text NOT NULL,
  code text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
CREATE INDEX idx_subjects_semester ON subjects(semester);

CREATE TABLE documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  doc_type text NOT NULL CHECK (doc_type IN ('note', 'pyq')),
  unit_number smallint CHECK (
    (doc_type = 'note' AND unit_number BETWEEN 1 AND 5) OR
    (doc_type = 'pyq' AND unit_number IS NULL)
  ),
  title text NOT NULL,
  file_path text NOT NULL,
  file_size_bytes bigint,
  created_at timestamptz DEFAULT now()
);
CREATE INDEX idx_documents_subject ON documents(subject_id);
CREATE INDEX idx_documents_subject_type ON documents(subject_id, doc_type, unit_number);

-- 2. Create Storage Bucket (must insert directly into storage.buckets if using raw SQL, or use UI, but this SQL covers it)
INSERT INTO storage.buckets (id, name, public) VALUES ('pdfs', 'pdfs', true) ON CONFLICT (id) DO NOTHING;

-- 3. Row Level Security (RLS)
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read departments" ON departments FOR SELECT USING (true);
CREATE POLICY "Public read subjects" ON subjects FOR SELECT USING (true);
CREATE POLICY "Public read documents" ON documents FOR SELECT USING (true);

-- Admin write policies (using custom JWT claim 'role' = 'admin')
CREATE POLICY "Admin write subjects" ON subjects 
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin') 
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin write documents" ON documents 
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin') 
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Storage object policies for bucket 'pdfs'
CREATE POLICY "Public read pdfs" ON storage.objects
  FOR SELECT USING (bucket_id = 'pdfs');
CREATE POLICY "Admin write pdfs" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'pdfs' AND auth.jwt() ->> 'role' = 'admin');
CREATE POLICY "Admin delete pdfs" ON storage.objects
  FOR DELETE USING (bucket_id = 'pdfs' AND auth.jwt() ->> 'role' = 'admin');

-- 4. Seed initial department
INSERT INTO departments (name, short_code, college_name) 
VALUES ('Artificial Intelligence and Data Science', 'AIDS', 'BMS College of Engineering')
ON CONFLICT DO NOTHING;
