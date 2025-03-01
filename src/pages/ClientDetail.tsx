
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building2, 
  Phone, 
  Mail, 
  User2, 
  MapPin, 
  Calendar, 
  Truck, 
  Edit, 
  MoreHorizontal, 
  Trash,
  Plus,
  Search,
  EyeIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useApp } from '@/contexts/AppContext';
import { formatCNPJ, formatDate } from '@/lib/utils';
import { Truck as TruckType } from '@/types';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogClose,
} from '@/components/ui/dialog';

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getClientById, getTrucksByClientId, deleteTruck } = useApp();
  const navigate = useNavigate();
  
  const client = id ? getClientById(id) : undefined;
  const trucks = id ? getTrucksByClientId(id) : [];
  
  const [searchTerm, setSearchTerm] = useState('');
  const [truckToDelete, setTruckToDelete] = useState<TruckType | null>(null);
  
  // Filter trucks by search term
  const filteredTrucks = trucks.filter(truck => 
    truck.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    truck.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    truck.chassisNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  const handleDeleteClick = (truck: TruckType) => {
    setTruckToDelete(truck);
  };

  const confirmDelete = () => {
    if (truckToDelete) {
      deleteTruck(truckToDelete.id);
      setTruckToDelete(null);
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
            <Link to="/clients">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">{client.name}</h1>
        </div>
        <div className="flex space-x-2">
          <Button asChild>
            <Link to={`/clients/${id}/trucks/add`}>
              <Truck className="mr-2 h-4 w-4" />
              Adicionar Caminhão
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to={`/clients/${id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Editar Cliente
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Client Details */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Informações do Cliente</CardTitle>
            <CardDescription>Detalhes e informações de contato</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center">
              <Building2 className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="font-medium">CNPJ:</span>
              <span className="ml-2">{formatCNPJ(client.cnpj)}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Endereço:</span>
              <span className="ml-2">{client.address}</span>
            </div>
            <div className="flex items-center">
              <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Telefone:</span>
              <span className="ml-2">{client.phone}</span>
            </div>
            <div className="flex items-center">
              <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Email:</span>
              <span className="ml-2">{client.email}</span>
            </div>
            <div className="flex items-center">
              <User2 className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Contato:</span>
              <span className="ml-2">{client.contactPerson}</span>
            </div>
            <Separator />
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Criado em:</span>
              <span className="ml-2">{formatDate(client.createdAt)}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Atualizado em:</span>
              <span className="ml-2">{formatDate(client.updatedAt)}</span>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="flex items-center">
              <Truck className="mr-2 h-4 w-4 text-primary" />
              <span className="font-medium">Total de Caminhões:</span>
              <Badge variant="outline" className="ml-2 font-mono">
                {trucks.length}
              </Badge>
            </div>
          </CardFooter>
        </Card>

        {/* Trucks List */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Frota de Caminhões</CardTitle>
            <div className="flex items-center justify-between">
              <CardDescription>Lista de caminhões deste cliente</CardDescription>
              <div className="relative max-w-sm">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por placa ou modelo..."
                  className="pl-8 w-60"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Placa</TableHead>
                    <TableHead>Modelo</TableHead>
                    <TableHead className="w-[100px]">Ano</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTrucks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        {searchTerm 
                          ? "Nenhum caminhão encontrado com os termos da busca" 
                          : "Este cliente não possui caminhões cadastrados"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTrucks.map((truck) => (
                      <TableRow key={truck.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{truck.licensePlate}</TableCell>
                        <TableCell>{truck.model}</TableCell>
                        <TableCell>{truck.modelYear}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              truck.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : truck.status === 'maintenance'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                            }
                          >
                            {truck.status === 'active'
                              ? 'Ativo'
                              : truck.status === 'maintenance'
                              ? 'Em Manutenção'
                              : 'Inativo'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Abrir menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link to={`/trucks/${truck.id}`}>
                                  <EyeIcon className="mr-2 h-4 w-4" />
                                  <span>Visualizar</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/trucks/${truck.id}/edit`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  <span>Editar</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleDeleteClick(truck)}
                              >
                                <Trash className="mr-2 h-4 w-4" />
                                <span>Excluir</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link to={`/clients/${id}/trucks/add`}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Caminhão
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!truckToDelete} onOpenChange={() => setTruckToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o caminhão com placa 
              {truckToDelete && <span className="font-semibold"> {truckToDelete.licensePlate}</span>}? 
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClientDetail;
