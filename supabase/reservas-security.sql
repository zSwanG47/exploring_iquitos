-- Seguridad de reservas: ejecutar en Supabase SQL Editor
-- Objetivo: el cliente (anon) NO puede leer ni modificar reservas.
-- Toda la lógica pasa por /api/reservas con SUPABASE_SERVICE_ROLE_KEY.

ALTER TABLE reservas ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas permisivas previas (ajusta nombres si difieren)
DROP POLICY IF EXISTS "insert_reservas" ON reservas;
DROP POLICY IF EXISTS "update_reservas" ON reservas;
DROP POLICY IF EXISTS "select_reservas" ON reservas;
DROP POLICY IF EXISTS "anon_insert_reservas" ON reservas;
DROP POLICY IF EXISTS "anon_update_reservas" ON reservas;

-- Bloquear acceso anon/authenticated en reservas
CREATE POLICY "reservas_deny_anon_all"
  ON reservas
  FOR ALL
  TO anon
  USING (false)
  WITH CHECK (false);

CREATE POLICY "reservas_deny_authenticated_all"
  ON reservas
  FOR ALL
  TO authenticated
  USING (false)
  WITH CHECK (false);

-- Evitar reutilizar la misma orden PayPal en dos reservas
CREATE UNIQUE INDEX IF NOT EXISTS reservas_paypal_order_id_unique
  ON reservas (paypal_order_id)
  WHERE paypal_order_id IS NOT NULL;

-- Índice para búsqueda por token de referencia (API de confirmación)
CREATE INDEX IF NOT EXISTS reservas_ref_token_idx
  ON reservas (ref_token);
