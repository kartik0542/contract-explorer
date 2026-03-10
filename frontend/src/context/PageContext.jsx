import { createContext, useContext, useState } from "react";

// Context banao - global data container
const PageContext = createContext();

// Provider — yeh poori app ko wrap karega
export const PageProvider = ({ children }) => {
  const [activePage, setActivePage] = useState(null);

  return (
    // Jo bhi component is context ke andar hoga, wo activePage aur setActivePage dono use kar sakta hai.
    <PageContext.Provider value={{ activePage, setActivePage }}>
      {children}
    </PageContext.Provider>
    // Jo bhi components PageProvider ke andar honge, unhe context access milega.
  );
};

// Custom hook — easy use ke liye
export const usePage = () => useContext(PageContext);
