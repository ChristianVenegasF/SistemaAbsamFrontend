import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./layout/MainLayout";
import ProductosPage from "./pages/ProductosPage";
import ComprasPage from "./pages/ComprasPage";

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<ProductosPage />} />
          <Route path="/clientes" element={<h2>Clientes Page</h2>} />
          <Route path="/ventas" element={<h2>Ventas Page</h2>} />
          <Route path="/compras" element={<ComprasPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
