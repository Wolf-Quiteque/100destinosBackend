"use client"
import "./globals.css"

import React, { useState } from 'react';
import { SelectedCompanyProvider } from './context/SelectedCompanyContext';
import { 
  HandCoins,
  Search,
  Bell,
  Menu,
  Building2,
  X,
  Users2,
  LogOut,
  Bus,
  Ticket // Added Ticket icon
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Toaster } from "@/components/ui/toaster"

import { useContext } from 'react';
import { SelectedCompanyContext } from './context/SelectedCompanyContext';

const CompanyNavigation = ({ isSidebarOpen }) => {
  const { selectedCompany } = useContext(SelectedCompanyContext);
  const pathname = usePathname();

  const isCurrentPath = (path) => {
    return pathname === path;
  };

  if (!selectedCompany) return null;

  const items = [
    { icon: Bus, label: 'Rotas', href: `/empresas/${selectedCompany.id}/rotas` },
    { icon: Building2, label: 'Editar Info', href: `/empresas/${selectedCompany.id}/editar` },
    { icon: Bus, label: 'Autocarros', href: `/empresas/${selectedCompany.id}/autocarros` },
    { icon: Users2, label: 'Funcionários', href: `/empresas/${selectedCompany.id}/funcionarios` },
    { icon: HandCoins, label: 'Finanças', href: `/empresas/${selectedCompany.id}/financas` }, // Added Company Finances
    { icon: Ticket, label: 'Bilhetes', href: `/empresas/${selectedCompany.id}/bilhetes` }      // Added Company Tickets
  ];

  return (
    <div className="mt-4 border-t border-orange-500 pt-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <li key={item.href}>
            <Link 
              href={item.href}
              className={`flex items-center p-3 rounded transition-colors duration-200 ${
                isCurrentPath(item.href) 
                  ? 'bg-orange-700' 
                  : 'hover:bg-orange-700'
              }`}
            >
              <Icon className="mr-3" size={20} />
              <span className={`transition-opacity duration-300 ${
                isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
              }`}>
                {item.label}
              </span>
            </Link>
          </li>
        );
      })}
    </div>
  );
};

const RootLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  // Updated main navigation items order and added Bilhetes
  const mainNavigationItems = [
    { icon: Ticket, label: 'Bilhetes', href: '/bilhetes' },
    { icon: Building2, label: 'Empresas', href: '/empresas' },
    { icon: HandCoins, label: 'Finanças', href: '/financas' },
    { icon: Users2, label: 'Funcionários', href: '/funcionarios' }
  ];

  const isCurrentPath = (path) => {
    return pathname === path;
  };

  return (
    <html lang="en">
      <body>
        <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`fixed left-0 h-full bg-orange-600 text-white transition-all duration-300 ease-in-out z-20 ${
        isSidebarOpen ? 'w-64' : 'w-20'
      }`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className={`text-2xl font-bold transition-opacity duration-300 ${
              isSidebarOpen ? 'opacity-100' : 'opacity-0'
            }`}>
             100 Dest.
            </h1>
            <button 
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-orange-700 rounded-full"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu color="black" size={20} />}
            </button>
          </div>
          <nav>
            <ul className="space-y-2">
              {mainNavigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.href}>
                    <Link 
                      href={item.href}
                      className={`flex items-center p-3 rounded transition-colors duration-200 ${
                        isCurrentPath(item.href) 
                          ? 'bg-orange-700' 
                          : 'hover:bg-orange-700'
                      }`}
                    >
                      <Icon className="mr-3" size={20} />
                      <span className={`transition-opacity duration-300 ${
                        isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
                      }`}>
                        {item.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
              <CompanyNavigation isSidebarOpen={isSidebarOpen} />
            </ul>
          </nav>
        </div>
      </div>
      <div className={`flex-1 transition-all duration-300 ${
        isSidebarOpen ? 'ml-64' : 'ml-20'
      }`}>
      
        <header className="bg-white shadow fixed right-0 top-0 z-10 transition-all duration-300" style={{
          width: isSidebarOpen ? 'calc(100% - 16rem)' : 'calc(100% - 5rem)'
        }}>
          <div className="flex items-center justify-between px-8 py-4">
            <div className="flex items-center bg-gray-100 rounded-lg p-2 w-96">
              <Search className="text-gray-400 mr-2" size={20} />
              <input
                type="text"
                placeholder="Pesquisar..."
                className="bg-transparent border-none focus:outline-none w-full"
              />
            </div>
            <div className="flex items-center">
              <button className="p-2 hover:bg-gray-100 rounded-full relative">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="ml-4 flex items-center">
                <img
                  src="https://picsum.photos/32" // Updated placeholder image
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="ml-2 font-medium">Admin</span>
                {/* Moved Logout Button Here */}
                <button 
                  className="ml-4 p-2 hover:bg-gray-100 rounded-full"
                  onClick={() => console.log('Logout clicked')}
                  title="Sair" // Added title for accessibility
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </header>
        <main className="pt-20">
        {children} <Toaster />
        </main>
      </div>
        </div>
      </body>
    </html>
  );
};

const DashboardLayout = ({ children }) => {
  return (
    <SelectedCompanyProvider>
      <RootLayout>{children}</RootLayout>
    </SelectedCompanyProvider>
  );
};

export default DashboardLayout;
