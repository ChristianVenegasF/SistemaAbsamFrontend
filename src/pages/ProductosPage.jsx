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
  
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    setLoading(true);
    try {
      const res = await obtenerProductos();
      setProductos(res.data);
      setCurrentPage(1);
    } catch (error) {
      mostrarToast('Error', 'No se pudieron cargar los productos', 'error');
    } finally {
      setLoading(false);
    }
  };

  const filteredProductos = productos.filter(producto =>
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProductos.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProductos = filteredProductos.slice(startIndex, endIndex);

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
    const totalProductos = filteredProductos.length;
    const totalStock = filteredProductos.reduce((sum, p) => sum + p.stock, 0);
    const valorTotal = filteredProductos.reduce((sum, p) => sum + (p.precio * p.stock), 0);
    const sinStock = filteredProductos.filter(p => p.stock === 0).length;
    
    return { totalProductos, totalStock, valorTotal, sinStock };
  };

  const stats = calcularEstadisticas();

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 500, behavior: 'smooth' });
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value));
    setCurrentPage(1);
  };

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

      {/* Barra de búsqueda y controles */}
      <div className={styles.controlsContainer}>
        <div className={styles.searchContainer}>
          <div className={styles.searchInputWrapper}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Buscar productos por nombre..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className={styles.searchInput}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className={styles.clearSearchButton}
                title="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
          </div>
          {searchTerm && (
            <div className={styles.searchResults}>
              {filteredProductos.length} producto{filteredProductos.length !== 1 ? 's' : ''} encontrado{filteredProductos.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        <div className={styles.paginationControls}>
          <div className={styles.itemsPerPage}>
            <label htmlFor="itemsPerPage" className={styles.paginationLabel}>
              Mostrar:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className={styles.itemsPerPageSelect}
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
      </div>

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
            {currentProductos.length === 0 ? (
              <tr>
                <td colSpan="6" className={styles.emptyState}>
                  <div className={styles.emptyIcon}>
                    {searchTerm ? "🔍" : "📦"}
                  </div>
                  <p>
                    {searchTerm 
                      ? `No se encontraron productos con "${searchTerm}"`
                      : "No hay productos registrados"}
                  </p>
                  {!searchTerm && (
                    <button
                      className={`${styles.button} ${styles.buttonPrimary} ${styles.buttonOutline}`}
                      onClick={() => setFormVisible(true)}
                    >
                      Crear primer producto
                    </button>
                  )}
                  {searchTerm && (
                    <button
                      className={`${styles.button} ${styles.buttonOutline}`}
                      onClick={() => setSearchTerm("")}
                    >
                      Limpiar búsqueda
                    </button>
                  )}
                </td>
              </tr>
            ) : (
              currentProductos.map((producto) => (
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

        {/* Controles de paginación */}
        {filteredProductos.length > itemsPerPage && (
          <div className={styles.paginationFooter}>
            <div className={styles.paginationInfo}>
              Mostrando {startIndex + 1} - {Math.min(endIndex, filteredProductos.length)} de {filteredProductos.length} productos
            </div>
            <div className={styles.paginationButtons}>
              <button
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className={`${styles.paginationButton} ${currentPage === 1 ? styles.disabled : ''}`}
                title="Primera página"
              >
                ««
              </button>
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`${styles.paginationButton} ${currentPage === 1 ? styles.disabled : ''}`}
                title="Página anterior"
              >
                «
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => goToPage(pageNum)}
                    className={`${styles.paginationButton} ${currentPage === pageNum ? styles.active : ''}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`${styles.paginationButton} ${currentPage === totalPages ? styles.disabled : ''}`}
                title="Página siguiente"
              >
                »
              </button>
              <button
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className={`${styles.paginationButton} ${currentPage === totalPages ? styles.disabled : ''}`}
                title="Última página"
              >
                »»
              </button>
            </div>
          </div>
        )}
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