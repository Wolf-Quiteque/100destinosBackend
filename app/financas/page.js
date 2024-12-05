'use client'
import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PainelFinanceiro() {
  const [reservas, setReservas] = useState([]);
  const [rotas, setRotas] = useState([]);
  const [receitaTotal, setReceitaTotal] = useState(0);
  const [receitaHoje, setReceitaHoje] = useState(0);
  const [carregando, setCarregando] = useState(true);
  const [mostrarHoje, setMostrarHoje] = useState(false);
  const [utilizacaoRotas, setUtilizacaoRotas] = useState([]);

  const supabase = createClientComponentClient();

  useEffect(() => {
    buscarDadosFinanceiros();
  }, []);

  const buscarDadosFinanceiros = async () => {
    try {
      const hoje = new Date().toISOString().split('T')[0];

      // Buscar todas as reservas
      const { data: dadosReservas, error: erroReservas } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      // Buscar rotas
      const { data: dadosRotas, error: erroRotas } = await supabase
        .from('bus_routes')
        .select('*');

      if (erroReservas || erroRotas) {
        console.error('Erro ao buscar dados:', erroReservas || erroRotas);
        return;
      }

      setReservas(dadosReservas || []);
      setRotas(dadosRotas || []);

      // Calcular receita total
      const receita = dadosReservas?.reduce((soma, reserva) => soma + reserva.total_price, 0) || 0;
      setReceitaTotal(receita);

      // Calcular receita de hoje
      const receitaHoje = dadosReservas
        ?.filter(reserva => reserva.booking_date === hoje)
        ?.reduce((soma, reserva) => soma + reserva.total_price, 0) || 0;
      setReceitaHoje(receitaHoje);

      // Calcular utilização das rotas
      const contagemRotas = dadosReservas.reduce((contagem, reserva) => {
        const rota = dadosRotas.find(r => r.id === reserva.route_id);
        if (rota) {
          const nomeRota = `${rota.origin} - ${rota.destination}`;
          contagem[nomeRota] = (contagem[nomeRota] || 0) + 1;
        }
        return contagem;
      }, {});

      const utilizacaoRotasArray = Object.entries(contagemRotas)
        .map(([nome, quantidade]) => ({ name: nome, value: quantidade }))
        .sort((a, b) => b.value - a.value);

      setUtilizacaoRotas(utilizacaoRotasArray);

      setCarregando(false);
    } catch (error) {
      console.error('Erro inesperado:', error);
      setCarregando(false);
    }
  };

  const COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];

  const obterDetalhesRota = (idRota) => {
    return rotas.find(rota => rota.id === idRota);
  };

  const toggleVisualizacao = () => {
    setMostrarHoje(!mostrarHoje);
  };

  if (carregando) {
    return <div className="text-orange-600 text-center py-10">Carregando...</div>;
  }

  const reservasFiltradas = mostrarHoje 
    ? reservas.filter(r => new Date(r.booking_date).toISOString().split('T')[0] === new Date().toISOString().split('T')[0])
    : reservas;

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-600 mb-6">Painel Financeiro</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-orange-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-orange-700">Receita Total</h2>
            <p className="text-2xl font-bold text-orange-600">AOA {receitaTotal.toFixed(2)}</p>
          </div>
          <div className="bg-orange-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-orange-700">Receita de Hoje</h2>
            <p className="text-2xl font-bold text-orange-600">AOA {receitaHoje.toFixed(2)}</p>
          </div>
          <div className="bg-orange-50 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-orange-700">Reservas Pendentes</h2>
            <p className="text-2xl font-bold text-orange-600">
              {reservas.filter(r => r.booking_status === 'pending').length}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Utilização de Rotas</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={utilizacaoRotas}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {utilizacaoRotas.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend layout="vertical" align="right" verticalAlign="middle" />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div>
            <Button 
              onClick={toggleVisualizacao} 
              className="mb-4 bg-orange-600 hover:bg-orange-700 text-white"
            >
              {mostrarHoje ? 'Mostrar Todas Reservas' : 'Mostrar Reservas de Hoje'}
            </Button>
          </div>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-orange-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-orange-600 uppercase tracking-wider">ID da Reserva</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-orange-600 uppercase tracking-wider">Data</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-orange-600 uppercase tracking-wider">Rota</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-orange-600 uppercase tracking-wider">Passageiros</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-orange-600 uppercase tracking-wider">Preço Total</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-orange-600 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-orange-200">
              {reservasFiltradas.map((reserva) => {
                const rota = obterDetalhesRota(reserva.route_id);
                return (
                  <tr key={reserva.id} className="hover:bg-orange-50">
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{reserva.id.slice(0,8)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(reserva.booking_date).toLocaleDateString()}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                      {rota ? `${rota.origin} - ${rota.destination}` : 'Rota Desconhecida'}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{reserva.total_passengers}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">AOA {reserva.total_price.toFixed(2)}</td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${reserva.booking_status === 'pending' ? 'bg-orange-100 text-orange-800' : 
                          reserva.booking_status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'}`}
                      >
                        {reserva.booking_status === 'pending' ? 'Pendente' : 
                          reserva.booking_status === 'confirmed' ? 'Confirmada' : 'Cancelada'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}