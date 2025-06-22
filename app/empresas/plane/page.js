'use client';
import { useState, useEffect, useContext } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { PlusIcon } from 'lucide-react';
import { SelectedCompanyContext } from '../../context/SelectedCompanyContext'; // Adjusted path
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
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const PAGE_SIZE = 5;

export default function PlaneEmpresasPage() { // Renamed component
  const { selectedCompany, setSelectedCompany } = useContext(SelectedCompanyContext);
  const supabase = createClientComponentClient();
  const { toast } = useToast()
  const [isGlowing, setIsGlowing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [companies, setCompanies] = useState([]);
  const [totalCompanies, setTotalCompanies] = useState(0);
  const [newCompany, setNewCompany] = useState({
    name: '',
    contact_number: '',
    logo: null,
  });
  const [loading, setLoading] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [deleteCompanyId, setDeleteCompanyId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [showActions, setShowActions] = useState({});

  useEffect(() => {
    fetchCompanies();
  }, [currentPage]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const { data, error, count } = await supabase
        .from('plane_companies') // Changed from bus_companies
        .select('*', { count: 'exact' })
        .range((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE - 1)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCompanies(data || []);
      setTotalCompanies(count || 0);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar empresas de avião', // Changed message
        description: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('company-logos') // Changed from company-logos
      .upload(fileName, file);

    if (error) throw error;
    return data.path;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let logoUrl = null;
      if (newCompany.logo) {
        const path = await handleFileUpload(newCompany.logo);
        logoUrl = supabase.storage.from('company-logos').getPublicUrl(path).data.publicUrl; // Changed from company-logos
      }

      const { error } = await supabase
        .from('plane_companies') // Changed from bus_companies
        .insert([
          {
            name: newCompany.name,
            contact_number: newCompany.contact_number,
            logo_url: logoUrl,
          },
        ]);

      if (error) throw error;

      toast({
        title: 'Sucesso!',
        description: 'Empresa de avião adicionada com sucesso', // Changed message
        className: 'bg-orange-100 border-orange-300 text-orange-700',
      });

      setNewCompany({ name: '', contact_number: '', logo: null });
      fetchCompanies();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao adicionar empresa de avião', // Changed message
        description: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (company) => {
    setEditingCompany(company);
    setNewCompany({
      name: company.name,
      contact_number: company.contact_number,
      logo: null,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to the top
    setIsGlowing(true); // Activate glow effect
    setTimeout(() => setIsGlowing(false), 2000); // Disable glow after 2 seconds
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let logoUrl = editingCompany.logo_url;
      if (newCompany.logo) {
        const path = await handleFileUpload(newCompany.logo);
        logoUrl = supabase.storage.from('company-logos').getPublicUrl(path).data.publicUrl; // Changed from company-logos
      }

      const { error } = await supabase
        .from('plane_companies') // Changed from bus_companies
        .update({
          name: newCompany.name,
          contact_number: newCompany.contact_number,
          logo_url: logoUrl,
        })
        .eq('id', editingCompany.id);

      if (error) throw error;

      toast({
        title: 'Sucesso!',
        description: 'Empresa de avião atualizada com sucesso', // Changed message
        className: 'bg-orange-100 border-orange-300 text-orange-700',
      });

      setEditingCompany(null);
      setNewCompany({ name: '', contact_number: '', logo: null });
      fetchCompanies();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar empresa de avião', // Changed message
        description: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('plane_companies') // Changed from bus_companies
        .delete()
        .eq('id', deleteCompanyId);

      if (error) throw error;

      toast({
        title: 'Sucesso!',
        description: 'Empresa de avião deletada com sucesso', // Changed message
        className: 'bg-orange-100 border-orange-300 text-orange-700',
      });

      setDeleteCompanyId(null);
      setIsDeleteDialogOpen(false);
      fetchCompanies();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao deletar empresa de avião', // Changed message
        description: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-end">
        <Button 
          className="bg-orange-600 hover:bg-orange-700 text-white"
          onClick={() => setIsAddModalOpen(true)}
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          Adicionar Empresa de Avião {/* Changed button text */}
        </Button>
      </div>
      {selectedCompany && (
        <div className="mb-4 p-4 bg-orange-50 border-b-2 border-green-500 flex justify-between items-center animate-pulse">
          <div>
            <h3 className="font-semibold text-green-600">Empresa de Avião Selecionada:</h3> {/* Changed text */}
            <p className="text-green-800 font-bold">{selectedCompany.name}</p>
          </div>
          <Button
            variant="outline"
            className="text-green-600 border-green-300 hover:bg-green-50"
            onClick={() => setSelectedCompany(null)}
          >
            Limpar Seleção
          </Button>
        </div>
      )}
      <Card className="border-orange-100">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-orange-50">
                <TableHead className="text-orange-600">Logo</TableHead>
                <TableHead className="text-orange-600">Nome</TableHead>
                <TableHead className="text-orange-600">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((empresa) => (
                <TableRow 
                  key={empresa.id}
                  onClick={() => setSelectedCompany(empresa)}
                  className={`cursor-pointer hover:bg-orange-50 ${
                    selectedCompany?.id === empresa.id ? 'bg-orange-100' : ''
                  }`}
                >
                  <TableCell>
                    {empresa.logo_url && (
                      <img
                        src={empresa.logo_url}
                        alt="Logo"
                        className="h-10 w-10 object-contain"
                      />
                    )}
                  </TableCell>
                  <TableCell>{empresa.name}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Button
                        variant="outline"
                        className="mr-2"
                        onClick={() => setShowActions(prev => ({...prev, [empresa.id]: !prev[empresa.id]}))}
                      >
                        Acções
                      </Button>
                      {showActions[empresa.id] && (
                        <>
                          <Button
                            variant="outline"
                            className="mr-2"
                            onClick={() => handleEdit(empresa)}
                          >
                            Editar
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              setDeleteCompanyId(empresa.id);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            Deletar
                          </Button>
                        </>
                      )}
                    </div>
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
                Página {currentPage} de {Math.ceil(totalCompanies / PAGE_SIZE)}
              </span>
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className={
                    currentPage * PAGE_SIZE >= totalCompanies
                      ? 'text-gray-300'
                      : 'text-orange-600'
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Empresa de Avião</DialogTitle> {/* Changed title */}
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Nome da Empresa de Avião" // Changed placeholder
                value={newCompany.name}
                onChange={(e) =>
                  setNewCompany({ ...newCompany, name: e.target.value })
                }
                required
                className="border-orange-200 focus:ring-orange-500"
              />
              <Input
                placeholder="Telefone de Contato"
                value={newCompany.contact_number}
                onChange={(e) =>
                  setNewCompany({ ...newCompany, contact_number: e.target.value })
                }
                className="border-orange-200 focus:ring-orange-500"
              />
              <Input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setNewCompany({
                    ...newCompany,
                    logo: e.target.files?.[0] || null,
                  })
                }
                className="border-orange-200 file:text-orange-600"
              />
            </div>
            <Button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700 text-white"
              disabled={loading}
            >
              {loading ? 'Adicionando...' : 'Adicionar Empresa de Avião'} {/* Changed button text */}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a empresa de avião. {/* Changed text */}
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
