'use client';

import { useEffect, useState, useContext } from 'react';
import { useParams } from 'next/navigation';
import { SelectedCompanyContext } from '../../../context/SelectedCompanyContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function RotasPage() {
  const { id } = useParams();
  const { selectedCompany } = useContext(SelectedCompanyContext);
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentRoute, setCurrentRoute] = useState(null);
  const supabase = createClientComponentClient();

  const fetchRoutes = async () => {
    try {
      const { data, error } = await supabase
        .from('bus_routes')
        .select('*')
        .eq('company_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRoutes(data);
    } catch (error) {
      console.error('Error fetching routes:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRoute = async (routeData) => {
    try {
      if (currentRoute) {
        // Update existing route
        const { error } = await supabase
          .from('bus_routes')
          .update(routeData)
          .eq('id', currentRoute.id);
        if (error) throw error;
      } else {
        // Create new route
        const { error } = await supabase
          .from('bus_routes')
          .insert([{ ...routeData, company_id: id }]);
        if (error) throw error;
      }
      fetchRoutes();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving route:', error);
    }
  };

  const handleDeleteRoute = async (routeId) => {
    try {
      const { error } = await supabase
        .from('bus_routes')
        .delete()
        .eq('id', routeId);
      if (error) throw error;
      fetchRoutes();
    } catch (error) {
      console.error('Error deleting route:', error);
    }
  };

  useEffect(() => {
    fetchRoutes();
  }, [id]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 p-4 bg-orange-50 border-b-2 border-green-500">
        <h2 className="text-xl font-semibold text-green-600">
          Rotas da Empresa: {selectedCompany?.name}
        </h2>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <Button onClick={() => {
            setCurrentRoute(null);
            setIsDialogOpen(true);
          }}>
            Adicionar Rota
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Carregando...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Origem</TableHead>
                  <TableHead>Destino</TableHead>
                  <TableHead>Hora Partida</TableHead>
                  <TableHead>Hora Chegada</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Preço Base</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {routes.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell>{route.origin}</TableCell>
                    <TableCell>{route.destination}</TableCell>
                    <TableCell>{route.departure_time}</TableCell>
                    <TableCell>{route.arrival_time}</TableCell>
                    <TableCell>{route.duration}</TableCell>
                    <TableCell>{route.base_price} AOA</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setCurrentRoute(route);
                          setIsDialogOpen(true);
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-red-500"
                        onClick={() => handleDeleteRoute(route.id)}
                      >
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentRoute ? 'Editar Rota' : 'Adicionar Rota'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            handleSaveRoute({
              origin: formData.get('origin'),
              destination: formData.get('destination'),
              departure_time: formData.get('departure_time'),
              arrival_time: formData.get('arrival_time'),
              duration: formData.get('duration'),
              base_price: parseFloat(formData.get('base_price')),
              total_seats: parseInt(formData.get('total_seats')),
              urbano: formData.get('urbano') === 'true',
            });
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="origin">Origem</Label>
                <Input
                  id="origin"
                  name="origin"
                  defaultValue={currentRoute?.origin}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="destination">Destino</Label>
                <Input
                  id="destination"
                  name="destination"
                  defaultValue={currentRoute?.destination}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="departure_time">Hora Partida</Label>
                <Input
                  id="departure_time"
                  name="departure_time"
                  type="time"
                  defaultValue={currentRoute?.departure_time}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="arrival_time">Hora Chegada</Label>
                <Input
                  id="arrival_time"
                  name="arrival_time"
                  type="time"
                  defaultValue={currentRoute?.arrival_time}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="duration">Duração</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="text"
                  defaultValue={currentRoute?.duration}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="base_price">Preço Base</Label>
                <Input
                  id="base_price"
                  name="base_price"
                  type="number"
                  step="0.01"
                  defaultValue={currentRoute?.base_price}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="total_seats">Total de Assentos</Label>
                <Input
                  id="total_seats"
                  name="total_seats"
                  type="number"
                  defaultValue={currentRoute?.total_seats}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="urbano">Urbano</Label>
                <select
                  id="urbano"
                  name="urbano"
                  defaultValue={currentRoute?.urbano ? 'true' : 'false'}
                  className="col-span-3 border p-2 rounded"
                  required
                >
                  <option value="true">Sim</option>
                  <option value="false">Não</option>
                </select>
              </div>
              <div className="flex justify-end">
                <Button type="submit">Salvar</Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
