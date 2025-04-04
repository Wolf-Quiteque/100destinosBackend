import React, { useContext } from 'react';
import Link from 'next/link'; // Import Link
import { 
    Ticket, 
    Building2, // Added for Empresas
    DollarSign, // Added for Finanças
    Users, 
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
              {/* Bilhetes */}
              <li>
                <Link href="/bilhetes" className="flex items-center p-3 hover:bg-orange-700 rounded">
                  <Ticket className="mr-3" size={20} />
                  <span className={`transition-opacity duration-300 ${
                    isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
                  }`}>
                    Bilhetes
                  </span>
                </Link>
              </li>
              {/* Empresas */}
              <li>
                <Link href="/empresas" className="flex items-center p-3 hover:bg-orange-700 rounded">
                  <Building2 className="mr-3" size={20} />
                  <span className={`transition-opacity duration-300 ${
                    isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
                  }`}>
                    Empresas
                  </span>
                </Link>
              </li>
              {/* Finanças */}
              <li>
                <Link href="/financas" className="flex items-center p-3 hover:bg-orange-700 rounded">
                  <DollarSign className="mr-3" size={20} />
                  <span className={`transition-opacity duration-300 ${
                    isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
                  }`}>
                    Finanças
                  </span>
                </Link>
              </li>
              {/* Funcionarios */}
              <li>
                <Link href="/funcionarios" className="flex items-center p-3 hover:bg-orange-700 rounded">
                  <Users className="mr-3" size={20} />
                  <span className={`transition-opacity duration-300 ${
                    isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
                  }`}>
                    Funcionarios
                  </span>
                </Link>
              </li>

              {/* Company Specific Links - Conditionally Rendered */}
              {selectedCompany && (
                <>
                  {/* Finanças (Empresa) */}
                  <li>
                    <Link href={`/empresas/${selectedCompany.id}/financas`} className="flex items-center p-3 hover:bg-orange-700 rounded">
                      <DollarSign className="mr-3" size={20} />
                      <span className={`transition-opacity duration-300 ${
                        isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
                      }`}>
                        Finanças (Empresa)
                      </span>
                    </Link>
                  </li>
                  {/* Bilhetes (Empresa) */}
                  <li>
                    <Link href={`/empresas/${selectedCompany.id}/bilhetes`} className="flex items-center p-3 hover:bg-orange-700 rounded">
                      <Ticket className="mr-3" size={20} />
                      <span className={`transition-opacity duration-300 ${
                        isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
                      }`}>
                        Bilhetes (Empresa)
                      </span>
                    </Link>
                  </li>
                   {/* Rotas (Empresa) */}
                   <li>
                    <Link href={`/empresas/${selectedCompany.id}/rotas`} className="flex items-center p-3 hover:bg-orange-700 rounded">
                      {/* Assuming you have a Route icon or similar */}
                      <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> 
                      <span className={`transition-opacity duration-300 ${
                        isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
                      }`}>
                        Rotas (Empresa)
                      </span>
                    </Link>
                  </li>
                   {/* Autocarros (Empresa) */}
                   <li>
                    <Link href={`/empresas/${selectedCompany.id}/autocarros`} className="flex items-center p-3 hover:bg-orange-700 rounded">
                       {/* Assuming you have a Bus icon or similar */}
                       <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 18h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2z" /></svg>
                      <span className={`transition-opacity duration-300 ${
                        isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
                      }`}>
                        Autocarros (Empresa)
                      </span>
                    </Link>
                  </li>
                   {/* Funcionários (Empresa) */}
                   <li>
                    <Link href={`/empresas/${selectedCompany.id}/funcionarios`} className="flex items-center p-3 hover:bg-orange-700 rounded">
                      <Users className="mr-3" size={20} />
                      <span className={`transition-opacity duration-300 ${
                        isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
                      }`}>
                        Funcionários (Empresa)
                      </span>
                    </Link>
                  </li>
                   {/* Editar (Empresa) */}
                   <li>
                    <Link href={`/empresas/${selectedCompany.id}/editar`} className="flex items-center p-3 hover:bg-orange-700 rounded">
                       {/* Assuming you have an Edit icon or similar */}
                       <svg xmlns="http://www.w3.org/2000/svg" className="mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      <span className={`transition-opacity duration-300 ${
                        isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
                      }`}>
                        Editar (Empresa)
                      </span>
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </div>
  )
}

export default Sidebar
