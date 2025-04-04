"use client"
import React, { useState, useEffect, useMemo } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Search, Plus, Filter, Trash2 } from "lucide-react";

const BookingsPage = () => {
  const supabase = createClientComponentClient();

  const [bookings, setBookings] = useState([]);
  const [routes, setRoutes] = useState({});
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0
  });

  const ITEMS_PER_PAGE = 5;

  useEffect(() => {
    console.log("try something else")
    const fetchBookings = async () => {
      console.log("hello")
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        const parsedBookings = data.map(booking => ({
          ...booking,
          passengers: typeof booking.passengers === 'string' 
            ? JSON.parse(booking.passengers) 
            : booking.passengers,
          passenger_details: typeof booking.passenger_details === 'string'
            ? JSON.parse(booking.passenger_details)
            : booking.passenger_details
        }));
        setBookings(parsedBookings);
      }
      if (error) console.error('Error fetching bookings:', error);
    };

    const fetchRoutes = async () => {
      const { data, error } = await supabase
        .from('bus_routes')
        .select('id, origin, destination');

      if (data) {
        const routeMap = data.reduce((acc, route) => ({
          ...acc, 
          [route.id]: { origin: route.origin, destination: route.destination }
        }), {});
        setRoutes(routeMap);
      }
      if (error) console.error('Error fetching routes:', error);
    };

    fetchBookings();
    fetchRoutes();

    const bookingsSubscription = supabase
      .channel('bookings')
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'bookings' },
        fetchBookings
      )
      .subscribe();

    return () => {
      supabase.removeChannel(bookingsSubscription);
    };
  }, []);

  useEffect(() => {
    const calculateStats = () => {
      setStats({
        total: bookings.length,
        pending: bookings.filter(b => b.booking_status === 'pending').length,
        confirmed: bookings.filter(b => b.booking_status === 'confirmed').length
      });
    };

    calculateStats();
  }, [bookings]);

  const deleteBooking = async (id) => {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', id);

    if (error) console.error('Error deleting booking:', error);
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      // Normalize search term
      const normalizedSearchTerm = searchTerm.toLowerCase().trim();
  
      // Check if any passenger matches the search criteria
    const passengerMatch = booking.passengers.some(passenger => {
      // Match by name (partial or full) - Added safety checks
      const nameMatch = (passenger.name?.toLowerCase() ?? '').includes(normalizedSearchTerm);
  
      // Exact match for ID number
      const idNumberMatch = passenger.idNumber === normalizedSearchTerm;
  
      // Exact match for ticket ID - Added safety checks
      const ticketIdMatch = (passenger.ticketId?.toLowerCase() ?? '') === normalizedSearchTerm;
  
        return nameMatch || idNumberMatch || ticketIdMatch;
      });
  
      // Additional booking-level searches
      const bookingLevelMatch = 
        normalizedSearchTerm === "" || 
        booking.contact_phone?.toLowerCase().includes(normalizedSearchTerm) ||
        booking.contact_email?.toLowerCase().includes(normalizedSearchTerm) ||
        (booking.id?.toLowerCase() ?? '').includes(normalizedSearchTerm); // Added safety check for booking.id
  
      // Status filter
      const matchesStatus = statusFilter === "" || booking.booking_status === statusFilter;
  
      return (passengerMatch || bookingLevelMatch) && matchesStatus;
    });
  }, [bookings, searchTerm, statusFilter]);
  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBookings.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredBookings, currentPage]);

  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestão de Reservas</h1>
        <div className="flex space-x-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Total Reservas</p>
            <p className="text-xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow">
            <p className="text-sm text-yellow-600">Pendentes</p>
            <p className="text-xl font-bold text-yellow-800">{stats.pending}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow">
            <p className="text-sm text-green-600">Confirmadas</p>
            <p className="text-xl font-bold text-green-800">{stats.confirmed}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4 flex-1">
              <div className="flex items-center bg-gray-100 rounded-lg p-2 flex-1 max-w-md">
                <Search className="text-gray-400 mr-2" size={20} />
                <input
  type="text"
  placeholder="Pesquisar (nome, ID passageiro, bilhete, telefone, email)..."
  value={searchTerm}
  onChange={(e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }}
  className="bg-transparent border-none focus:outline-none w-full"
/>

                
              </div>
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg flex items-center"
              >
                <Filter size={20} className="mr-2" />
                Filtros
              </button>
            </div>
          </div>

          {filterOpen && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <select 
                value={statusFilter} 
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="p-2 border rounded-lg"
              >
                <option value="">Todos os Estados</option>
                <option value="pending">Pendente</option>
                <option value="confirmed">Confirmado</option>
                <option value="cancelled">Cancelado</option>
              </select>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rota</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Passageiro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Detalhes</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedBookings.map((booking) => {
                const route = routes[booking.route_id] || { origin: 'N/A', destination: 'N/A' };
                return (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">
                      {route.origin} - {route.destination}
                    </td>
                    <td className="px-6 py-4 text-sm">
  {booking.passengers.map(passenger => passenger.name).join(', ') || 'N/A'}
</td>
                    <td className="px-6 py-4 text-sm">
                      {booking.contact_phone} / {booking.contact_email}
                    </td>
                    <td className="px-6 py-4 text-sm">{booking.booking_date}</td>
                    <td className="px-6 py-4 text-sm">{booking.total_price.toLocaleString()} AOA</td>
                    <td className="px-6 py-4 text-sm">
                      <span 
                        className={`px-2 py-1 text-xs font-semibold rounded-full 
                        ${booking.booking_status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          booking.booking_status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                          'bg-red-100 text-red-800'}`}
                      >
                        {booking.booking_status == 'confirmed' ? 'confirmado':'pendente'}
                      </span>
                    </td>
                 
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center p-4 space-x-2">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Anterior
          </button>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;
