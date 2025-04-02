'use client';

import { createContext, useState } from 'react';

export const SelectedCompanyContext = createContext();

export const SelectedCompanyProvider = ({ children }) => {
  const [selectedCompany, setSelectedCompany] = useState(null);

  return (
    <SelectedCompanyContext.Provider value={{ selectedCompany, setSelectedCompany }}>
      {children}
    </SelectedCompanyContext.Provider>
  );
};
