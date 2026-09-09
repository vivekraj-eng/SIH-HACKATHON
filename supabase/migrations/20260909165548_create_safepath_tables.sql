/*
# Create SafePath AI tables (single-tenant, no auth)

1. New Tables
- `trips`: Stores navigation trips with route data, risk scores, and zone breakdowns.
  - id (uuid, pk), start_point (text), destination (text), distance_km (numeric),
    duration_min (int), risk_score (text: low/medium/high), green_pct, yellow_pct, red_pct (int),
    status (text: active/completed/cancelled), started_at, completed_at, created_at
- `hazard_reports`: Crowdsourced hazard reports submitted by users post-trip or during trip.
  - id (uuid, pk), trip_id (uuid, fk -> trips), hazard_type (text: pothole/accident/blockage/pedestrian/construction/other),
    severity (text: low/medium/high), description (text), latitude (numeric), longitude (numeric),
    zone_type (text: green/yellow/red), status (text: pending/verified/resolved), created_at
- `route_feedback`: Post-trip feedback from users about route safety.
  - id (uuid, pk), trip_id (uuid, fk -> trips), safety_rating (int 1-5), confirmed_safe (boolean),
    reported_hazards (boolean), feedback_note (text), created_at

2. Security
- Enable RLS on all tables.
- Allow anon + authenticated CRUD on all tables (single-tenant, no-auth app, data is intentionally shared for crowdsourced safety data).
*/

CREATE TABLE IF NOT EXISTS trips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  start_point text NOT NULL DEFAULT 'Current Location',
  destination text NOT NULL,
  distance_km numeric NOT NULL DEFAULT 0,
  duration_min int NOT NULL DEFAULT 0,
  risk_score text NOT NULL DEFAULT 'low',
  green_pct int NOT NULL DEFAULT 100,
  yellow_pct int NOT NULL DEFAULT 0,
  red_pct int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'active',
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_trips" ON trips;
CREATE POLICY "anon_select_trips" ON trips FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_trips" ON trips;
CREATE POLICY "anon_insert_trips" ON trips FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_trips" ON trips;
CREATE POLICY "anon_update_trips" ON trips FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_trips" ON trips;
CREATE POLICY "anon_delete_trips" ON trips FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS hazard_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES trips(id) ON DELETE SET NULL,
  hazard_type text NOT NULL DEFAULT 'other',
  severity text NOT NULL DEFAULT 'medium',
  description text,
  latitude numeric,
  longitude numeric,
  zone_type text DEFAULT 'green',
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE hazard_reports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_hazards" ON hazard_reports;
CREATE POLICY "anon_select_hazards" ON hazard_reports FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_hazards" ON hazard_reports;
CREATE POLICY "anon_insert_hazards" ON hazard_reports FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_hazards" ON hazard_reports;
CREATE POLICY "anon_update_hazards" ON hazard_reports FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_hazards" ON hazard_reports;
CREATE POLICY "anon_delete_hazards" ON hazard_reports FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS route_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id uuid REFERENCES trips(id) ON DELETE SET NULL,
  safety_rating int NOT NULL DEFAULT 5,
  confirmed_safe boolean NOT NULL DEFAULT true,
  reported_hazards boolean NOT NULL DEFAULT false,
  feedback_note text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE route_feedback ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_feedback" ON route_feedback;
CREATE POLICY "anon_select_feedback" ON route_feedback FOR SELECT
  TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_feedback" ON route_feedback;
CREATE POLICY "anon_insert_feedback" ON route_feedback FOR INSERT
  TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_feedback" ON route_feedback;
CREATE POLICY "anon_update_feedback" ON route_feedback FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_feedback" ON route_feedback;
CREATE POLICY "anon_delete_feedback" ON route_feedback FOR DELETE
  TO anon, authenticated USING (true);
