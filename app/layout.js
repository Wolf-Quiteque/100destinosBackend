"use client"
import "./globals.css"

import React, { useState } from 'react';
import { 
  BarChart3, 
  Ticket, 
  Bus, 
  Users, 
  HandCoins,
  Search,
  Bell,
  Menu,
  X,
  LogOut
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const navigationItems = [
    { icon: Ticket, label: 'Bilhetes', href: '/' },
    { icon: Bus, label: 'Rotas', href: '/rotas' },
    { icon: HandCoins, label: 'Finanças', href: '/financas' },
  ];

  const isCurrentPath = (path) => {
    return pathname === path;
  };

  return ( <html lang="en">
    <body
    >
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
              {navigationItems.map((item) => {
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
            </ul>
          </nav>

          {/* Logout Button */}
          <div className="absolute bottom-4 w-full left-0 px-4">
            <button 
              className="flex items-center p-3 hover:bg-orange-700 rounded w-full"
              onClick={() => console.log('Logout clicked')}
            >
              <LogOut className="mr-3" size={20} />
              <span className={`transition-opacity duration-300 ${
                isSidebarOpen ? 'opacity-100' : 'opacity-0 w-0'
              }`}>
                Sair
              </span>
            </button>
          </div>
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
                  src="/api/placeholder/32/32"
                  alt="Profile"
                  className="w-8 h-8 rounded-full"
                />
                <span className="ml-2 font-medium">Admin</span>
              </div>
            </div>
          </div>
        </header>
        <main className="pt-20">
          {children}
        </main>
      </div>
    </div>
    </body>
  </html>
 
  );
};

export default DashboardLayout;
