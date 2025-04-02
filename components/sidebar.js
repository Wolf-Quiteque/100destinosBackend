import React, { useContext } from 'react'
import { 
    BarChart3, 
    Ticket, 
    Bus, 
    Users, 
    Calendar,
    Menu,
    X
  } from 'lucide-react';
import { SelectedCompanyContext } from '../app/context/SelectedCompanyContext';

  
function Sidebar({ isSidebarOpen, toggleSidebar }) {
  const { selectedCompany } = useContext(SelectedCompanyContext);
  return (
    <div className={`fixed left-0 h-full bg-orange-600 text-white transition-all duration-300 ease-in-out ${
        isSidebarOpen ? 'w-64' : 'w-20'
      }`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className={`text-2xl font-bold transition-opacity duration-300 ${
              isSidebarOpen ? 'opacity-100' : 'opacity-0'
            }`}>
              TransBus
            </h1>
          </div>
          {isSidebarOpen && (
            <div className="mb-4">
              <h2 className="text-center font-bold text-lg">
                {selectedCompany?.name || 'Selecione uma empresa'}
              </h2>
            </div>
          )}
          <button 
            onClick={toggleSidebar}
            className="p-2 hover:bg-orange-700 rounded-full"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu color='black' size={20} />}
          </button>
          <nav>
            <ul className="space-y-2">
              <li>
                <a href="#" className="flex items-center p-3 bg-orange-700 rounded">
                  <BarChart3 className="mr-3" size={20} />
                  <span className={`transition-opacity duration-300 ${
                    isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
                  }`}>
                    Dashboard
                  </span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-3 hover:bg-orange-700 rounded">
                  <Ticket className="mr-3" size={20} />
                  <span className={`transition-opacity duration-300 ${
                    isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
                  }`}>
                    Bilhetes
                  </span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-3 hover:bg-orange-700 rounded">
                  <Bus className="mr-3" size={20} />
                  <span className={`transition-opacity duration-300 ${
                    isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
                  }`}>
                    Rotas
                  </span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-3 hover:bg-orange-700 rounded">
                  <Users className="mr-3" size={20} />
                  <span className={`transition-opacity duration-300 ${
                    isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
                  }`}>
                    Passageiros
                  </span>
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center p-3 hover:bg-orange-700 rounded">
                  <Calendar className="mr-3" size={20} />
                  <span className={`transition-opacity duration-300 ${
                    isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
                  }`}>
                    Horários
                  </span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
  )
}

export default Sidebar
