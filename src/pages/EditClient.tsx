
import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClientForm } from '@/components/clients/client-form';
import { useApp } from '@/contexts/AppContext';
import { toast } from '@/hooks/use-toast';

const EditClient = () => {
  const { id } = useParams<{ id: string }>();
  const { getClientById, updateClient } = useApp();
  const navigate = useNavigate();
  
  const client = id ? getClientById(id) : undefined;
  
  useEffect(() => {
    if (id && !client) {
      toast({
        title: "Cliente não encontrado",
        description: `Não foi possível encontrar um cliente com o ID: ${id}`,
        variant: "destructive"
      });
      navigate('/clients');
    }
  }, [id, client, navigate]);

  const handleSubmit = (data: any) => {
    if (id) {
      updateClient(id, data);
      navigate(`/clients/${id}`);
    }
  };

  if (!client) {
    return null;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="h-8 w-8">
            <Link to={`/clients/${id}`}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8" />
            Editar Cliente
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Informações do Cliente</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientForm initialData={client} onSubmit={handleSubmit} isEditing />
        </CardContent>
      </Card>
    </div>
  );
};

export default EditClient;
