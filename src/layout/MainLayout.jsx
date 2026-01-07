import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "./layout.css";

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handleToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const getLayoutClass = () => {
    if (isMobile) {
      return sidebarOpen ? "layout sidebar-mobile-open" : "layout";
    } else {
      return sidebarOpen ? "layout" : "layout sidebar-collapsed";
    }
  };

  return (
    <div className={getLayoutClass()}>
      {/* Botón de toggle */}
      <button 
        className="toggle-btn" 
        onClick={handleToggle}
        aria-label={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
        title={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {sidebarOpen ? '←' : '☰'}
      </button>
      
      {/* Sidebar */}
      <Sidebar />
      
      {/* Contenido principal */}
      <main className="content">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;