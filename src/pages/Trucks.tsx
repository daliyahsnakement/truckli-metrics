
import { Link } from 'react-router-dom';
import { Plus, Truck, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';

const Trucks = () => {
  const { trucks, clients } = useApp();

  // Helper function to get client name by ID
  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client ? client.name : 'Cliente não encontrado';
  };

  // Status groups
  const activeTrucks = trucks.filter(truck => truck.status === 'active');
  const maintenanceTrucks = trucks.filter(truck => truck.status === 'maintenance');
  const inactiveTrucks = trucks.filter(truck => truck.status === 'inactive');

  const renderTruckItem = (truck: any) => (
    <Link 
      to={`/trucks/${truck.id}`} 
      key={truck.id}
      className="block"
    >
      <Card className="hover:bg-muted/50 transition-colors">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-medium">
                {truck.model} ({truck.modelYear})
              </div>
              <div className="text-sm text-muted-foreground">
                {truck.licensePlate}
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                Cliente: {getClientName(truck.clientId)}
              </div>
            </div>
            <div className="flex flex-col items-end">
              {truck.status === 'active' && (
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  Ativo
                </Badge>
              )}
              {truck.status === 'maintenance' && (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                  Em Manutenção
                </Badge>
              )}
              {truck.status === 'inactive' && (
                <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200">
                  Inativo
                </Badge>
              )}
              {truck.nextMaintenanceDate && (
                <div className="text-xs text-muted-foreground mt-1">
                  Próxima manutenção: {formatDate(truck.nextMaintenanceDate)}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Truck className="h-6 w-6" />
          <h1 className="text-3xl font-bold tracking-tight">Caminhões</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrar
          </Button>
          <Button size="sm" asChild>
            <Link to="/trucks/add">
              <Plus className="h-4 w-4 mr-2" />
              Novo Caminhão
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">Todos ({trucks.length})</TabsTrigger>
          <TabsTrigger value="active">Ativos ({activeTrucks.length})</TabsTrigger>
          <TabsTrigger value="maintenance">Em Manutenção ({maintenanceTrucks.length})</TabsTrigger>
          <TabsTrigger value="inactive">Inativos ({inactiveTrucks.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          {trucks.length === 0 ? (
            <Card>
              <CardContent className="p-6 flex flex-col items-center justify-center">
                <Truck className="h-12 w-12 text-muted-foreground mb-4" />
                <CardTitle className="text-xl mb-2">Nenhum caminhão cadastrado</CardTitle>
                <CardDescription className="text-center mb-4">
                  Comece cadastrando um novo caminhão para sua frota.
                </CardDescription>
                <Button asChild>
                  <Link to="/trucks/add">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Caminhão
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {trucks.map(renderTruckItem)}
            </div>
          )}
        </TabsContent>
        <TabsContent value="active" className="space-y-4">
          {activeTrucks.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Nenhum caminhão ativo encontrado.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {activeTrucks.map(renderTruckItem)}
            </div>
          )}
        </TabsContent>
        <TabsContent value="maintenance" className="space-y-4">
          {maintenanceTrucks.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Nenhum caminhão em manutenção encontrado.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {maintenanceTrucks.map(renderTruckItem)}
            </div>
          )}
        </TabsContent>
        <TabsContent value="inactive" className="space-y-4">
          {inactiveTrucks.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Nenhum caminhão inativo encontrado.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {inactiveTrucks.map(renderTruckItem)}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Trucks;
