"use client";

import React, { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const TOTAL_SEATS = 47;

// Componente Principal da Página de Rotas
const PaginaRotasDisponiveis = () => {
  const [occupiedSeats, setOccupiedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const supabase = createClientComponentClient();
  const [lastRefresh, setLastRefresh] = useState(Date.now());
  const [rotas, setRotas] = useState([]);
  const [rota, setRota] = useState([]);

  // Componente de Ocupação de Assentos
  const OcupacaoAssentos = ({ routeId, onClose }) => {
    const renderSeats = () => {
      const seats = [];
      for (let i = 1; i <= TOTAL_SEATS; i++) {
        const isOccupied = occupiedSeats.includes(i);
        if (isOccupied) {
          seats.push(
            <div
              key={i}
              className="w-10 h-16 bg-red-500 text-white border-2 rounded-md m-1 flex items-center justify-center"
            >
              {i}
            </div>
          );
        }
      }
      return seats;
    };

    return (
      <div className="p-4 bg-white">
        <div className="text-xl font-semibold text-center mb-4">
          Assentos Ocupados
        </div>
        <div className="flex flex-wrap justify-center max-w-xl mx-auto">
          {renderSeats()}
        </div>
        <Button variant="outline" className="mt-4" onClick={onClose}>
          Fechar
        </Button>
      </div>
    );
  };

  const renderSeatColumns = () => {
    const columns = [];
    const totalSeats = rota.total_seats || 47;
    const seatsPerColumn = 4;

    for (let col = 0; col < Math.ceil(totalSeats / seatsPerColumn); col++) {
      const seatColumn = [];

      for (let row = 0; row < seatsPerColumn; row++) {
        const seatNumber = col * seatsPerColumn + row + 1;

        if (seatNumber <= totalSeats) {
          if (row === 2) {
            seatColumn.push(
              <div key={`walkway-${col}`} className="h-8 bg-gray-700/30 my-2" />
            );
          }
          seatColumn.push(renderSeat(seatNumber));
        }
      }

      columns.push(
        <div key={`column-${col}`} className="flex flex-col items-center mx-1">
          {seatColumn}
        </div>
      );
    }

    return columns;
  };

  const fetchSeatAvailability = async (ticket) => {
    try {
      const { data, error } = await supabase
        .from("route_seat_availability")
        .select("*")
        .eq("route_id", ticket)
        .single();

      if (error) throw error;

      const occupiedSeats = (data?.booked_seat_numbers || [])
        .map((seat) => seat?.toString() || "")
        .filter(Boolean);
      setBookedSeats(occupiedSeats);
    } catch (error) {
      console.error("Erro ao buscar disponibilidade de assentos:", error);
      setBookedSeats([]);
    }
  };

  useEffect(() => {
    const refreshInterval = setInterval(() => {
      setLastRefresh(Date.now());
    }, 30000);

    return () => clearInterval(refreshInterval);
  }, [rota, lastRefresh]);

  const getSeatStatus = (seatNumber) => {
    const seatStr = seatNumber.toString();
    if (bookedSeats.includes(seatStr)) return "reservado";
    return "disponível";
  };

  const renderSeat = (seatNumber) => {
    const status = getSeatStatus(seatNumber);
    const seatStyles = {
      reservado: "bg-red-600/70 text-white cursor-not-allowed hover:bg-red-600/70",
      selecionado: "bg-green-500/70 hover:bg-green-500/80 text-white",
      disponível: "bg-gray-500/30 hover:bg-orange-500/50 text-white",
    };

    return (
      <Button
        key={seatNumber}
        variant="ghost"
        disabled={status === "reservado"}
        className={`w-10 h-10 m-1 rounded-md transition-all duration-300 ${seatStyles[status]}`}
      >
        {seatNumber}
      </Button>
    );
  };

  const [rotaSelecionada, setRotaSelecionada] = useState(null);

  useEffect(() => {
    async function fetchAvailableRoutes() {
      const { data, error } = await supabase
        .from("available_routes")
        .select("*");

      if (error) {
        console.error("Erro ao buscar rotas:", error);
        return;
      }

      setRotas(data || []);
    }

    fetchAvailableRoutes();
  }, [supabase]);

  const calculateOccupancyPercentage = (rota) => {
    return ((rota.total_seats - rota.available_seats) / rota.total_seats) * 100;
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
            {rotas.map((Rota) => (
              <TableRow
                key={Rota.id}
                className="cursor-pointer"
                onClick={() => {
                  setRotaSelecionada(Rota.id);
                  console.log(Rota)
                  setRota(Rota);
                  fetchSeatAvailability(Rota.id);
                }}
              >
                <TableCell>{Rota.company_name}</TableCell>
                <TableCell>{Rota.origin}</TableCell>
                <TableCell>{Rota.destination}</TableCell>
                <TableCell>{Rota.departure_time}</TableCell>
                <TableCell>{Rota.arrival_time}</TableCell>
                <TableCell>
                  <Progress
                    value={calculateOccupancyPercentage(Rota)}
                    className="w-full"
                  />
                  <div className="text-center text-sm">
                    {Rota.total_seats - Rota.available_seats} /{" "}
                    {Rota.total_seats}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <Dialog
          open={!!rotaSelecionada}
          onOpenChange={() => setRotaSelecionada(null)}
        >
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Assentos Ocupados</DialogTitle>
            </DialogHeader>
            <div className="hidden md:flex justify-center items-center">
              {renderSeatColumns()}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

export default PaginaRotasDisponiveis;
