import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import ProductosPage from "./pages/ProductosPage";
import ComprasPage from "./pages/ComprasPage";
import ClientesPage from "./pages/ClientesPage";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<ProductosPage />} />
          <Route path="/clientes" element={<ClientesPage />} />
          {/* Elimina esta ruta - ClienteList es un componente, no una página */}
          {/* <Route path="/clientesList" element={<ClienteList />} /> */}
          <Route path="/ventas" element={<h2>En Produccion Ventas</h2>} />
          <Route path="/compras" element={<ComprasPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;