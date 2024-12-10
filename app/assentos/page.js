
"use client"
import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

// Constant for total seats
const TOTAL_SEATS = 47;

// Bus Seats Occupancy Component
const AssentosOnibus = ({ routeId, onClose }) => {
  const [occupiedSeats, setOccupiedSeats] = useState(0);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function buscarAssentosOcupados() {
      const { data, error } = await supabase
        .from('passenger_bookings')
        .select('seat_number')
        .eq('route_id', routeId)
        .eq('status', 'confirmed');

      if (error) {
        console.error('Erro ao buscar assentos ocupados:', error);
        return;
      }

      setOccupiedSeats(data.length || 0);
    }

    buscarAssentosOcupados();
  }, [routeId]);

  // Generate seat grid
  const renderSeats = () => {
    const seats = [];
    for (let i = 1; i <= TOTAL_SEATS; i++) {
      const isOccupied = i <= occupiedSeats;
      seats.push(
        <div
          key={i}
          className={`w-10 h-16 border-2 rounded-md m-1 flex items-center justify-center 
          ${isOccupied ? 'bg-red-500 text-white' : 'bg-green-500 text-white'} 
          transition-colors duration-300 ease-in-out`}
        >
          {i}
        </div>
      );
    }
    return seats;
  };

  return (
    <div className="p-4">
      <div className="flex flex-col items-center">
        <div className="text-xl mb-4">
          <span className="font-semibold">Total de Assentos:</span> {TOTAL_SEATS} 
          <span className="ml-4 font-semibold">Assentos Ocupados:</span> 
          <span className="text-red-600">{occupiedSeats}</span>
        </div>
        
        <div className="flex flex-wrap justify-center max-w-xl">
          {renderSeats()}
        </div>
        
        <Button 
          variant="outline" 
          className="mt-4" 
          onClick={onClose}
        >
          Fechar
        </Button>
      </div>
    </div>
  );
};

// Main Routes Page Component
const PaginaRotasDisponiveis = () => {
  const [rotas, setRotas] = useState([]);
  const [rotaSelecionada, setRotaSelecionada] = useState(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function buscarRotasDisponiveis() {
      const { data, error } = await supabase
        .from('available_routes')
        .select('*');

      if (error) {
        console.error('Erro ao buscar rotas:', error);
        return;
      }

      setRotas(data || []);
    }

    buscarRotasDisponiveis();
  }, []);

  const calcularPorcentagemOcupacao = (availableSeats) => {
    return ((TOTAL_SEATS - availableSeats) / TOTAL_SEATS) * 100;
  };

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Rotas de Ônibus Disponíveis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Empresa</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead>Destino</TableHead>
              <TableHead>Horário de Partida</TableHead>
              <TableHead>Horário de Chegada</TableHead>
              <TableHead>Ocupação</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rotas.map((rota) => (
              <TableRow key={rota.id}>
                <TableCell>{rota.company_name}</TableCell>
                <TableCell>{rota.origin}</TableCell>
                <TableCell>{rota.destination}</TableCell>
                <TableCell>{rota.departure_time}</TableCell>
                <TableCell>{rota.arrival_time}</TableCell>
                <TableCell>
                  <Progress 
                    value={calcularPorcentagemOcupacao(rota.available_seats)} 
                    className="w-full"
                  />
                  <div className="text-center text-sm">
                    {TOTAL_SEATS - rota.available_seats} / {TOTAL_SEATS}
                  </div>
                </TableCell>
             
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Dialog for Seat Occupancy */}
        <Dialog 
          open={!!rotaSelecionada} 
          onOpenChange={() => setRotaSelecionada(null)}
        >
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Detalhes dos Assentos</DialogTitle>
            </DialogHeader>
            {rotaSelecionada && (
              <AssentosOnibus 
                routeId={rotaSelecionada} 
                onClose={() => setRotaSelecionada(null)} 
              />
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PaginaRotasDisponiveis;
