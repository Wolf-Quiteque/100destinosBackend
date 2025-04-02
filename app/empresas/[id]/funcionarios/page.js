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

export default function FuncionariosPage() {
  const { id } = useParams();
  const { selectedCompany } = useContext(SelectedCompanyContext);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  const supabase = createClientComponentClient();

  const fetchEmployees = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('company_id', id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveEmployee = async (employeeData) => {
    try {
      if (currentEmployee) {
        // Update existing employee
        const { error } = await supabase
          .from('employees')
          .update(employeeData)
          .eq('id', currentEmployee.id);
        if (error) throw error;
      } else {
        // Create new employee
        const { error } = await supabase
          .from('employees')
          .insert([{ ...employeeData, company_id: id }]);
        if (error) throw error;
      }
      fetchEmployees();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', employeeId);
      if (error) throw error;
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [id]);

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 p-4 bg-orange-50 border-b-2 border-green-500">
        <h2 className="text-xl font-semibold text-green-600">
          Funcionários da Empresa: {selectedCompany?.name}
        </h2>
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <Button 
            className="bg-orange-600 hover:bg-orange-700"
            onClick={() => {
              setCurrentEmployee(null);
              setIsDialogOpen(true);
            }}
          >
            Adicionar Funcionário
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p>Carregando...</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Função</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>{employee.name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.phone_number}</TableCell>
                    <TableCell>{employee.role}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setCurrentEmployee(employee);
                          setIsDialogOpen(true);
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        className="text-red-500"
                        onClick={() => handleDeleteEmployee(employee.id)}
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
            <DialogTitle>{currentEmployee ? 'Editar Funcionário' : 'Adicionar Funcionário'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            handleSaveEmployee({
              name: formData.get('name'),
              email: formData.get('email'),
              address: formData.get('address'),
              phone_number: formData.get('phone_number'),
              id_number: formData.get('id_number'),
              role: formData.get('role'),
            });
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={currentEmployee?.name}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={currentEmployee?.email}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  name="address"
                  defaultValue={currentEmployee?.address}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone_number">Telefone</Label>
                <Input
                  id="phone_number"
                  name="phone_number"
                  defaultValue={currentEmployee?.phone_number}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="id_number">Número de Identificação</Label>
                <Input
                  id="id_number"
                  name="id_number"
                  defaultValue={currentEmployee?.id_number}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role">Função</Label>
                <Input
                  id="role"
                  name="role"
                  defaultValue={currentEmployee?.role}
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
