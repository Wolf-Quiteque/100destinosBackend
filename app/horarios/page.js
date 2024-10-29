"use client"
import React, { useState } from 'react';
import { Search, Plus, MoreVertical, Filter, Clock, Calendar } from 'lucide-react';

const HorariosPage = () => {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestão de Horários</h1>
        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-orange-700">
          <Plus size={20} className="mr-2" />
          Novo Horário
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
                  placeholder="Pesquisar horários..."
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
              <input type="date" className="p-2 border rounded-lg" placeholder="Data" />
              <select className="p-2 border rounded-lg">
                <option>Ordenar por</option>
                <option>Horário</option>
                <option>Duração</option>
                <option>Popularidade</option>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Horário</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duração</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ocupação</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                {
                  code: "BIL-001",
                  origin: "Luanda",
                  destination: "Benguela",
                  time: "08:00",
                  duration: "6h",
                  date: "29/10/2024",
                  occupancy: 78
                },
                {
                  code: "BIL-002",
                  origin: "Benguela",
                  destination: "Huambo",
                  time: "12:00",
                  duration: "4h",
                  date: "29/10/2024",
                  occupancy: 54
                },
                {
                  code: "BIL-003",
                  origin: "Huambo",
                  destination: "Luanda",
                  time: "16:00",
                  duration: "8h",
                  date: "29/10/2024",
                  occupancy: 82
                },
                {
                  code: "BIL-004",
                  origin: "Luanda",
                  destination: "Malanje",
                  time: "07:30",
                  duration: "5h",
                  date: "30/10/2024",
                  occupancy: 68
                },
                {
                  code: "BIL-005",
                  origin: "Benguela",
                  destination: "Lubango",
                  time: "10:00",
                  duration: "7h",
                  date: "30/10/2024",
                  occupancy: 72
                }
              ].map((schedule) => (
                <tr key={schedule.code} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{schedule.code}</td>
                  <td className="px-6 py-4 text-sm">{schedule.origin}</td>
                  <td className="px-6 py-4 text-sm">{schedule.destination}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2" />
                      {schedule.time}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">{schedule.duration}</td>
                  <td className="px-6 py-4 text-sm">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2" />
                      {schedule.date}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${schedule.occupancy}%` }}></div>
                    </div>
                    <div className="text-right text-sm text-gray-500">{schedule.occupancy}%</div>
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

export default HorariosPage;