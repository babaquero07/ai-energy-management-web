export interface DashboardSummaryRes {
  data: Data;
}

export interface Data {
  meters: number;
  totalConsumption: number;
  anomalies: number;
  highPriorityAnomalies: number;
  aiConfidence: number;
  lastAnalysisAt: Date;
  lastAnalysisStatus: string;
}
