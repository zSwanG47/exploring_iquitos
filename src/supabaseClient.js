import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/*
  SQL para crear la tabla en Supabase:

  CREATE TABLE contactos (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre      TEXT NOT NULL,
    email       TEXT NOT NULL,
    telefono    TEXT,
    mensaje     TEXT NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT now()
  );

  -- Permitir inserciones anónimas (RLS):
  ALTER TABLE contactos ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "insert_contactos" ON contactos
    FOR INSERT TO anon WITH CHECK (true);
*/
