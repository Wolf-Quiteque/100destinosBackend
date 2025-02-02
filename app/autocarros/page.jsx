'use client';
import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext } from '@/components/ui/pagination';
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PAGE_SIZE = 5;

export default function BusesPage() {
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const [buses, setBuses] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [totalBuses, setTotalBuses] = useState(0);
  const [newBus, setNewBus] = useState({
    reference: '',
    seats: '',
    company_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [deleteBusId, setDeleteBusId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);

  useEffect(() => {
    fetchBuses();
    fetchCompanies();
  }, [currentPage]);

  const fetchBuses = async () => {
    setLoading(true);
    try {
      const { data, error, count } = await supabase
        .from('buses')
        .select('*, bus_companies(name)', { count: 'exact' })
        .range((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE - 1)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBuses(data || []);
      setTotalBuses(count || 0);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar ônibus',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const { data, error } = await supabase
        .from('bus_companies')
        .select('id, name');
      
      if (error) throw error;
      setCompanies(data || []);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar empresas',
        description: error.message,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('buses')
        .insert([{
          reference: newBus.reference,
          seats: parseInt(newBus.seats),
          company_id: newBus.company_id
        }]);

      if (error) throw error;

      toast({
        title: 'Sucesso!',
        description: 'Ônibus adicionado com sucesso',
        className: 'bg-orange-100 border-orange-300 text-orange-700',
      });

      setNewBus({ reference: '', seats: '', company_id: '' });
      fetchBuses();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao adicionar ônibus',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (bus) => {
    setEditingBus(bus);
    setNewBus({
      reference: bus.reference,
      seats: bus.seats.toString(),
      company_id: bus.company_id
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsGlowing(true);
    setTimeout(() => setIsGlowing(false), 2000);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('buses')
        .update({
          reference: newBus.reference,
          seats: parseInt(newBus.seats),
          company_id: newBus.company_id
        })
        .eq('id', editingBus.id);

      if (error) throw error;

      toast({
        title: 'Sucesso!',
        description: 'Ônibus atualizado com sucesso',
        className: 'bg-orange-100 border-orange-300 text-orange-700',
      });

      setEditingBus(null);
      setNewBus({ reference: '', seats: '', company_id: '' });
      fetchBuses();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar ônibus',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('buses')
        .delete()
        .eq('id', deleteBusId);

      if (error) throw error;

      toast({
        title: 'Sucesso!',
        description: 'Ônibus deletado com sucesso',
        className: 'bg-orange-100 border-orange-300 text-orange-700',
      });

      setDeleteBusId(null);
      setIsDeleteDialogOpen(false);
      fetchBuses();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao deletar ônibus',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className={`border-orange-100 ${isGlowing ? 'glow-effect' : ''}`}>
        <CardHeader>
          <CardTitle className="text-orange-600">Gerenciar Ônibus</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={editingBus ? handleUpdate : handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Input
                placeholder="Referência do Ônibus"
                value={newBus.reference}
                onChange={(e) => setNewBus({ ...newBus, reference: e.target.value })}
                required
                className="border-orange-200 focus:ring-orange-500"
              />
              <Input
                type="number"
                placeholder="Número de Assentos"
                value={newBus.seats}
                onChange={(e) => setNewBus({ ...newBus, seats: e.target.value })}
                required
                className="border-orange-200 focus:ring-orange-500"
              />
              <Select
                value={newBus.company_id}
                onValueChange={(value) => setNewBus({ ...newBus, company_id: value })}
              >
                <SelectTrigger className="border-orange-200">
                  <SelectValue placeholder="Selecione a Empresa" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white"
                disabled={loading}
              >
                {loading ? (editingBus ? 'Atualizando...' : 'Adicionando...') : (editingBus ? 'Atualizar Ônibus' : 'Adicionar Ônibus')}
              </Button>
            </div>
            {editingBus && (
              <Button
                type="button"
                className="bg-gray-600 hover:bg-gray-700 text-white"
                onClick={() => {
                  setEditingBus(null);
                  setNewBus({ reference: '', seats: '', company_id: '' });
                }}
              >
                Cancelar Edição
              </Button>
            )}
          </form>
        </CardContent>
      </Card>

      <Card className="border-orange-100">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-orange-50">
                <TableHead className="text-orange-600">Referência</TableHead>
                <TableHead className="text-orange-600">Assentos</TableHead>
                <TableHead className="text-orange-600">Empresa</TableHead>
                <TableHead className="text-orange-600">Data de Cadastro</TableHead>
                <TableHead className="text-orange-600">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buses.map((bus) => (
                <TableRow key={bus.id}>
                  <TableCell>{bus.reference}</TableCell>
                  <TableCell>{bus.seats}</TableCell>
                  <TableCell>{bus.bus_companies?.name}</TableCell>
                  <TableCell>
                    {new Date(bus.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      className="mr-2"
                      onClick={() => handleEdit(bus)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setDeleteBusId(bus.id);
                        setIsDeleteDialogOpen(true);
                      }}
                    >
                      Deletar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Pagination className="mt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? 'text-gray-300' : 'text-orange-600'}
                />
              </PaginationItem>
              <span className="px-4">
                Página {currentPage} de {Math.ceil(totalBuses / PAGE_SIZE)}
              </span>
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className={currentPage * PAGE_SIZE >= totalBuses ? 'text-gray-300' : 'text-orange-600'}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o ônibus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Deletar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}