export interface MetersResponse {
  data: {
    meters: Meter[];
    actives: number;
    inactives: number;
    maintenances: number;
    total: number;
  };
}

export interface Meter {
  id: number;
  meter_id: string;
  name: string;
  location: string;
  status: Status;
  created_at: Date;
}

export enum Status {
  Activo = "Activo",
  Inactivo = "Inactivo",
  Mantenimiento = "Mantenimiento",
}
