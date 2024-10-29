
"use client"
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

const Dashboard = () => {

  return (
        <main className="p-8">
          <h2 className="text-2xl font-bold mb-6">Visão Geral</h2>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Bilhetes Vendidos Hoje</p>
                  <p className="text-2xl font-bold">247</p>
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
                  <p className="text-2xl font-bold">32.450 AOA</p>
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
                  <p className="text-2xl font-bold">18</p>
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
                  <p className="text-2xl font-bold">1.247</p>
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
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">#12345</td>
                    <td className="px-6 py-4 text-sm text-gray-900">João Silva</td>
                    <td className="px-6 py-4 text-sm text-gray-900">Luanda</td>
                    <td className="px-6 py-4 text-sm text-gray-900">Benguela</td>
                    <td className="px-6 py-4 text-sm text-gray-900">29/10/2024</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                        Confirmado
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">#12344</td>
                    <td className="px-6 py-4 text-sm text-gray-900">Maria Santos</td>
                    <td className="px-6 py-4 text-sm text-gray-900">Huambo</td>
                    <td className="px-6 py-4 text-sm text-gray-900">Luanda</td>
                    <td className="px-6 py-4 text-sm text-gray-900">29/10/2024</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-semibold text-yellow-800 bg-yellow-100 rounded-full">
                        Pendente
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </main>
  );
};

export default Dashboard;