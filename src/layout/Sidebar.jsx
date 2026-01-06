import { Link, useLocation } from "react-router-dom";
import "./layout.css";

const Sidebar = () => {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <h2 className="logo"><img src="../assets/logoabsam.jpeg" alt="" /></h2>

      <nav className="menu">
        <Link
          to="/"
          className={`menu-btn ${location.pathname === "/" ? "active" : ""}`}
        >
          Productos
        </Link>
        <Link
          to="/clientes"
          className={`menu-btn ${location.pathname === "/clientes" ? "active" : ""}`}
        >
          Clientes
        </Link>
        <Link
          to="/ventas"
          className={`menu-btn ${location.pathname === "/ventas" ? "active" : ""}`}
        >
          Ventas
        </Link>
        <Link
          to="/compras"
          className={`menu-btn ${location.pathname === "/compras" ? "active" : ""}`}
        >
          Compras
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
