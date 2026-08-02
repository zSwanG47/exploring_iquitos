-- Precios de tours: única fuente de verdad para la web
-- Ejecutar en Supabase SQL Editor
-- Nota: la tabla tours ya existe con columnas id, nombre, precio (y posiblemente más).

ALTER TABLE tours ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "tours_select_anon" ON tours;
CREATE POLICY "tours_select_anon"
  ON tours
  FOR SELECT
  TO anon
  USING (true);

-- Sin políticas de INSERT/UPDATE/DELETE para anon → solo lectura pública

INSERT INTO tours (id, nombre, precio) VALUES
  ('tour-amazonas-5d-4n',    'Tour Amazonas',      600),
  ('tour-isla-bonita-4d-3n', 'Tour Isla Bonita',   400),
  ('tour-mono-ardilla-3d-2n','Tour Mono Ardilla',  300),
  ('fullday-amazonas',       'Full Day Amazonas',  100),
  ('fullday-nanay',          'Full Day Nanay',     100)
ON CONFLICT (id) DO UPDATE SET
  nombre = EXCLUDED.nombre,
  precio = EXCLUDED.precio;
