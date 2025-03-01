
export interface Client {
  id: string;
  name: string;
  cnpj: string;
  address: string;
  phone: string;
  email: string;
  contactPerson: string;
  createdAt: string;
  updatedAt: string;
}

export interface Truck {
  id: string;
  clientId: string;
  licensePlate: string;
  renavam: string;
  chassisNumber: string;
  modelYear: string;
  color: string;
  model: string;
  status: 'active' | 'maintenance' | 'inactive';
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardStats {
  totalClients: number;
  totalTrucks: number;
  activeTrucks: number;
  maintenanceTrucks: number;
  inactiveTrucks: number;
}
