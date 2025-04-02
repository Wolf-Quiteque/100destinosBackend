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

export default function AutocarrosPage() {
  const { id } = useParams();
  const { selectedCompany } = useContext(SelectedCompanyContext);
  const [buses, setBuses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentBus, setCurrentBus] = useState(null);
  const supabase = createClientComponentClient();

  const fetchBuses = async () => {
    try {
      const { data, error } = await supabase
        .from('buses')
        .select('*')
        .eq('company_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBuses(data);
    } catch (error) {
      console.error('Error fetching buses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBus = async (busData) => {
    try {
      if (currentBus) {
        // Update existing bus
        const { error } = await supabase
          .from('buses')
          .update(busData)
          .eq('id', currentBus.id);
        if (error) throw error;
      } else {
        // Create new bus
        const { error } = await supabase
          .from('buses')
          .insert([{ ...busData, company_id: id }]);
        if (error) throw error;
      }
      fetchBuses();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving bus:', error);
    }
  };

  const handleDeleteBus = async (busId) => {
    try {
      const { error } = await supabase
        .from('buses')
        .delete()
        .eq('id', busId);
      if (error) throw error;
      fetchBuses();
    } catch (error) {
      console.error('Error deleting bus:', error);
    }
  };

  useEffect(() => {
    fetchBuses();
  }, [id]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 p-4 bg-orange-50 border-b-2 border-green-500">
        <h2 className="text-xl font-semibold text-green-600">
          Autocarros da Empresa: {selectedCompany?.name}
        </h2>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <Button 
            className="bg-orange-600 hover:bg-orange-700"
            onClick={() => {
              setCurrentBus(null);
              setIsDialogOpen(true);
            }}
          >
            Adicionar Autocarro
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Carregando...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Referência</TableHead>
                  <TableHead>Assentos</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {buses.map((bus) => (
                  <TableRow key={bus.id}>
                    <TableCell>{bus.reference}</TableCell>
                    <TableCell>{bus.seats}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setCurrentBus(bus);
                          setIsDialogOpen(true);
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-red-500"
                        onClick={() => handleDeleteBus(bus.id)}
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
            <DialogTitle>{currentBus ? 'Editar Autocarro' : 'Adicionar Autocarro'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            handleSaveBus({
              reference: formData.get('reference'),
              seats: parseInt(formData.get('seats')),
            });
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reference">Referência</Label>
                <Input
                  id="reference"
                  name="reference"
                  defaultValue={currentBus?.reference}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="seats">Número de Assentos</Label>
                <Input
                  id="seats"
                  name="seats"
                  type="number"
                  defaultValue={currentBus?.seats}
                  className="col-span-3"
                  required
                />
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
