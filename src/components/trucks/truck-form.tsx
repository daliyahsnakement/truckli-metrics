
import React, { useEffect } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Truck, Client } from '@/types';
import { useApp } from '@/contexts/AppContext';

const truckSchema = z.object({
  clientId: z.string({
    required_error: "Cliente é obrigatório",
  }),
  licensePlate: z.string().regex(/^[A-Z]{3}[0-9][A-Z][0-9]{2}$/, {
    message: "Placa inválida. Formato Mercosul: AAA0A00",
  }),
  renavam: z.string().regex(/^\d{11}$/, {
    message: "RENAVAM deve ter 11 dígitos",
  }),
  chassisNumber: z.string().length(17, {
    message: "Número do chassi deve ter 17 caracteres",
  }),
  modelYear: z.string().regex(/^\d{4}$/, {
    message: "Ano do modelo deve ter 4 dígitos",
  }),
  color: z.string().min(2, {
    message: "Cor deve ter pelo menos 2 caracteres",
  }),
  model: z.string().min(2, {
    message: "Modelo deve ter pelo menos 2 caracteres",
  }),
  status: z.enum(["active", "maintenance", "inactive"], {
    required_error: "Status é obrigatório",
  }),
});

type FormValues = z.infer<typeof truckSchema>;

interface TruckFormProps {
  initialData?: Truck;
  onSubmit: (data: FormValues) => void;
  isEditing?: boolean;
  preselectedClientId?: string;
}

export function TruckForm({ 
  initialData, 
  onSubmit, 
  isEditing = false,
  preselectedClientId
}: TruckFormProps) {
  const { clients } = useApp();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(truckSchema),
    defaultValues: initialData ? {
      clientId: initialData.clientId,
      licensePlate: initialData.licensePlate,
      renavam: initialData.renavam,
      chassisNumber: initialData.chassisNumber,
      modelYear: initialData.modelYear,
      color: initialData.color,
      model: initialData.model,
      status: initialData.status,
    } : {
      clientId: preselectedClientId || '',
      licensePlate: '',
      renavam: '',
      chassisNumber: '',
      modelYear: '',
      color: '',
      model: '',
      status: 'active',
    },
  });

  // Update form if preselectedClientId changes
  useEffect(() => {
    if (preselectedClientId && !isEditing) {
      form.setValue('clientId', preselectedClientId);
    }
  }, [preselectedClientId, form, isEditing]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isEditing || !!preselectedClientId}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um cliente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="licensePlate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Placa</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="AAA0A00" 
                    {...field} 
                    onChange={(e) => {
                      // Convert to uppercase
                      const value = e.target.value.toUpperCase();
                      field.onChange(value);
                    }}
                    maxLength={7}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="renavam"
            render={({ field }) => (
              <FormItem>
                <FormLabel>RENAVAM</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="00000000000" 
                    {...field}
                    onChange={(e) => {
                      // Allow only digits
                      const value = e.target.value.replace(/\D/g, '');
                      field.onChange(value);
                    }}
                    maxLength={11}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="chassisNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número do Chassi</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="9BWHE21JX24060960" 
                    {...field}
                    onChange={(e) => {
                      // Convert to uppercase, allow alphanumeric
                      const value = e.target.value.toUpperCase();
                      field.onChange(value);
                    }}
                    maxLength={17}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="modelYear"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ano do Modelo</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="2023" 
                    {...field}
                    onChange={(e) => {
                      // Allow only digits
                      const value = e.target.value.replace(/\D/g, '');
                      field.onChange(value);
                    }}
                    maxLength={4} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cor</FormLabel>
                <FormControl>
                  <Input placeholder="Branco" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Modelo</FormLabel>
                <FormControl>
                  <Input placeholder="Volvo FH" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="maintenance">Em Manutenção</SelectItem>
                    <SelectItem value="inactive">Inativo</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center justify-end space-x-4 pt-4">
          <Button variant="outline" type="button" onClick={() => form.reset()}>
            Cancelar
          </Button>
          <Button type="submit">
            {isEditing ? 'Atualizar Caminhão' : 'Adicionar Caminhão'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
