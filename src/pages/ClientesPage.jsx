import { useEffect, useState } from "react";
import Sidebar from "../layout/Sidebar";
import ClienteForm from "../components/ClienteForm";
import ClienteList from "../components/ClienteList";
import { 
  obtenerClientes, 
  crearCliente, 
  actualizarCliente, 
  eliminarCliente 
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

  const fetchClientes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await obtenerClientes();
      
      // Tu backend devuelve el campo como "id", no "id_cliente"
      // Mapeamos para mantener consistencia en el frontend
      const clientesMapeados = response.data.map(cliente => ({
        ...cliente,
        id_cliente: cliente.id // Mapeamos id -> id_cliente
      }));
      
      setClientes(clientesMapeados);
    } catch (err) {
      console.error("Error cargando clientes:", err);
      setError("No se pudieron cargar los clientes. Verifique la conexión.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.apellido?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.telefono?.includes(searchTerm)
  );

  const handleAgregarCliente = () => {
    setEditingCliente(null);
    setShowForm(true);
    setError(null);
    setSuccess(null);
  };

  const handleEditarCliente = (cliente) => {
    console.log('Editando cliente:', cliente);
    
    // IMPORTANTE: Verificar que el cliente tenga un ID
    if (!cliente || cliente.id_cliente === undefined) {
      console.error('Cliente sin ID válido:', cliente);
      setError("✗ No se puede editar un cliente sin ID válido");
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
      
      console.log('Datos del formulario:', clienteData);
      console.log('Cliente editando:', editingCliente);
      
      if (editingCliente && editingCliente.id_cliente !== undefined) {
        // IMPORTANTE: Usar id_cliente para actualizar
        console.log('Actualizando cliente ID:', editingCliente.id_cliente);
        await actualizarCliente(editingCliente.id_cliente, clienteData);
        setSuccess("✓ Cliente actualizado correctamente");
      } else {
        console.log('Creando nuevo cliente');
        await crearCliente(clienteData);
        setSuccess("✓ Cliente registrado correctamente");
      }
      
      await fetchClientes();
      
      setTimeout(() => {
        setShowForm(false);
        setEditingCliente(null);
        setSuccess(null);
      }, 3000);
      
    } catch (err) {
      console.error("Error guardando cliente:", err);
      console.error("Detalles del error:", err.response?.data);
      
      if (err.response?.status === 409) {
        setError("✗ El email ya está registrado.");
      } else if (err.response?.status === 400) {
        setError("✗ Datos inválidos. Verifique los campos.");
      } else {
        setError("✗ Error al guardar. Verifique su conexión.");
      }
    }
  };

  const handleEliminarCliente = async (id) => {
    if (window.confirm("¿Está seguro de eliminar este cliente?")) {
      try {
        setError(null);
        await eliminarCliente(id);
        await fetchClientes();
        setSuccess("✓ Cliente eliminado correctamente");
        setTimeout(() => setSuccess(null), 3000);
      } catch (err) {
        console.error("Error eliminando cliente:", err);
        setError("✗ No se pudo eliminar el cliente.");
      }
    }
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingCliente(null);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className={styles.layout}>
      <Sidebar />
      
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <header className={styles.header}>
            <div className={styles.headerInfo}>
              <h1 className={styles.pageTitle}>
                <span className={styles.icon}>👥</span>
                Gestión de Clientes
              </h1>
              <p className={styles.pageSubtitle}>Administre la información de sus clientes</p>
            </div>
            
            <div className={styles.headerActions}>
              <div className={styles.searchBox}>
                <input
                  type="text"
                  placeholder="Buscar cliente..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
                <span className={styles.searchIcon}>🔍</span>
              </div>
              
              <button 
                className={`${styles.addButton} ${showForm ? styles.disabled : ''}`}
                onClick={handleAgregarCliente}
                disabled={showForm}
              >
                <span className={styles.plusIcon}>+</span>
                Nuevo Cliente
              </button>
            </div>
          </header>

          {/* Alertas */}
          {error && (
            <div className={styles.alertError}>
              <div className={styles.alertContent}>
                <span className={styles.alertIcon}>⚠️</span>
                <span>{error}</span>
              </div>
              <button onClick={() => setError(null)} className={styles.alertClose}>×</button>
            </div>
          )}

          {success && (
            <div className={styles.alertSuccess}>
              <div className={styles.alertContent}>
                <span className={styles.alertIcon}>✓</span>
                <span>{success}</span>
              </div>
              <button onClick={() => setSuccess(null)} className={styles.alertClose}>×</button>
            </div>
          )}

          {/* Contenido principal */}
          <div className={styles.content}>
            {loading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p className={styles.loadingText}>Cargando información...</p>
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
                <div className={styles.statsCard}>
                  <div className={styles.statsItem}>
                    <span className={styles.statsNumber}>{clientes.length}</span>
                    <span className={styles.statsLabel}>Clientes Totales</span>
                  </div>
                  <div className={styles.statsItem}>
                    <span className={styles.statsNumber}>{filteredClientes.length}</span>
                    <span className={styles.statsLabel}>Resultados</span>
                  </div>
                  <div className={styles.statsItem}>
                    <button 
                      onClick={fetchClientes}
                      className={styles.refreshButton}
                      title="Actualizar lista"
                    >
                      <span className={styles.refreshIcon}>↻</span>
                      Actualizar
                    </button>
                  </div>
                </div>

                <div className={styles.tableCard}>
                  <ClienteList 
                    clientes={filteredClientes}
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