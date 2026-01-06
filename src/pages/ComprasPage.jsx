import { useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import ModalCompra from '../components/ModalCompra';
import styles from './ComprasPage.module.css';

export default function ComprasPage() {
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);

  const fetchProductos = async () => {
    try {
      const res = await axios.get('/productos');
      setProductos(res.data);
    } catch (error) {
      console.error("Error al cargar productos", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Lista de Productos</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Stock</th>
            <th>Precio Venta</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {productos.map((p) => (
            <tr key={p.idProducto}>
              <td>{p.nombre}</td>
              <td>{p.stock}</td>
              <td>{p.precio}</td>
              <td>
                <button
                  className={styles.button}
                  onClick={() => setProductoSeleccionado(p)}
                >
                  Comprar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {productoSeleccionado && (
        <ModalCompra
          producto={productoSeleccionado}
          onClose={() => setProductoSeleccionado(null)}
          onCompraExitosa={fetchProductos}
        />
      )}
    </div>
  );
}
