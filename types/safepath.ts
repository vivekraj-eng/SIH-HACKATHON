export type ZoneType = 'green' | 'yellow' | 'red';

export type HazardReport = {
  id: string;
  hazard_type: string;
  severity: ZoneType;
  description: string | null;
  status: string;
  created_at: string;
};

export type Trip = {
  id: string;
  start_point: string;
  destination: string;
  distance_km: number;
  duration_min: number;
  risk_score: ZoneType;
  green_pct: number;
  yellow_pct: number;
  red_pct: number;
  status: string;
  created_at: string;
};
