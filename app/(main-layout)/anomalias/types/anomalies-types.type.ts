export enum AnomalyType {
  REAL_ANOMALY = 'REAL_ANOMALY',
  EXPLAINABLE_ANOMALY = 'EXPLAINABLE_ANOMALY',
  FALSE_POSITIVE = 'FALSE_POSITIVE',
  DATA_QUALITY = 'DATA_QUALITY',
  PENDING_ANALYSIS = 'PENDING_ANALYSIS',
}

export enum AnomalySeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  PENDING = 'PENDING',
}

export enum AnomalyStatus {
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  RESOLVED = 'RESOLVED',
  DETECTED = 'DETECTED',
}


export interface AnomaliesResponse {
  data: Anomaly[];
  total: number;
}

export interface Anomaly {
  id: number;
  meter_id: string;
  type: AnomalyType;
  severity: AnomalySeverity;
  confidence: number;
  detected_at: Date;
  status: AnomalyStatus;
}

export interface AnomalyDetailResponse {
  id: number;
  meter_id: string;
  type: AnomalyType;
  severity: AnomalySeverity;
  confidence: number;
  detected_at: Date;
  status: AnomalyStatus;
  reason: string;
  recommended_action: string;
  analysis_data: AnalysisData;
}

export interface AnalysisData {
  baseline: number;
  variation_percent: number;
  signals: Signals;
  segment: Segment | null;
  max_abs_z: number;
  worst_power_residual: number;
  related_events: RelatedEvents | null;
}

export interface RelatedEvents {
  id: number;
  timestamp: Date;
  type: string;
  description: string;
}

export interface Segment {
  from: Date;
  to: Date;
  hours: number;
  meanConsumption: number;
}

export interface Signals {
  consumptionSpike: boolean;
  persistentBaselineChange: boolean;
  outliers: boolean;
  abnormalHourlyPattern: boolean;
  dataQuality: boolean;
  anomalousElectricalRelation: boolean;
}
