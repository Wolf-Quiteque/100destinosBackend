"use client";
import React, { useState } from "react";
import { Search, Plus, MoreVertical, Filter } from "lucide-react";

const BilhetesPage = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [bilhetes, setBilhetes] = useState([
    {
      id: 1,
      codigo: "BIL-12024",
      passageiro: "João Silva",
      rota: "Luanda - Benguela",
      dataHora: "29/10/2024 08:00",
      preco: "15.000 AOA",
      estado: "Confirmado",
    },
    // Add more initial data if needed
  ]);

  const [newBilhete, setNewBilhete] = useState({
    codigo: "",
    passageiro: "",
    rota: "",
    dataHora: "",
    preco: "",
    estado: "Pendente",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBilhete((prev) => ({ ...prev, [name]: value }));
  };

  const addBilhete = () => {
    setBilhetes((prev) => [...prev, { ...newBilhete, id: Date.now() }]);
    setModalOpen(false);
    setNewBilhete({
      codigo: "",
      passageiro: "",
      rota: "",
      dataHora: "",
      preco: "",
      estado: "Pendente",
    });
  };

  const deleteBilhete = (id) => {
    setBilhetes((prev) => prev.filter((bilhete) => bilhete.id !== id));
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestão de Bilhetes</h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-orange-700"
        >
          <Plus size={20} className="mr-2" />
          Novo Bilhete
        </button>
      </div>

      {/* Ticket List Table */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4 flex-1">
              <div className="flex items-center bg-gray-100 rounded-lg p-2 flex-1 max-w-md">
                <Search className="text-gray-400 mr-2" size={20} />
                <input
                  type="text"
                  placeholder="Pesquisar bilhetes..."
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
                <option>Todas as Rotas</option>
                <option>Luanda - Benguela</option>
                <option>Huambo - Luanda</option>
              </select>
              <select className="p-2 border rounded-lg">
                <option>Todos os Estados</option>
                <option>Confirmado</option>
                <option>Pendente</option>
                <option>Cancelado</option>
              </select>
              <input type="date" className="p-2 border rounded-lg" placeholder="Data Inicial" />
              <input type="date" className="p-2 border rounded-lg" placeholder="Data Final" />
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Passageiro</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rota</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Data/Hora</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Preço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {bilhetes.map((bilhete) => (
                <tr key={bilhete.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm">{bilhete.codigo}</td>
                  <td className="px-6 py-4 text-sm">{bilhete.passageiro}</td>
                  <td className="px-6 py-4 text-sm">{bilhete.rota}</td>
                  <td className="px-6 py-4 text-sm">{bilhete.dataHora}</td>
                  <td className="px-6 py-4 text-sm">{bilhete.preco}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">
                      {bilhete.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button onClick={() => deleteBilhete(bilhete.id)} className="text-red-600 hover:text-red-800">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Adding New Bilhete */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg m-4 lg:m-0">
            <h2 className="text-xl font-bold mb-4">Novo Bilhete</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="codigo"
                placeholder="Código"
                value={newBilhete.codigo}
                onChange={handleInputChange}
                className="p-2 border rounded-lg w-full"
              />
              <input
                type="text"
                name="passageiro"
                placeholder="Passageiro"
                value={newBilhete.passageiro}
                onChange={handleInputChange}
                className="p-2 border rounded-lg w-full"
              />
              <input
                type="text"
                name="rota"
                placeholder="Rota"
                value={newBilhete.rota}
                onChange={handleInputChange}
                className="p-2 border rounded-lg w-full"
              />
              <input
                type="datetime-local"
                name="dataHora"
                value={newBilhete.dataHora}
                onChange={handleInputChange}
                className="p-2 border rounded-lg w-full"
              />
              <input
                type="text"
                name="preco"
                placeholder="Preço"
                value={newBilhete.preco}
                onChange={handleInputChange}
                className="p-2 border rounded-lg w-full"
              />
              <select
                name="estado"
                value={newBilhete.estado}
                onChange={handleInputChange}
                className="p-2 border rounded-lg w-full"
              >
                <option value="Pendente">Pendente</option>
                <option value="Confirmado">Confirmado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                Cancelar
              </button>
              <button onClick={addBilhete} className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BilhetesPage;
