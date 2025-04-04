"use client"
import React, { useState, useEffect, useMemo } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useParams } from 'next/navigation'; // Import useParams
import { Search, Filter } from "lucide-react";

const CompanyBookingsPage = () => {
  const supabase = createClientComponentClient();
  const params = useParams(); // Get route parameters
  const companyId = params.id; // Extract company ID

  const [bookings, setBookings] = useState([]);
  const [companyRoutes, setCompanyRoutes] = useState({}); // Routes specific to the company
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0
  });
  const [loading, setLoading] = useState(true);
  const [companyName, setCompanyName] = useState(''); // To display company name

  const ITEMS_PER_PAGE = 10; // Adjusted items per page

  useEffect(() => {
    if (companyId) {
      fetchCompanyData();
      fetchCompanyName();
    } else {
      setLoading(false);
    }
  }, [companyId]); // Re-run if companyId changes

  const fetchCompanyName = async () => {
    const { data, error } = await supabase
      .from('companies')
      .select('name')
      .eq('id', companyId)
      .single();

    if (error) {
      console.error('Erro ao buscar nome da empresa:', error);
    } else if (data) {
      setCompanyName(data.name);
    }
  };

  const fetchCompanyData = async () => {
    setLoading(true);
    try {
      // 1. Fetch routes for the specific company
      const { data: routesData, error: routesError } = await supabase
        .from('bus_routes')
        .select('id, origin, destination')
        .eq('company_id', companyId);

      if (routesError) {
        console.error('Error fetching company routes:', routesError);
        setLoading(false);
        return;
      }

      const routeMap = routesData?.reduce((acc, route) => ({
        ...acc,
        [route.id]: { origin: route.origin, destination: route.destination }
      }), {}) || {};
      setCompanyRoutes(routeMap);

      const routeIds = routesData?.map(route => route.id) || [];

      if (routeIds.length === 0) {
        // No routes for this company, so no bookings
        setBookings([]);
        setLoading(false);
        return;
      }

      // 2. Fetch bookings for those routes
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .in('route_id', routeIds) // Filter by the company's route IDs
        .order('created_at', { ascending: false });

      if (bookingsError) {
        console.error('Error fetching company bookings:', bookingsError);
        setLoading(false);
        return;
      }

      if (bookingsData) {
        const parsedBookings = bookingsData.map(booking => ({
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

      // Setup real-time subscription for company bookings
      const bookingsSubscription = supabase
        .channel(`company-bookings-${companyId}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'bookings', filter: `route_id=in.(${routeIds.join(',')})` },
          (payload) => {
            console.log('Change received!', payload);
            // Re-fetch data on change
            fetchCompanyData();
          }
        )
        .subscribe();

      // Cleanup function
      // return () => {
      //   supabase.removeChannel(bookingsSubscription);
      // };

    } catch (error) {
      console.error('Unexpected error fetching company data:', error);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    // Calculate stats based on the fetched (already filtered) bookings
    const calculateStats = () => {
      setStats({
        total: bookings.length,
        pending: bookings.filter(b => b.booking_status === 'pending').length,
        confirmed: bookings.filter(b => b.booking_status === 'confirmed').length
      });
    };
    calculateStats();
  }, [bookings]); // Recalculate stats when bookings change

  // Filtering logic remains largely the same, but operates on the company's bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter(booking => {
      const normalizedSearchTerm = searchTerm.toLowerCase().trim();
      const passengerMatch = booking.passengers?.some(passenger => // Added safety check for passengers array
        (passenger.name?.toLowerCase() ?? '').includes(normalizedSearchTerm) ||
        passenger.idNumber === normalizedSearchTerm ||
        (passenger.ticketId?.toLowerCase() ?? '') === normalizedSearchTerm
      ) ?? false; // Default to false if passengers is null/undefined

      const bookingLevelMatch =
        normalizedSearchTerm === "" ||
        booking.contact_phone?.toLowerCase().includes(normalizedSearchTerm) ||
        booking.contact_email?.toLowerCase().includes(normalizedSearchTerm) ||
        (booking.id?.toLowerCase() ?? '').includes(normalizedSearchTerm);

      const matchesStatus = statusFilter === "" || booking.booking_status === statusFilter;

      return (passengerMatch || bookingLevelMatch) && matchesStatus;
    });
  }, [bookings, searchTerm, statusFilter]);

  const paginatedBookings = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredBookings.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredBookings, currentPage]);

  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);

  if (loading) {
    return <div className="text-center py-10 text-orange-600">Carregando bilhetes da empresa...</div>;
  }

  if (!companyId) {
    return <div className="text-red-600 text-center py-10">ID da empresa não encontrado.</div>;
  }

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Gestão de Bilhetes {companyName ? `- ${companyName}` : ''}
        </h1>
        <div className="flex space-x-4">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Total Bilhetes (Empresa)</p>
            <p className="text-xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow">
            <p className="text-sm text-yellow-600">Pendentes (Empresa)</p>
            <p className="text-xl font-bold text-yellow-800">{stats.pending}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow">
            <p className="text-sm text-green-600">Confirmados (Empresa)</p>
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
                    setCurrentPage(1); // Reset page on search
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
                  setCurrentPage(1); // Reset page on filter change
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
          {bookings.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID Bilhete</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rota</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Passageiro(s)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contacto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data Reserva</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginatedBookings.map((booking) => {
                  const route = companyRoutes[booking.route_id] || { origin: 'N/A', destination: 'N/A' };
                  return (
                    <tr key={booking.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm whitespace-nowrap">{booking.id.slice(0, 8)}...</td>
                      <td className="px-6 py-4 text-sm">
                        {route.origin} - {route.destination}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {booking.passengers?.map(p => p.name).join(', ') || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {booking.contact_phone || 'N/A'} <br /> {booking.contact_email || 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">{new Date(booking.booking_date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">{booking.total_price.toLocaleString()} AOA</td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full
                          ${booking.booking_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            booking.booking_status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'}`}
                        >
                          {booking.booking_status === 'pending' ? 'Pendente' :
                           booking.booking_status === 'confirmed' ? 'Confirmado' : 'Cancelado'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
             <p className="text-center text-gray-500 py-10">Nenhum bilhete encontrado para esta empresa.</p>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center p-4 space-x-2 border-t border-gray-200">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 disabled:cursor-not-allowed"
            >
              Anterior
            </button>
            <span className="text-sm text-gray-600">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50 hover:bg-gray-300 disabled:cursor-not-allowed"
            >
              Próximo
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyBookingsPage;
