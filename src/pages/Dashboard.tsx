
import { 
  LayoutDashboard, 
  Users, 
  Truck, 
  ActivitySquare,
  Wrench,
  Pause
} from 'lucide-react';
import { DashboardCard } from '@/components/ui/dashboard-card';
import { useApp } from '@/contexts/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const Dashboard = () => {
  const { stats, clients, trucks } = useApp();

  // Data for status distribution pie chart
  const statusData = [
    { name: 'Ativos', value: stats.activeTrucks, color: '#22c55e' },
    { name: 'Em Manutenção', value: stats.maintenanceTrucks, color: '#f59e0b' },
    { name: 'Inativos', value: stats.inactiveTrucks, color: '#ef4444' },
  ];

  // Data for trucks by client bar chart
  const clientTrucksData = clients
    .map(client => {
      const clientTrucks = trucks.filter(truck => truck.clientId === client.id);
      return {
        name: client.name.length > 15 ? client.name.substring(0, 15) + '...' : client.name,
        truckCount: clientTrucks.length,
      };
    })
    .sort((a, b) => b.truckCount - a.truckCount)
    .slice(0, 5); // Top 5 clients

  return (
    <div className="animate-fade-in space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </div>
      
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Total de Clientes"
          value={stats.totalClients}
          icon={<Users />}
          description="Empresas cadastradas"
          className="animate-scale-in"
        />
        <DashboardCard
          title="Total de Caminhões"
          value={stats.totalTrucks}
          icon={<Truck />}
          description="Frota completa"
          className="animate-scale-in [animation-delay:100ms]"
        />
        <DashboardCard
          title="Caminhões Ativos"
          value={stats.activeTrucks}
          icon={<ActivitySquare />}
          description={`${Math.round((stats.activeTrucks / stats.totalTrucks) * 100)}% da frota`}
          className="animate-scale-in [animation-delay:200ms]"
        />
        <DashboardCard
          title="Em Manutenção"
          value={stats.maintenanceTrucks}
          icon={<Wrench />}
          description={`${Math.round((stats.maintenanceTrucks / stats.totalTrucks) * 100)}% da frota`}
          className="animate-scale-in [animation-delay:300ms]"
        />
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Status Distribution */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Distribuição de Status</CardTitle>
                <CardDescription>
                  Visão geral do status da frota
                </CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Status Cards */}
            <div className="lg:col-span-4">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Caminhões Ativos
                    </CardTitle>
                    <ActivitySquare className="h-4 w-4 text-emerald-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.activeTrucks}</div>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((stats.activeTrucks / stats.totalTrucks) * 100)}% da frota
                    </p>
                    <div className="mt-4 h-1 w-full bg-emerald-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${(stats.activeTrucks / stats.totalTrucks) * 100}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Em Manutenção
                    </CardTitle>
                    <Wrench className="h-4 w-4 text-amber-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.maintenanceTrucks}</div>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((stats.maintenanceTrucks / stats.totalTrucks) * 100)}% da frota
                    </p>
                    <div className="mt-4 h-1 w-full bg-amber-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${(stats.maintenanceTrucks / stats.totalTrucks) * 100}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Caminhões Inativos
                    </CardTitle>
                    <Pause className="h-4 w-4 text-rose-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.inactiveTrucks}</div>
                    <p className="text-xs text-muted-foreground">
                      {Math.round((stats.inactiveTrucks / stats.totalTrucks) * 100)}% da frota
                    </p>
                    <div className="mt-4 h-1 w-full bg-rose-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-rose-500 rounded-full"
                        style={{ width: `${(stats.inactiveTrucks / stats.totalTrucks) * 100}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total de Clientes
                    </CardTitle>
                    <Users className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.totalClients}</div>
                    <p className="text-xs text-muted-foreground">
                      Média de {(stats.totalTrucks / stats.totalClients).toFixed(1)} caminhões por cliente
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="clients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top 5 Clientes por Número de Caminhões</CardTitle>
              <CardDescription>
                Clientes com as maiores frotas
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={clientTrucksData}
                    layout="vertical"
                    margin={{
                      top: 15,
                      right: 25,
                      left: 25,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" width={150} />
                    <Tooltip />
                    <Bar dataKey="truckCount" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
