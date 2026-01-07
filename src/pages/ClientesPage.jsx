import { useEffect, useState, useCallback, useRef } from "react";
import Sidebar from "../layout/Sidebar";
import ClienteForm from "../components/ClienteForm";
import ClienteList from "../components/ClienteList";
import { 
  obtenerClientes, 
  crearCliente, 
  actualizarCliente, 
  eliminarCliente,
  obtenerClientePorDni
} from "../api/clientesApi";
import styles from './ClientesPage.module.css';

const ClientesPage = () => {
  const [clientes, setClientes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("nombre");
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef(null);

  const fetchClientes = async () => {
    try {
      setLoading(true);
      setError(null);
      setIsSearching(false);
      const response = await obtenerClientes();
      
      // Ordenar por ID descendente (los más recientes primero)
      const clientesOrdenados = response.data.sort((a, b) => b.id - a.id);
      setClientes(clientesOrdenados);
    } catch (err) {
      console.error("Error cargando clientes:", err);
      setError("❌ No se pudieron cargar los clientes. Verifique la conexión.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  // Función de búsqueda por DNI automática
  const buscarPorDni = useCallback(async (dni) => {
    if (!dni.trim() || dni.length !== 8 || !/^\d+$/.test(dni)) {
      fetchClientes();
      return;
    }
    
    try {
      setIsSearching(true);
      setError(null);
      const response = await obtenerClientePorDni(dni);
      if (response.data) {
        setClientes([response.data]);
      } else {
        setError("❌ No se encontró cliente con ese DNI");
        setClientes([]);
      }
    } catch (err) {
      console.error("Error buscando por DNI:", err);
      if (err.response?.status === 404) {
        setError("❌ No se encontró cliente con ese DNI");
        setClientes([]);
      } else {
        setError("❌ Error al buscar cliente por DNI");
      }
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Manejar cambios en la búsqueda con debounce
  const handleSearchChange = useCallback((value) => {
    setSearchTerm(value);
    
    // Limpiar timeout anterior
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Si es búsqueda por DNI y tiene 8 dígitos, buscar automáticamente
    if (searchType === 'dni' && value.length === 8 && /^\d+$/.test(value)) {
      searchTimeoutRef.current = setTimeout(() => {
        buscarPorDni(value);
      }, 500); // 500ms de debounce
    }
  }, [searchType, buscarPorDni]);

  // Filtrar clientes según término de búsqueda (para búsqueda por nombre)
  const filteredClientes = clientes.filter(cliente => {
    if (!searchTerm.trim() || searchType !== 'nombre') return true;
    
    const searchTermLower = searchTerm.toLowerCase();
    
    return (
      cliente.nombre?.toLowerCase().includes(searchTermLower) ||
      cliente.apellido?.toLowerCase().includes(searchTermLower)
    );
  });

  const handleClearSearch = () => {
    setSearchTerm("");
    fetchClientes();
  };

  const handleAgregarCliente = () => {
    setEditingCliente(null);
    setShowForm(true);
    setError(null);
    setSuccess(null);
  };

  const handleEditarCliente = (cliente) => {
    if (!cliente || !cliente.id) {
      setError("❌ No se puede editar un cliente sin ID válido");
      return;
    }
    
    setEditingCliente(cliente);
    setShowForm(true);
    setError(null);
    setSuccess(null);
  };

  const handleFormSubmit = async (clienteData) => {
    try {
      setError(null);
      setSuccess(null);
      
      console.log('Enviando cliente:', clienteData);
      console.log('Cliente a editar:', editingCliente);
      
      let response;
      if (editingCliente && editingCliente.id) {
        response = await actualizarCliente(editingCliente.id, clienteData);
        setSuccess("✅ Cliente actualizado correctamente");
      } else {
        response = await crearCliente(clienteData);
        setSuccess("✅ Cliente registrado correctamente");
      }
      
      console.log('Respuesta del servidor:', response.data);
      
      // Actualizar la lista
      await fetchClientes();
      
      // Cerrar el formulario después de 2 segundos
      setTimeout(() => {
        setShowForm(false);
        setEditingCliente(null);
        setSuccess(null);
      }, 2000);
      
    } catch (err) {
      console.error("Error guardando cliente:", err);
      console.error("Detalles del error:", err.response?.data);
      
      const errorMessage = err.response?.data || err.message || "Error desconocido";
      
      if (err.response?.status === 409 || errorMessage.includes("ya está registrado")) {
        setError("❌ El DNI o email ya está registrado");
      } else if (err.response?.status === 400) {
        setError(`❌ Datos inválidos: ${errorMessage}`);
      } else {
        setError("❌ Error al guardar. Verifique su conexión.");
      }
    }
  };

  const handleEliminarCliente = async (id) => {
    if (window.confirm("¿Está seguro de eliminar este cliente?\nEsta acción no se puede deshacer.")) {
      try {
        setError(null);
        await eliminarCliente(id);
        await fetchClientes();
        setSuccess("✅ Cliente eliminado correctamente");
        setTimeout(() => setSuccess(null), 2000);
      } catch (err) {
        console.error("Error eliminando cliente:", err);
        if (err.response?.status === 404) {
          setError("❌ Cliente no encontrado");
        } else {
          setError("❌ No se pudo eliminar el cliente.");
        }
      }
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCliente(null);
    setError(null);
    setSuccess(null);
  };

  const handleSearchTypeChange = (e) => {
    const newType = e.target.value;
    setSearchType(newType);
    setSearchTerm("");
    fetchClientes();
    
    // Limpiar timeout si existe
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
  };

  // Limpiar timeout al desmontar
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.layout}>
      <Sidebar />
      
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <header className={styles.header}>
            <div className={styles.headerInfo}>
              <div className={styles.titleSection}>
                <h1 className={styles.pageTitle}>
                  <span className={styles.icon}>👥</span>
                  Gestión de Clientes
                </h1>
                <p className={styles.pageSubtitle}>
                  Administre la información de sus clientes de manera eficiente
                </p>
              </div>
              <div className={styles.headerStats}>
                <div className={styles.statItem}>
                  <span className={styles.statNumber}>{clientes.length}</span>
                  <span className={styles.statLabel}>Clientes</span>
                </div>
              </div>
            </div>
            
            <div className={styles.headerActions}>
              <div className={styles.searchSection}>
                <div className={styles.searchContainer}>
                  <div className={styles.searchTypeSelector}>
                    <select 
                      value={searchType}
                      onChange={handleSearchTypeChange}
                      className={styles.searchTypeSelect}
                    >
                      <option value="nombre">Buscar por Nombre/Apellido</option>
                      <option value="dni">Buscar por DNI</option>
                    </select>
                  </div>
                  
                  <div className={styles.searchBox}>
                    <div className={styles.searchInputWrapper}>
                      <span className={styles.searchIcon}>🔍</span>
                      <input
                        type={searchType === 'dni' ? 'number' : 'text'}
                        placeholder={
                          searchType === 'dni' 
                            ? 'Ingrese 8 dígitos del DNI...' 
                            : 'Buscar cliente por nombre o apellido...'
                        }
                        value={searchTerm}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className={styles.searchInput}
                        disabled={isSearching}
                      />
                      {searchTerm && (
                        <button 
                          className={styles.clearButton}
                          onClick={handleClearSearch}
                          title="Limpiar búsqueda"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    {searchType === 'dni' && isSearching && (
                      <div className={styles.searchingIndicator}>
                        <span className={styles.spinnerSmall}></span>
                        <span className={styles.searchingText}>Buscando...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className={styles.actionsSection}>
                <button 
                  onClick={fetchClientes}
                  className={styles.refreshHeaderButton}
                  title="Actualizar lista"
                  disabled={loading}
                >
                  <span className={styles.refreshIcon}>↻</span>
                  Actualizar
                </button>
                
                <button 
                  className={`${styles.addButton} ${showForm ? styles.disabled : ''}`}
                  onClick={handleAgregarCliente}
                  disabled={showForm || loading}
                >
                  <span className={styles.plusIcon}>+</span>
                  Nuevo Cliente
                </button>
              </div>
            </div>
          </header>

          {/* Alertas */}
          <div className={styles.alertsContainer}>
            {error && (
              <div className={styles.alertError}>
                <div className={styles.alertContent}>
                  <span className={styles.alertIcon}>⚠️</span>
                  <span className={styles.alertMessage}>{error}</span>
                </div>
                <button onClick={() => setError(null)} className={styles.alertClose}>
                  <span className={styles.closeIcon}>×</span>
                </button>
              </div>
            )}

            {success && (
              <div className={styles.alertSuccess}>
                <div className={styles.alertContent}>
                  <span className={styles.alertIcon}>✓</span>
                  <span className={styles.alertMessage}>{success}</span>
                </div>
                <button onClick={() => setSuccess(null)} className={styles.alertClose}>
                  <span className={styles.closeIcon}>×</span>
                </button>
              </div>
            )}
          </div>

          {/* Contenido principal */}
          <div className={styles.content}>
            {loading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}>
                  <div className={styles.spinner}></div>
                  <p className={styles.loadingText}>Cargando información...</p>
                </div>
              </div>
            ) : showForm ? (
              <div className={styles.formWrapper}>
                <div className={styles.formCard}>
                  <ClienteForm 
                    cliente={editingCliente || {}}
                    onSubmit={handleFormSubmit}
                    onCancel={handleFormCancel}
                  />
                </div>
              </div>
            ) : (
              <div className={styles.listContainer}>
                <div className={styles.listHeader}>
                  <div className={styles.resultsInfo}>
                    <h3 className={styles.resultsTitle}>
                      {searchTerm 
                        ? `Resultados de búsqueda (${filteredClientes.length})`
                        : `Todos los clientes (${clientes.length})`
                      }
                    </h3>
                    {searchTerm && (
                      <p className={styles.searchInfo}>
                        Buscando: "{searchTerm}" {searchType === 'dni' ? 'por DNI' : 'por nombre/apellido'}
                      </p>
                    )}
                  </div>
                </div>

                <div className={styles.tableCard}>
                  <ClienteList 
                    clientes={searchType === 'nombre' || !searchTerm ? filteredClientes : clientes}
                    onEdit={handleEditarCliente}
                    onDelete={handleEliminarCliente}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientesPage;