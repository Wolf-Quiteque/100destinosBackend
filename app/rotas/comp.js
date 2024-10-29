"use client"
import React, { useState } from 'react';
import { Search, Plus, MoreVertical, Filter, MapPin, Clock, Bus } from 'lucide-react';

const RotasPage = () => {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestão de Rotas</h1>
        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-orange-700">
          <Plus size={20} className="mr-2" />
          Nova Rota
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4 flex-1">
              <div className="flex items-center bg-gray-100 rounded-lg p-2 flex-1 max-w-md">
                <Search className="text-gray-400 mr-2" size={20} />
                <input
                  type="text"
                  placeholder="Pesquisar rotas..."
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
              <select className="p-2 border rounded-lg">
                <option>Cidade de Origem</option>
                <option>Luanda</option>
                <option>Benguela</option>
                <option>Huambo</option>
              </select>
              <select className="p-2 border rounded-lg">
                <option>Cidade de Destino</option>
                <option>Luanda</option>
                <option>Benguela</option>
                <option>Huambo</option>
              </select>
              <select className="p-2 border rounded-lg">
                <option>Status da Rota</option>
                <option>Ativa</option>
                <option>Inativa</option>
                <option>Em Manutenção</option>
              </select>
              <select className="p-2 border rounded-lg">
                <option>Ordenar por</option>
                <option>Popularidade</option>
                <option>Duração</option>
                <option>Preço</option>
              </select>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Origem</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Destino</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duração</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço Base</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Frequência</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                {
                  code: "RT001",
                  origin: "Luanda",
                  destination: "Benguela",
                  duration: "6h",
                  price: "15.000",
                  frequency: "Diária",
                  status: "Ativa"
                },
                {
                  code: "RT002",
                  origin: "Benguela",
                  destination: "Huambo",
                  duration: "4h",
                  price: "12.000",
                  frequency: "Ter, Qui, Sab",
                  status: "Ativa"
                },
                {
                  code: "RT003",
                  origin: "Huambo",
                  destination: "Luanda",
                  duration: "8h",
                  price: "18.000",
                  frequency: "Diária",
                  status: "Em Manutenção"
                },
                {
                  code: "RT004",
                  origin: "Luanda",
                  destination: "Malanje",
                  duration: "5h",
                  price: "13.000",
                  frequency: "Seg, Qua, Sex",
                  status: "Ativa"
                },
                {
                  code: "RT005",
                  origin: "Benguela",
                  destination: "Lubango",
                  duration: "7h",
                  price: "16.000",
                  frequency: "Diária",
                  status: "Inativa"
                }
              ].map((route) => (
                <tr key={route.code} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{route.code}</td>
                  <td className="px-6 py-4 text-sm">{route.origin}</td>
                  <td className="px-6 py-4 text-sm">{route.destination}</td>
                  <td className="px-6 py-4 text-sm">{route.duration}</td>
                  <td className="px-6 py-4 text-sm">{route.price} AOA</td>
                  <td className="px-6 py-4 text-sm">{route.frequency}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      route.status === 'Ativa' 
                        ? 'text-green-800 bg-green-100'
                        : route.status === 'Inativa'
                        ? 'text-red-800 bg-red-100'
                        : 'text-yellow-800 bg-yellow-100'
                    }`}>
                      {route.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button className="p-1 hover:bg-gray-100 rounded">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-gray-500">
              Mostrando 1-5 de 12 resultados
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 border rounded hover:bg-gray-100">Anterior</button>
              <button className="px-3 py-1 bg-orange-600 text-white rounded">1</button>
              <button className="px-3 py-1 border rounded hover:bg-gray-100">2</button>
              <button className="px-3 py-1 border rounded hover:bg-gray-100">3</button>
              <button className="px-3 py-1 border rounded hover:bg-gray-100">Próximo</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RotasPage;



