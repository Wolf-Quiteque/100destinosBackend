"use client"

import React, { useState } from 'react';
import { Search, UserPlus, MoreVertical, Filter } from 'lucide-react';

const PassageirosPage = () => {
  const [filterOpen, setFilterOpen] = useState(false);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestão de Passageiros</h1>
        <button className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-orange-700">
          <UserPlus size={20} className="mr-2" />
          Novo Passageiro
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
                  placeholder="Pesquisar passageiros..."
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <select className="p-2 border rounded-lg">
                <option>Todas as Cidades</option>
                <option>Luanda</option>
                <option>Benguela</option>
                <option>Huambo</option>
              </select>
              <select className="p-2 border rounded-lg">
                <option>Status do Cliente</option>
                <option>Regular</option>
                <option>VIP</option>
              </select>
              <select className="p-2 border rounded-lg">
                <option>Ordenar por</option>
                <option>Nome</option>
                <option>Viagens realizadas</option>
                <option>Data de registro</option>
              </select>
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Documento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cidade</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Viagens</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[1, 2, 3, 4, 5].map((item) => (
                <tr key={item} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">PSG-{item}2024</td>
                  <td className="px-6 py-4 text-sm">Ana Maria Silva</td>
                  <td className="px-6 py-4 text-sm">BI 123456789LA{item}2</td>
                  <td className="px-6 py-4 text-sm">Luanda</td>
                  <td className="px-6 py-4 text-sm">{item * 3}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      item % 2 === 0 
                        ? 'text-purple-800 bg-purple-100' 
                        : 'text-blue-800 bg-blue-100'
                    }`}>
                      {item % 2 === 0 ? 'VIP' : 'Regular'}
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
              Mostrando 1-5 de 50 resultados
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

export default PassageirosPage;