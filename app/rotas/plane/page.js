"use client"
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger, 
  DialogFooter 
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Trash2, 
  Edit, 
  MapPin, 
  Clock, 
  Plane, 
  Calendar 
} from 'lucide-react';

// Supabase client setup
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const RotasAviaoPage = () => {
  const supabase = createClientComponentClient();

  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isAddRouteOpen, setIsAddRouteOpen] = useState(false);
  const [newRoute, setNewRoute] = useState({
    origin: '',
    destination: '',
    departure_time: '',
    arrival_time: '',
    base_price: '',
    total_seats: '',
    flight_number: '',
    airline_code: ''
  });

  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    const { data, error } = await supabase
      .from('plane_companies')
      .select('*');
    
    if (error) {
      console.error('Error fetching companies:', error);
    } else {
      setCompanies(data);
    }
  };

  // Calculate duration from departure and arrival times
  const calculateDuration = (departure, arrival) => {
    if (!departure || !arrival) return '';
    
    const [depHours, depMins] = departure.split(':').map(Number);
    const [arrHours, arrMins] = arrival.split(':').map(Number);
    
    let totalMinutes = (arrHours * 60 + arrMins) - (depHours * 60 + depMins);
    
    // Handle overnight flights
    if (totalMinutes < 0) {
      totalMinutes += 24 * 60;
    }
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
  };

  // Fetch routes from Supabase
  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    const { data, error } = await supabase
      .from('plane_routes')
      .select('*, plane_companies(name)');
    
    if (error) {
      console.error('Error fetching routes:', error);
    } else {
      setRoutes(data);
    }
  };

  // Add new route
  const handleAddRoute = async () => {
    const duration = calculateDuration(newRoute.departure_time, newRoute.arrival_time);
    
    const { data, error } = await supabase
      .from('plane_routes')
      .insert({
        ...newRoute,
        duration: duration,
        company_id: newRoute.company_id,
        type: 'plane'
      });

    if (error) {
      console.error('Error adding route:', error);
    } else {
      fetchRoutes();
      setIsAddRouteOpen(false);
      setNewRoute({
        origin: '',
        destination: '',
        departure_time: '',
        arrival_time: '',
        base_price: '',
        total_seats: '',
        company_id: '',
        flight_number: '',
        airline_code: ''
      });
    }
  };

  // Delete route
  const handleDeleteRoute = async (routeId) => {
    const { error } = await supabase
      .from('plane_routes')
      .delete()
      .eq('id', routeId);

    if (error) {
      console.error('Error deleting route:', error);
    } else {
      fetchRoutes();
      setSelectedRoute(null);
    }
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Rotas de Avião</h1>
        <Dialog open={isAddRouteOpen} onOpenChange={setIsAddRouteOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" onClick={() => setIsAddRouteOpen(true)}>
              <Plus className="mr-2" /> Adicionar Rota
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Rota de Avião</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="company" className="text-right">Empresa</Label>
              <Select 
                value={newRoute.company_id}
                onValueChange={(value) => setNewRoute({...newRoute, company_id: value})}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleciona uma empresa" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="origin" className="text-right">Origem</Label>
                <Input 
                  id="origin" 
                  value={newRoute.origin}
                  onChange={(e) => setNewRoute({...newRoute, origin: e.target.value})}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="destination" className="text-right">Destino</Label>
                <Input 
                  id="destination" 
                  value={newRoute.destination}
                  onChange={(e) => setNewRoute({...newRoute, destination: e.target.value})}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="departure_time" className="text-right">Hora de Partida</Label>
                <Input 
                  type="time"
                  id="departure_time" 
                  value={newRoute.departure_time}
                  onChange={(e) => setNewRoute({...newRoute, departure_time: e.target.value})}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="arrival_time" className="text-right">Hora de Chegada</Label>
                <Input 
                  type="time"
                  id="arrival_time" 
                  value={newRoute.arrival_time}
                  onChange={(e) => setNewRoute({...newRoute, arrival_time: e.target.value})}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="base_price" className="text-right">Preço Base</Label>
                <Input 
                  type="number"
                  id="base_price" 
                  value={newRoute.base_price}
                  onChange={(e) => setNewRoute({...newRoute, base_price: e.target.value})}
                  placeholder="Preço em AOA"
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="total_seats" className="text-right">Total de Assentos</Label>
                <Input 
                  type="number"
                  id="total_seats" 
                  value={newRoute.total_seats}
                  onChange={(e) => setNewRoute({...newRoute, total_seats: e.target.value})}
                  placeholder="Número de assentos"
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="flight_number" className="text-right">Número do Voo</Label>
                <Input 
                  id="flight_number" 
                  value={newRoute.flight_number}
                  onChange={(e) => setNewRoute({...newRoute, flight_number: e.target.value})}
                  placeholder="Ex: TP123"
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="airline_code" className="text-right">Código da Companhia Aérea</Label>
                <Input 
                  id="airline_code" 
                  value={newRoute.airline_code}
                  onChange={(e) => setNewRoute({...newRoute, airline_code: e.target.value})}
                  placeholder="Ex: TAAG"
                  className="col-span-3" 
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" onClick={handleAddRoute}>Adicionar Rota</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Origem</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destino</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Partida</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chegada</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duração</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Voo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {routes.map((route) => (
                <tr
                  key={route.id}
                  className={`hover:bg-gray-50 ${
                    selectedRoute?.id === route.id ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => setSelectedRoute(route)}
                >
                  <td className="px-6 py-4 text-sm">{route.origin}</td>
                  <td className="px-6 py-4 text-sm">{route.destination}</td>
                  <td className="px-6 py-4 text-sm">{route.departure_time}</td>
                  <td className="px-6 py-4 text-sm">{route.arrival_time}</td>
                  <td className="px-6 py-4 text-sm">{route.duration}</td>
                  <td className="px-6 py-4 text-sm">{route.flight_number} ({route.airline_code})</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteRoute(route.id);
                        }}
                      >
                        <Trash2 size={16} className="text-red-500" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedRoute && (
          <div className="bg-white p-4 border-t">
            <div className="flex items-center space-x-4">
              <MapPin size={24} className="text-gray-500" />
              <span className="text-lg font-medium">{selectedRoute.origin} - {selectedRoute.destination}</span>
            </div>
            <div className="flex items-center space-x-4 mt-2">
              <Clock size={24} className="text-gray-500" />
              <span className="text-lg font-medium">{selectedRoute.departure_time} - {selectedRoute.arrival_time}</span>
            </div>
            <div className="flex items-center space-x-4 mt-2">
              <Plane size={24} className="text-gray-500" />
              <span className="text-lg font-medium">{selectedRoute.duration}</span>
            </div>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-lg font-medium">Preço Base: {selectedRoute.base_price} AOA</span>
            </div>
            <div className="flex items-center space-x-4 mt-2">
              <span className="text-lg font-medium">Voo: {selectedRoute.flight_number} ({selectedRoute.airline_code})</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RotasAviaoPage;