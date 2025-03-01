
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Client, Truck, DashboardStats } from '@/types';
import { generateFakeClients, generateFakeTrucks, calculateDashboardStats } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';

interface AppContextType {
  clients: Client[];
  trucks: Truck[];
  stats: DashboardStats;
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addTruck: (truck: Omit<Truck, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTruck: (id: string, truck: Partial<Truck>) => void;
  deleteTruck: (id: string) => void;
  getClientById: (id: string) => Client | undefined;
  getTruckById: (id: string) => Truck | undefined;
  getTrucksByClientId: (clientId: string) => Truck[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [trucks, setTrucks] = useState<Truck[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    totalTrucks: 0,
    activeTrucks: 0,
    maintenanceTrucks: 0,
    inactiveTrucks: 0
  });

  // Initialize with fake data
  useEffect(() => {
    const fakeClients = generateFakeClients(10);
    const fakeTrucks = generateFakeTrucks(fakeClients, 30);
    setClients(fakeClients);
    setTrucks(fakeTrucks);
  }, []);

  // Calculate stats whenever clients or trucks change
  useEffect(() => {
    const newStats = calculateDashboardStats(clients, trucks);
    setStats(newStats);
  }, [clients, trucks]);

  const addClient = (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newClient: Client = {
      ...client,
      id: `client-${Date.now()}`,
      createdAt: now,
      updatedAt: now
    };
    
    setClients(prevClients => [...prevClients, newClient]);
    toast({
      title: "Cliente adicionado",
      description: `${newClient.name} foi adicionado com sucesso.`
    });
  };

  const updateClient = (id: string, clientUpdate: Partial<Client>) => {
    setClients(prevClients => 
      prevClients.map(client => 
        client.id === id 
          ? { ...client, ...clientUpdate, updatedAt: new Date().toISOString() } 
          : client
      )
    );
    toast({
      title: "Cliente atualizado",
      description: "Os dados do cliente foram atualizados com sucesso."
    });
  };

  const deleteClient = (id: string) => {
    // Check if client has trucks
    const clientTrucks = trucks.filter(truck => truck.clientId === id);
    if (clientTrucks.length > 0) {
      toast({
        title: "Não foi possível excluir",
        description: "Este cliente possui caminhões registrados. Remova-os primeiro.",
        variant: "destructive"
      });
      return;
    }
    
    setClients(prevClients => prevClients.filter(client => client.id !== id));
    toast({
      title: "Cliente removido",
      description: "Cliente removido com sucesso."
    });
  };

  const addTruck = (truck: Omit<Truck, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newTruck: Truck = {
      ...truck,
      id: `truck-${Date.now()}`,
      createdAt: now,
      updatedAt: now
    };
    
    setTrucks(prevTrucks => [...prevTrucks, newTruck]);
    toast({
      title: "Caminhão adicionado",
      description: `Caminhão placa ${newTruck.licensePlate} foi adicionado com sucesso.`
    });
  };

  const updateTruck = (id: string, truckUpdate: Partial<Truck>) => {
    setTrucks(prevTrucks => 
      prevTrucks.map(truck => 
        truck.id === id 
          ? { ...truck, ...truckUpdate, updatedAt: new Date().toISOString() } 
          : truck
      )
    );
    toast({
      title: "Caminhão atualizado",
      description: "Os dados do caminhão foram atualizados com sucesso."
    });
  };

  const deleteTruck = (id: string) => {
    setTrucks(prevTrucks => prevTrucks.filter(truck => truck.id !== id));
    toast({
      title: "Caminhão removido",
      description: "Caminhão removido com sucesso."
    });
  };

  const getClientById = (id: string) => {
    return clients.find(client => client.id === id);
  };

  const getTruckById = (id: string) => {
    return trucks.find(truck => truck.id === id);
  };

  const getTrucksByClientId = (clientId: string) => {
    return trucks.filter(truck => truck.clientId === clientId);
  };

  return (
    <AppContext.Provider value={{
      clients,
      trucks,
      stats,
      addClient,
      updateClient,
      deleteClient,
      addTruck,
      updateTruck,
      deleteTruck,
      getClientById,
      getTruckById,
      getTrucksByClientId
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
