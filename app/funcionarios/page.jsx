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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PAGE_SIZE = 5;

export default function EmployeesPage() {
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const [employees, setEmployees] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    email: '',
    address: '',
    phone_number: '',
    id_number: '',
    role: '',
    company_id: '',
  });
  const [loading, setLoading] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [deleteEmployeeId, setDeleteEmployeeId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchEmployees();
    fetchCompanies();
  }, [currentPage]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const { data, error, count } = await supabase
        .from('employees')
        .select('*, bus_companies(name)', { count: 'exact' })
        .range((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE - 1)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmployees(data || []);
      setTotalEmployees(count || 0);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao carregar funcionários',
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
      // Create user in Supabase Auth with metadata
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newEmployee.email,
        password: '100destinos2025', // Default password
        options: {
          data: {
            name: newEmployee.name, // Save name in metadata
            role: newEmployee.role, // Save role in metadata
            company_id: newEmployee.company_id, // Save company_id in metadata
          },
        },
      });
  
      if (authError) throw authError;
  
      // Insert employee into the database
      const { error } = await supabase
        .from('employees')
        .insert([
          {
            name: newEmployee.name,
            email: newEmployee.email,
            address: newEmployee.address,
            phone_number: newEmployee.phone_number,
            id_number: newEmployee.id_number,
            role: newEmployee.role,
            company_id: newEmployee.company_id,
            user_id: authData.user.id, // Link to Supabase Auth user
          },
        ]);
  
      if (error) throw error;
  
      toast({
        title: 'Sucesso!',
        description: 'Funcionário adicionado com sucesso',
        className: 'bg-orange-100 border-orange-300 text-orange-700',
      });
  
      // Reset form fields
      setNewEmployee({
        name: '',
        email: '',
        address: '',
        phone_number: '',
        id_number: '',
        role: '',
        company_id: '',
      });
  
      setIsModalOpen(false);
      fetchEmployees();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao adicionar funcionário',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };
  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setNewEmployee({
      name: employee.name,
      email: employee.email,
      address: employee.address,
      phone_number: employee.phone_number,
      id_number: employee.id_number,
      role: employee.role,
      company_id: employee.company_id,
    });
    setIsModalOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('employees')
        .update({
          name: newEmployee.name,
          email: newEmployee.email,
          address: newEmployee.address,
          phone_number: newEmployee.phone_number,
          id_number: newEmployee.id_number,
          role: newEmployee.role,
          company_id: newEmployee.company_id,
        })
        .eq('id', editingEmployee.id);

      if (error) throw error;

      toast({
        title: 'Sucesso!',
        description: 'Funcionário atualizado com sucesso',
        className: 'bg-orange-100 border-orange-300 text-orange-700',
      });

      setEditingEmployee(null);
      setNewEmployee({
        name: '',
        email: '',
        address: '',
        phone_number: '',
        id_number: '',
        role: '',
        company_id: '',
      });
      setIsModalOpen(false);
      fetchEmployees();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao atualizar funcionário',
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
        .from('employees')
        .delete()
        .eq('id', deleteEmployeeId);

      if (error) throw error;

      toast({
        title: 'Sucesso!',
        description: 'Funcionário deletado com sucesso',
        className: 'bg-orange-100 border-orange-300 text-orange-700',
      });

      setDeleteEmployeeId(null);
      setIsDeleteDialogOpen(false);
      fetchEmployees();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Erro ao deletar funcionário',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card className="border-orange-100">
        <CardHeader>
          <CardTitle className="text-orange-600">Gerenciar Funcionários</CardTitle>
        </CardHeader>
        <CardContent>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                Adicionar Funcionário
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingEmployee ? 'Editar Funcionário' : 'Adicionar Funcionário'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={editingEmployee ? handleUpdate : handleSubmit} className="space-y-4">
                <Input
                  placeholder="Nome Completo"
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  required
                  className="border-orange-200 focus:ring-orange-500"
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={newEmployee.email}
                  onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                  required
                  className="border-orange-200 focus:ring-orange-500"
                />
                <Input
                  placeholder="Endereço"
                  value={newEmployee.address}
                  onChange={(e) => setNewEmployee({ ...newEmployee, address: e.target.value })}
                  required
                  className="border-orange-200 focus:ring-orange-500"
                />
                <Input
                  placeholder="Número de Telefone"
                  value={newEmployee.phone_number}
                  onChange={(e) => setNewEmployee({ ...newEmployee, phone_number: e.target.value })}
                  required
                  className="border-orange-200 focus:ring-orange-500"
                />
                <Input
                  placeholder="Nº BI"
                  value={newEmployee.id_number}
                  onChange={(e) => setNewEmployee({ ...newEmployee, id_number: e.target.value })}
                  required
                  className="border-orange-200 focus:ring-orange-500"
                  
                />
                <Select
                  value={newEmployee.role}
                  onValueChange={(value) => setNewEmployee({ ...newEmployee, role: value })}
                >
                  <SelectTrigger className="border-orange-200">
                    <SelectValue placeholder="Selecione o Cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="driver">Motorista</SelectItem>
                    <SelectItem value="supervisor">Supervisor de Ônibus</SelectItem>
                    <SelectItem value="accountant">Finançerio</SelectItem>
                    <SelectItem value="admin">Administrador</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={newEmployee.company_id}
                  onValueChange={(value) => setNewEmployee({ ...newEmployee, company_id: value })}
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
                  className="bg-orange-600 hover:bg-orange-700 text-white w-full"
                  disabled={loading}
                >
                  {loading ? (editingEmployee ? 'Atualizando...' : 'Adicionando...') : (editingEmployee ? 'Atualizar Funcionário' : 'Adicionar Funcionário')}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      <Card className="border-orange-100">
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-orange-50">
                <TableHead className="text-orange-600">Nome</TableHead>
                <TableHead className="text-orange-600">Email</TableHead>
                <TableHead className="text-orange-600">Cargo</TableHead>
                <TableHead className="text-orange-600">Empresa</TableHead>
                <TableHead className="text-orange-600">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell>{employee.name}</TableCell>
                  <TableCell>{employee.email}</TableCell>
                  <TableCell>
                    {employee.role === 'driver' && 'Motorista'}
                    {employee.role === 'supervisor' && 'Supervisor de Ônibus'}
                    {employee.role === 'mechanic' && 'Mecânico'}
                    {employee.role === 'admin' && 'Administrador'}
                  </TableCell>
                  <TableCell>{employee.bus_companies?.name}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      className="mr-2"
                      onClick={() => handleEdit(employee)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setDeleteEmployeeId(employee.id);
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
                Página {currentPage} de {Math.ceil(totalEmployees / PAGE_SIZE)}
              </span>
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className={currentPage * PAGE_SIZE >= totalEmployees ? 'text-gray-300' : 'text-orange-600'}
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
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o funcionário.
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