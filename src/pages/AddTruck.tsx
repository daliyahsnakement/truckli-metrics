
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TruckForm } from '@/components/trucks/truck-form';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/components/ui/use-toast';

const AddTruck = () => {
  const { clientId } = useParams(); // Get client ID from URL if coming from client detail page
  const { addTruck, clients } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (data: any) => {
    // If clientId is provided in URL params, use it
    if (clientId) {
      data.clientId = clientId;
    }
    
    addTruck(data);
    toast({
      title: "Caminhão adicionado",
      description: "O caminhão foi adicionado com sucesso."
    });
    
    // Redirect based on where the user came from
    if (clientId) {
      navigate(`/clients/${clientId}`);
    } else {
      navigate('/trucks');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8">
            <Link to={clientId ? `/clients/${clientId}` : "/trucks"}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Truck className="h-8 w-8" />
            Adicionar Caminhão
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
            defaultValues={clientId ? { clientId } : {}} 
            availableClients={clients}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTruck;
