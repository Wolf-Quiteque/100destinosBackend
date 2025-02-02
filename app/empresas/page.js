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

const PAGE_SIZE = 5;

export default function EmpresasPage() {
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

  useEffect(() => {
    fetchCompanies();
  }, [currentPage]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const { data, error, count } = await supabase
        .from('bus_companies')
        .select('*', { count: 'exact' })
        .range((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE - 1)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCompanies(data || []);
      setTotalCompanies(count || 0);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar empresas',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from('company-logos')
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
        logoUrl = supabase.storage.from('company-logos').getPublicUrl(path).data.publicUrl;
      }

      const { error } = await supabase
        .from('bus_companies')
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
        description: 'Empresa adicionada com sucesso',
        className: 'bg-orange-100 border-orange-300 text-orange-700',
      });

      setNewCompany({ name: '', contact_number: '', logo: null });
      fetchCompanies();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao adicionar empresa',
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
        logoUrl = supabase.storage.from('company-logos').getPublicUrl(path).data.publicUrl;
      }

      const { error } = await supabase
        .from('bus_companies')
        .update({
          name: newCompany.name,
          contact_number: newCompany.contact_number,
          logo_url: logoUrl,
        })
        .eq('id', editingCompany.id);

      if (error) throw error;

      toast({
        title: 'Sucesso!',
        description: 'Empresa atualizada com sucesso',
        className: 'bg-orange-100 border-orange-300 text-orange-700',
      });

      setEditingCompany(null);
      setNewCompany({ name: '', contact_number: '', logo: null });
      fetchCompanies();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar empresa',
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
        .from('bus_companies')
        .delete()
        .eq('id', deleteCompanyId);

      if (error) throw error;

      toast({
        title: 'Sucesso!',
        description: 'Empresa deletada com sucesso',
        className: 'bg-orange-100 border-orange-300 text-orange-700',
      });

      setDeleteCompanyId(null);
      setIsDeleteDialogOpen(false);
      fetchCompanies();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao deletar empresa',
        description: error instanceof Error ? error.message : 'Erro desconhecido',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className={`border-orange-100 ${isGlowing ? 'glow-effect' : ''}`}>
        <CardHeader>
          <CardTitle className="text-orange-600">Gerenciar Empresas de Ônibus</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={editingCompany ? handleUpdate : handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                placeholder="Nome da Empresa"
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
              {loading ? (editingCompany ? 'Atualizando...' : 'Adicionando...') : (editingCompany ? 'Atualizar Empresa' : 'Adicionar Empresa')}
            </Button>
            {editingCompany && (
              <Button
                type="button"
                className="ml-2 bg-gray-600 hover:bg-gray-700 text-white"
                onClick={() => {
                  setEditingCompany(null);
                  setNewCompany({ name: '', contact_number: '', logo: null });
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
                <TableHead className="text-orange-600">Logo</TableHead>
                <TableHead className="text-orange-600">Nome</TableHead>
                <TableHead className="text-orange-600">Telefone</TableHead>
                <TableHead className="text-orange-600">Data de Cadastro</TableHead>
                <TableHead className="text-orange-600">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.map((empresa) => (
                <TableRow key={empresa.id}>
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
                  <TableCell>{empresa.contact_number}</TableCell>
                  <TableCell>
                    {new Date(empresa.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
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
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente a empresa.
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