import React, { createContext, useContext, useState } from 'react';

// Create the context
const AllergyContext = createContext({
  allergies: [] as string[],
  setAllergies: (allergies: string[]) => {},
});

// Provider component
export const AllergyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allergies, setAllergies] = useState<string[]>([]);

  return (
    <AllergyContext.Provider value={{ allergies, setAllergies }}>
      {children}
    </AllergyContext.Provider>
  );
};

// Custom hook for consuming the context
export const useAllergyContext = () => useContext(AllergyContext);
