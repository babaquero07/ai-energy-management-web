export interface MeterDetailResponse {
  data: MeterDetail;
}

export interface MeterDetail {
  id: number;
  meter_id: string;
  name: string;
  location: string;
  status: string;
  created_at: Date;
  current: Current;
  analysis: Analysis;
  history: Current[];
}

export interface Analysis {
  baseline: number;
  variationPercent: number;
}

export interface Current {
  consumption: number;
  voltage: number;
  current: number;
  powerFactor: number;
  timestamp: Date;
}
