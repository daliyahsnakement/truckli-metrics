
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Truck, Pencil, Trash2, Calendar, RotateCw, Pause, PlayCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useApp } from '@/contexts/AppContext';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';

const TruckDetail = () => {
  const { id } = useParams();
  const { trucks, clients, removeTruck, updateTruckStatus } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();

  const truck = trucks.find(truck => truck.id === id);
  
  if (!truck) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold mb-2">Caminhão não encontrado</h2>
        <p className="text-muted-foreground mb-6">O caminhão que você está procurando não existe ou foi removido.</p>
        <Button asChild>
          <Link to="/trucks">Voltar para Lista de Caminhões</Link>
        </Button>
      </div>
    );
  }

  const client = clients.find(client => client.id === truck.clientId);

  const handleDelete = () => {
    removeTruck(truck.id);
    toast({
      title: "Caminhão removido",
      description: "O caminhão foi removido com sucesso."
    });
    navigate('/trucks');
  };

  const handleStatusChange = (newStatus: 'active' | 'maintenance' | 'inactive') => {
    updateTruckStatus(truck.id, newStatus);
    toast({
      title: "Status atualizado",
      description: `O status do caminhão foi atualizado para ${
        newStatus === 'active' ? 'Ativo' : 
        newStatus === 'maintenance' ? 'Em Manutenção' : 'Inativo'
      }.`
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8">
            <Link to="/trucks">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Truck className="h-8 w-8" />
            Detalhes do Caminhão
          </h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link to={`/trucks/${truck.id}/edit`}>
              <Pencil className="h-4 w-4 mr-2" />
              Editar
            </Link>
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Remover
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Remover caminhão</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja remover este caminhão? Esta ação não pode ser desfeita.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => {}}>Cancelar</Button>
                <Button variant="destructive" onClick={handleDelete}>Remover</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Caminhão</CardTitle>
            <CardDescription>Detalhes do veículo e especificações</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">{truck.model} ({truck.modelYear})</h3>
                <p className="text-muted-foreground">Cor: {truck.color}</p>
              </div>
              <div>
                {truck.status === 'active' && (
                  <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-0">
                    Ativo
                  </Badge>
                )}
                {truck.status === 'maintenance' && (
                  <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 border-0">
                    Em Manutenção
                  </Badge>
                )}
                {truck.status === 'inactive' && (
                  <Badge className="bg-rose-100 text-rose-800 hover:bg-rose-200 border-0">
                    Inativo
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Placa</p>
                <p>{truck.licensePlate}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">RENAVAM</p>
                <p>{truck.renavam}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Número do Chassi</p>
                <p>{truck.chassisNumber}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Cliente</p>
              <Link 
                to={`/clients/${client?.id}`} 
                className="inline-flex items-center text-primary hover:underline"
              >
                {client?.name || 'Cliente não encontrado'}
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manutenção e Status</CardTitle>
            <CardDescription>Informações sobre manutenção e status do veículo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Status Atual</p>
              <div className="flex flex-wrap gap-2">
                <Button 
                  size="sm" 
                  variant={truck.status === 'active' ? 'default' : 'outline'} 
                  onClick={() => handleStatusChange('active')}
                >
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Ativo
                </Button>
                <Button 
                  size="sm" 
                  variant={truck.status === 'maintenance' ? 'default' : 'outline'} 
                  onClick={() => handleStatusChange('maintenance')}
                >
                  <RotateCw className="h-4 w-4 mr-2" />
                  Em Manutenção
                </Button>
                <Button 
                  size="sm" 
                  variant={truck.status === 'inactive' ? 'default' : 'outline'} 
                  onClick={() => handleStatusChange('inactive')}
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Inativo
                </Button>
              </div>
            </div>

            {truck.lastMaintenanceDate && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Última Manutenção</p>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  {formatDate(truck.lastMaintenanceDate)}
                </div>
              </div>
            )}

            {truck.nextMaintenanceDate && (
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-1">Próxima Manutenção</p>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                  {formatDate(truck.nextMaintenanceDate)}
                </div>
              </div>
            )}
            
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1">Datas</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Cadastrado em:</p>
                  <p>{formatDate(truck.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Última atualização:</p>
                  <p>{formatDate(truck.updatedAt)}</p>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link to="/trucks">Voltar</Link>
            </Button>
            <Button asChild>
              <Link to={`/trucks/${truck.id}/edit`}>
                <Pencil className="h-4 w-4 mr-2" />
                Editar
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default TruckDetail;
