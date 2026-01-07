import { Link, useLocation } from "react-router-dom";
import logo from '../assets/logoabsam.jpeg';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: "/", label: "📦 Productos", icon: "📦" },
    { path: "/clientes", label: "👥 Clientes", icon: "👥" },
    { path: "/ventas", label: "💰 Ventas", icon: "💰" },
    { path: "/compras", label: "🛒 Compras", icon: "🛒" },
  ];

  return (
    <aside className="sidebar">
      <div className="logo">
        <img src={logo} alt="Logo ABSAM" />
        <h2 style={{ 
          color: 'white', 
          marginTop: '10px', 
          fontSize: '1.2rem',
          fontWeight: 'normal'
        }}>
          ABSAM
        </h2>
      </div>

      <nav className="menu">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`menu-btn ${location.pathname === item.path ? "active" : ""}`}
          >
            <span style={{ marginRight: '10px' }}>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div style={{ 
        marginTop: '2rem', 
        paddingTop: '1rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <p style={{ 
          color: '#a0a0c0', 
          fontSize: '0.85rem', 
          textAlign: 'center',
          lineHeight: '1.4'
        }}>
          Sistema de Gestión<br />de Inventario
        </p>
      </div>
    </aside>
  );
};

export default Sidebar;