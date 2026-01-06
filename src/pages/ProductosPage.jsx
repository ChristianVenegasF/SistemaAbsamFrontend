import { useEffect, useState } from "react";
import {
  obtenerProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from "../api/productosApi";

import ProductoForm from "../components/ProductoForm";
import styles from './ProductosPage.module.css';

const ProductosPage = () => {
  const [productos, setProductos] = useState([]);
  const [productoEditando, setProductoEditando] = useState(null);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    const res = await obtenerProductos();
    setProductos(res.data);
  };

  const guardarProducto = async (producto) => {
    if (productoEditando) {
      await actualizarProducto(producto.idProducto, producto);
      setProductoEditando(null);
    } else {
      await crearProducto(producto);
    }
    cargarProductos();
  };

  const editarProducto = (producto) => {
    setProductoEditando(producto);
  };

  const borrarProducto = async (id) => {
    if (confirm("¿Eliminar producto?")) {
      await eliminarProducto(id);
      cargarProductos();
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Productos</h1>

      <div className={styles.formContainer}>
        <ProductoForm
          onGuardar={guardarProducto}
          productoEditando={productoEditando}
        />
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {productos.map((p) => (
            <tr key={p.idProducto}>
              <td>{p.idProducto}</td>
              <td>{p.nombre}</td>
              <td>{p.precio}</td>
              <td>{p.stock}</td>
              <td>
                <button
                  className={styles.button}
                  onClick={() => editarProducto(p)}
                >
                  Editar
                </button>
                <button
                  className={`${styles.button} ${styles.eliminar}`}
                  onClick={() => borrarProducto(p.idProducto)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductosPage;
