"use client"
import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Ticket, 
  Bus, 
  Users, 
  Calendar,
  Search,
  Bell,
  Menu,
  X
} from 'lucide-react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const Dashboard = () => {
  const supabase = createClientComponentClient();
  const [stats, setStats] = useState({
    ticketsSoldToday: 0,
    dailyRevenue: 0,
    tripsToday: 0,
    totalPassengers: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
    
        // Fetch today's date
        const today = new Date().toISOString().split('T')[0];

        // Fetch daily statistics
        const { data: statsData, error: statsError } = await supabase
          .rpc('get_daily_dashboard_stats', { p_date: today });

        if (statsError) throw statsError;

        setStats({
          ticketsSoldToday: statsData.tickets_sold || 0,
          dailyRevenue: parseFloat(statsData.total_revenue || '0'),
          tripsToday: statsData.trips_today || 0,
          totalPassengers: statsData.total_passengers || 0
        });

        // Fetch recent bookings
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select(`
            id, 
            booking_date, 
            booking_status, 
            passangers,
            route_id (origin, destination)
          `)
          .order('created_at', { ascending: false })
          .limit(5);

        if (bookingsError) throw bookingsError;

        setRecentBookings(bookingsData.map(booking => ({
          id: booking.id,
          passangers: JSON.parse(booking.passangers),
          route: booking.route_id,
          booking_date: booking.booking_date,
          booking_status: booking.booking_status
        })));

        setLoading(false);
    
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <main className="p-8">
        <div className="text-center text-gray-500">Carregando dados...</div>
      </main>
    );
  }

  return (
    <main className="p-8">
      <h2 className="text-2xl font-bold mb-6">Visão Geral</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Bilhetes Vendidos Hoje</p>
              <p className="text-2xl font-bold">{stats.ticketsSoldToday}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Ticket className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Receita Diária</p>
              <p className="text-2xl font-bold">
                {stats.dailyRevenue.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}
              </p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <BarChart3 className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Viagens Hoje</p>
              <p className="text-2xl font-bold">{stats.tripsToday}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Bus className="text-orange-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Passageiros</p>
              <p className="text-2xl font-bold">{stats.totalPassengers}</p>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <Users className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tickets Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h3 className="text-xl font-semibold">Bilhetes Recentes</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Passageiro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Origem</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destino</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentBookings.map(booking => (
                <tr key={booking.id}>
                  <td className="px-6 py-4 text-sm text-gray-900">#{booking.id.slice(0,5)}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {booking.passangers?.name || 'N/A'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{booking.route.origin}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{booking.route.destination}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(booking.booking_date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      booking.booking_status === 'confirmed' 
                        ? 'text-green-800 bg-green-100' 
                        : booking.booking_status === 'pending'
                        ? 'text-yellow-800 bg-yellow-100'
                        : 'text-red-800 bg-red-100'
                    }`}>
                      {booking.booking_status === 'confirmed' 
                        ? 'Confirmado' 
                        : booking.booking_status === 'pending'
                        ? 'Pendente'
                        : 'Cancelado'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;