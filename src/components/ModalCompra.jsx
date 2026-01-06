import { useState } from 'react';
import { registrarCompra } from '../api/comprasApi';

export default function ModalCompra({ producto, onClose, onCompraExitosa }) {
  const [cantidad, setCantidad] = useState(1);
  const [precioCompra, setPrecioCompra] = useState(0);
  const [precioVenta, setPrecioVenta] = useState(producto.precio);

  const handleGuardar = async () => {
    if (!cantidad || !precioCompra || !precioVenta) {
      alert("Todos los campos son obligatorios");
      return;
    }

    try {
      await registrarCompra({
        producto: { idProducto: producto.idProducto },
        cantidad,
        precioCompra,
        precioVenta
      });

      alert("Compra registrada con éxito");
      onCompraExitosa(); // refresca productos
      onClose();
    } catch (error) {
      alert("Error al registrar compra");
    }
  };

  return (
    <div className="modal">
      <h3>Registrar Compra: {producto.nombre}</h3>
      <input
        type="number"
        min="1"
        value={cantidad}
        placeholder="Cantidad"
        onChange={(e) => setCantidad(Number(e.target.value))}
      />
      <input
        type="number"
        step="0.01"
        value={precioCompra}
        placeholder="Precio Compra"
        onChange={(e) => setPrecioCompra(Number(e.target.value))}
      />
      <input
        type="number"
        step="0.01"
        value={precioVenta}
        placeholder="Precio Venta"
        onChange={(e) => setPrecioVenta(Number(e.target.value))}
      />
      <button onClick={handleGuardar}>Guardar</button>
      <button onClick={onClose}>Cancelar</button>
    </div>
  );
}
