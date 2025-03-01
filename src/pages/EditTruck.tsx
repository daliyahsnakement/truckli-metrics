
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TruckForm } from '@/components/trucks/truck-form';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/components/ui/use-toast';

const EditTruck = () => {
  const { id } = useParams();
  const { trucks, clients, updateTruck } = useApp();
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

  const handleSubmit = (data: any) => {
    updateTruck(id!, { ...truck, ...data });
    toast({
      title: "Caminhão atualizado",
      description: "O caminhão foi atualizado com sucesso."
    });
    navigate(`/trucks/${id}`);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8">
            <Link to={`/trucks/${id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Truck className="h-8 w-8" />
            Editar Caminhão
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Caminhão</CardTitle>
        </CardHeader>
        <CardContent>
          <TruckForm 
            onSubmit={handleSubmit} 
            defaultValues={truck} 
            availableClients={clients}
            isEditing={true}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditTruck;
