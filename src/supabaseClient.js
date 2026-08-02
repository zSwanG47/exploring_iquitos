import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/*
  SQL para contactos (ya existente):

  CREATE TABLE contactos (
    id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nombre      TEXT NOT NULL,
    email       TEXT NOT NULL,
    telefono    TEXT,
    mensaje     TEXT NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT now()
  );

  ALTER TABLE contactos ENABLE ROW LEVEL SECURITY;
  CREATE POLICY "insert_contactos" ON contactos
    FOR INSERT TO anon WITH CHECK (true);

  ── Precios de tours ──
  Los precios viven SOLO en la tabla tours (columna precio).
  Ejecuta supabase/tours.sql para crear la tabla y políticas de lectura.
  El frontend y /api/reservas leen desde ahí; no hay precios en toursData.js.

  ── Reservas ──
  Las reservas se gestionan SOLO vía API serverless (/api/reservas).
  Ejecuta supabase/reservas-security.sql para bloquear acceso directo
  desde el cliente y evitar marcar pagos como "pagado" sin verificación PayPal.

  Variables de entorno requeridas en Vercel:
  - SUPABASE_SERVICE_ROLE_KEY (nunca exponer al frontend)
  - PAYPAL_CLIENT_SECRET
  - PAYPAL_CLIENT_ID (o reutilizar VITE_PAYPAL_CLIENT_ID)
  - PAYPAL_MODE=sandbox|live (opcional, default: live)
*/
