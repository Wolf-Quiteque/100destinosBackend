"use client"
import React from 'react'

import { 
    Search,
    Bell,
  } from 'lucide-react';
  

function header() {
  return (
    <header className="bg-white shadow">
    <div className="flex items-center justify-between px-8 py-4">
      <div className="flex items-center bg-gray-100 rounded-lg p-2 w-96 ml-20">
        <Search className="text-gray-400 mr-2" size={20} />
        <input
          type="text"
          placeholder="Pesquisar..."
          className="bg-transparent border-none focus:outline-none w-full"
        />
      </div>
      <div className="flex items-center">
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Bell size={20} />
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
  )
}

export default header