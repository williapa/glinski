import React, { useContext, createContext, useState } from 'react';

// Create a context for managing click disable state
const DisableClicksContext = createContext();

// Provider component
export const DisableClicksProvider = ({ children }) => {
  const [clicksDisabled, setClicksDisabled] = useState(false);

  return (
    <DisableClicksContext.Provider value={{ clicksDisabled, setClicksDisabled }}>
      {children}
    </DisableClicksContext.Provider>
  );
};

// Custom hook to use the disable clicks context
export const useDisableClicks = () => useContext(DisableClicksContext);
