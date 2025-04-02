'use client';

import { useEffect, useState, useContext } from 'react';
import { useParams } from 'next/navigation';
import { SelectedCompanyContext } from '../../../context/SelectedCompanyContext';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function EditarPage() {
  const { id } = useParams();
  const { selectedCompany } = useContext(SelectedCompanyContext);
  const [company, setCompany] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [logoFile, setLogoFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const supabase = createClientComponentClient();
  const { toast } = useToast();

  const fetchCompany = async () => {
    try {
      const { data, error } = await supabase
        .from('bus_companies')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setCompany(data);
    } catch (error) {
      console.error('Error fetching company:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados da empresa',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogoUpload = async () => {
    if (!logoFile) return;

    setUploading(true);
    try {
      const fileExt = logoFile.name.split('.').pop();
      const fileName = `${id}-logo.${fileExt}`;
      const filePath = `logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('company-logos')
        .upload(filePath, logoFile);

      if (uploadError) throw uploadError;

      // Get public URL for the uploaded file
      const { data: urlData } = supabase.storage
        .from('company-logos')
        .getPublicUrl(filePath);

      return urlData.publicUrl;
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao carregar o logo',
        variant: 'destructive',
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      let logoUrl = company.logo_url;
      if (logoFile) {
        logoUrl = await handleLogoUpload();
        if (!logoUrl) return;
      }

      const { error } = await supabase
        .from('bus_companies')
        .update({
          name: formData.get('name'),
          contact_number: formData.get('contact_number'),
          logo_url: logoUrl,
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'Sucesso',
        description: 'Informações da empresa atualizadas com sucesso',
      });
      fetchCompany();
    } catch (error) {
      console.error('Error saving company:', error);
      toast({
        title: 'Erro',
        description: 'Falha ao atualizar informações da empresa',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    fetchCompany();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <p>Carregando...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 p-4 bg-orange-50 border-b-2 border-green-500">
        <h2 className="text-xl font-semibold text-green-600">
          Editar Informações da Empresa: {selectedCompany?.name}
        </h2>
      </div>
      <Card>
        <CardHeader>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome da Empresa</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={company?.name}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_number">Telefone de Contato</Label>
                <Input
                  id="contact_number"
                  name="contact_number"
                  defaultValue={company?.contact_number}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">Logo da Empresa</Label>
                <Input
                  id="logo"
                  name="logo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLogoFile(e.target.files[0])}
                />
                {company.logo_url && (
                  <div className="mt-2">
                    <p>Logo atual:</p>
                    <img
                      src={company.logo_url}
                      alt="Logo da Empresa"
                      className="h-20 w-auto"
                    />
                  </div>
                )}
              </div>
            </div>
            <Button
              type="submit"
              className="bg-orange-600 hover:bg-orange-700"
              disabled={uploading}
            >
              {uploading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
