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
  const [loading, setLoading] = useState(true);
  const [formVisible, setFormVisible] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    setLoading(true);
    try {
      const res = await obtenerProductos();
      setProductos(res.data);
    } catch (error) {
      mostrarToast('Error', 'No se pudieron cargar los productos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const mostrarToast = (titulo, mensaje, tipo = 'info') => {
    setToast({ titulo, mensaje, tipo });
    setTimeout(() => setToast(null), 3000);
  };

  const guardarProducto = async (producto) => {
    try {
      if (productoEditando) {
        await actualizarProducto(producto.idProducto, producto);
        mostrarToast('Éxito', 'Producto actualizado correctamente', 'success');
        setProductoEditando(null);
      } else {
        await crearProducto(producto);
        mostrarToast('Éxito', 'Producto creado correctamente', 'success');
      }
      setFormVisible(false);
      cargarProductos();
    } catch (error) {
      mostrarToast('Error', 'No se pudo guardar el producto', 'error');
    }
  };

  const editarProducto = (producto) => {
    setProductoEditando(producto);
    setFormVisible(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const borrarProducto = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        await eliminarProducto(id);
        mostrarToast('Éxito', 'Producto eliminado correctamente', 'success');
        cargarProductos();
      } catch (error) {
        mostrarToast('Error', 'No se pudo eliminar el producto', 'error');
      }
    }
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return 'empty';
    if (stock <= 10) return 'low';
    return 'high';
  };

  const calcularEstadisticas = () => {
    const totalProductos = productos.length;
    const totalStock = productos.reduce((sum, p) => sum + p.stock, 0);
    const valorTotal = productos.reduce((sum, p) => sum + (p.precio * p.stock), 0);
    const sinStock = productos.filter(p => p.stock === 0).length;
    
    return { totalProductos, totalStock, valorTotal, sinStock };
  };

  const stats = calcularEstadisticas();

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.emptyIcon}>⏳</div>
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Gestión de Productos</h1>
          <p className={styles.subtitle}>
            Administra y monitorea tu inventario de productos
          </p>
        </div>
        
        <button
          className={`${styles.button} ${styles.buttonPrimary}`}
          onClick={() => {
            setProductoEditando(null);
            setFormVisible(!formVisible);
          }}
        >
          {formVisible ? '↥ Ocultar Formulario' : '＋ Nuevo Producto'}
        </button>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsContainer}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📦</div>
          <div className={styles.statTitle}>Productos Totales</div>
          <div className={styles.statValue}>{stats.totalProductos}</div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statTitle}>Stock Total</div>
          <div className={styles.statValue}>{stats.totalStock}</div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💰</div>
          <div className={styles.statTitle}>Valor Total</div>
          <div className={styles.statValue}>S/.{stats.valorTotal.toLocaleString()}</div>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⚠️</div>
          <div className={styles.statTitle}>Sin Stock</div>
          <div className={styles.statValue}>{stats.sinStock}</div>
        </div>
      </div>

      {/* Formulario (condicional) */}
      {formVisible && (
        <div className={`${styles.formContainer} ${styles.fadeIn}`}>
          <ProductoForm
            onGuardar={guardarProducto}
            productoEditando={productoEditando}
            onCancelar={() => {
              setFormVisible(false);
              setProductoEditando(null);
            }}
          />
        </div>
      )}

      {/* Tabla de productos */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {productos.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.emptyState}>
                  <div className={styles.emptyIcon}>📦</div>
                  <p>No hay productos registrados</p>
                  <button
                    className={`${styles.button} ${styles.buttonPrimary} ${styles.buttonOutline}`}
                    onClick={() => setFormVisible(true)}
                  >
                    Crear primer producto
                  </button>
                </td>
              </tr>
            ) : (
              productos.map((producto) => (
                <tr key={producto.idProducto} className={styles.slideIn}>
                  <td className={styles.idCell}>#{producto.idProducto}</td>
                  <td className={styles.nameCell}>{producto.nombre}</td>
                  <td className={styles.priceCell}>
                    S/.{producto.precio.toLocaleString()}
                  </td>
                  <td className={styles.stockCell}>
                    {producto.stock.toLocaleString()} unidades
                  </td>
                  <td>
                    <span className={`${styles.stockBadge} ${styles[`stock${getStockStatus(producto.stock).charAt(0).toUpperCase() + getStockStatus(producto.stock).slice(1)}`]}`}>
                      {getStockStatus(producto.stock) === 'high' ? 'Disponible' : 
                       getStockStatus(producto.stock) === 'low' ? 'Bajo Stock' : 'Agotado'}
                    </span>
                  </td>
                  <td>
                    <div className={styles.buttonGroup}>
                      <button
                        className={`${styles.button} ${styles.buttonIcon} ${styles.buttonOutline}`}
                        onClick={() => editarProducto(producto)}
                        title="Editar"
                      >
                        ✏️
                      </button>
                      <button
                        className={`${styles.button} ${styles.buttonIcon} ${styles.buttonDanger}`}
                        onClick={() => borrarProducto(producto.idProducto)}
                        title="Eliminar"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Toast Notifications */}
      {toast && (
        <div className={`${styles.toast} ${styles[`toast${toast.tipo.charAt(0).toUpperCase() + toast.tipo.slice(1)}`]}`}>
          <div className={styles.toastTitle}>{toast.titulo}</div>
          <div className={styles.toastMessage}>{toast.mensaje}</div>
        </div>
      )}
    </div>
  );
};

export default ProductosPage;