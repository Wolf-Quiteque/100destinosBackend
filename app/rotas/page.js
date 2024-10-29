"use client"
import React, { useState } from 'react';
import { Search, Plus, MoreVertical, Filter, MapPin, Clock, Bus,Calendar } from 'lucide-react';

const RotasPage = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const schedules = [
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
  ];

  const handleScheduleClick = (schedule) => {
    setSelectedSchedule(schedule);
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      {/* Rest of the code remains the same */}
      <div className="bg-white rounded-lg shadow-md">
        {/* Rest of the code remains the same */}
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
              {schedules.map((schedule) => (
                <tr
                  key={schedule.code}
                  className={`hover:bg-gray-50 ${
                    selectedSchedule?.code === schedule.code ? 'bg-gray-100' : ''
                  }`}
                  onClick={() => handleScheduleClick(schedule)}
                >
                  <td className="px-6 py-4 text-sm">{schedule.code}</td>
                  <td className="px-6 py-4 text-sm">{schedule.origin}</td>
                  <td className="px-6 py-4 text-sm">{schedule.destination}</td>
                  <td className="px-6 py-4 text-sm">{schedule.duration}</td>
                  <td className="px-6 py-4 text-sm">15.000 AOA</td>
                  <td className="px-6 py-4 text-sm">Diária</td>
                  <td className="px-6 py-4 text-sm">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full text-green-800 bg-green-100`}>
                      Ativa
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
        </div>

        {selectedSchedule && (
          <div className="bg-white p-4 border-t">
            <div className="flex items-center space-x-4">
              <MapPin size={24} className="text-gray-500" />
              <span className="text-lg font-medium">{selectedSchedule.origin} - {selectedSchedule.destination}</span>
            </div>
            <div className="flex items-center space-x-4 mt-2">
              <Clock size={24} className="text-gray-500" />
              <span className="text-lg font-medium">{selectedSchedule.time}</span>
            </div>
            <div className="flex items-center space-x-4 mt-2">
              <Bus size={24} className="text-gray-500" />
              <span className="text-lg font-medium">{selectedSchedule.duration}</span>
            </div>
            <div className="flex items-center space-x-4 mt-2">
              <Calendar size={24} className="text-gray-500" />
              <span className="text-lg font-medium">{selectedSchedule.date}</span>
            </div>
            <div className="flex items-center space-x-4 mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${selectedSchedule.occupancy}%` }}></div>
              </div>
              <span className="text-lg font-medium">{selectedSchedule.occupancy}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RotasPage;