import { useState } from 'react';
import styles from './ClienteList.module.css';

const ClienteList = ({ clientes, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Calcular paginación
  const totalItems = clientes.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  
  // Obtener clientes para la página actual
  const currentPageClientes = clientes.slice(startIndex, endIndex);

  if (clientes.length === 0) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>👥</div>
        <h3 className={styles.emptyTitle}>No hay clientes registrados</h3>
        <p className={styles.emptyMessage}>
          Comience agregando nuevos clientes a su sistema
        </p>
      </div>
    );
  }

  const getClienteId = (cliente, index) => {
    return cliente.id_cliente || `temp-${startIndex + index}`;
  };

  // Funciones de paginación
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) {
        pages.push('...');
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...');
      }
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className={styles.tableWrapper}>
      {/* Selector de items por página */}
      <div className={styles.pageSizeSelector}>
        <label className={styles.pageSizeLabel}>
          Mostrar:
          <select 
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className={styles.pageSizeSelect}
          >
            <option value={10}>10 registros</option>
            <option value={25}>25 registros</option>
            <option value={50}>50 registros</option>
            <option value={100}>100 registros</option>
          </select>
        </label>
        <div className={styles.pageInfo}>
          Mostrando {startIndex + 1} - {endIndex} de {totalItems} clientes
        </div>
      </div>
      
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.tableHead}>ID</th>
              <th className={styles.tableHead}>Nombre</th>
              <th className={styles.tableHead}>Apellido</th>
              <th className={styles.tableHead}>Email</th>
              <th className={styles.tableHead}>Teléfono</th>
              <th className={styles.tableHead}>Dirección</th>
              <th className={styles.tableHead}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentPageClientes.map((cliente, index) => {
              const clienteId = getClienteId(cliente, index);
              
              return (
                <tr key={`cliente-${clienteId}`} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <span className={styles.idBadge}>#{clienteId}</span>
                  </td>
                  <td className={styles.tableCell}>
                    <div className={styles.cellContent}>
                      <span className={styles.cellText}>{cliente.nombre || '-'}</span>
                    </div>
                  </td>
                  <td className={styles.tableCell}>
                    <div className={styles.cellContent}>
                      <span className={styles.cellText}>{cliente.apellido || '-'}</span>
                    </div>
                  </td>
                  <td className={styles.tableCell}>
                    <div className={styles.cellContent}>
                      {cliente.email ? (
                        <a 
                          href={`mailto:${cliente.email}`} 
                          className={styles.emailLink}
                        >
                          {cliente.email}
                        </a>
                      ) : (
                        <span className={styles.emptyText}>—</span>
                      )}
                    </div>
                  </td>
                  <td className={styles.tableCell}>
                    <div className={styles.cellContent}>
                      {cliente.telefono ? (
                        <a 
                          href={`tel:${cliente.telefono}`} 
                          className={styles.phoneLink}
                        >
                          {cliente.telefono}
                        </a>
                      ) : (
                        <span className={styles.emptyText}>—</span>
                      )}
                    </div>
                  </td>
                  <td className={styles.tableCell}>
                    <div className={styles.cellContent}>
                      <span className={styles.addressText} title={cliente.direccion}>
                        {cliente.direccion ? (
                          cliente.direccion.length > 25 
                            ? `${cliente.direccion.substring(0, 25)}...`
                            : cliente.direccion
                        ) : (
                          <span className={styles.emptyText}>—</span>
                        )}
                      </span>
                    </div>
                  </td>
                  <td className={styles.tableCell}>
                    <div className={styles.actionButtons}>
                      <button 
                        className={styles.editButton}
                        onClick={() => onEdit(cliente)}
                      >
                        <span className={styles.buttonIcon}>✏️</span>
                        <span className={styles.buttonText}>Editar</span>
                      </button>
                      <button 
                        className={styles.deleteButton}
                        onClick={() => onDelete(clienteId)}
                      >
                        <span className={styles.buttonIcon}>🗑️</span>
                        <span className={styles.buttonText}>Eliminar</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Paginación */}
      <div className={styles.paginationContainer}>
        <div className={styles.paginationInfo}>
          <span className={styles.paginationText}>
            Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong>
          </span>
          <span className={styles.paginationCount}>
            ({totalItems} clientes total)
          </span>
        </div>
        
        <div className={styles.paginationControls}>
          <button
            className={styles.paginationButton}
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
          >
            ««
          </button>
          
          <button
            className={styles.paginationButton}
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            «
          </button>
          
          <div className={styles.pageNumbers}>
            {renderPageNumbers().map((page, index) => (
              page === '...' ? (
                <span key={`ellipsis-${index}`} className={styles.pageEllipsis}>
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  className={`${styles.pageNumber} ${currentPage === page ? styles.activePage : ''}`}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              )
            ))}
          </div>
          
          <button
            className={styles.paginationButton}
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            »
          </button>
          
          <button
            className={styles.paginationButton}
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
          >
            »»
          </button>
        </div>
        
        <div className={styles.pageJump}>
          <input
            type="number"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => {
              const page = parseInt(e.target.value);
              if (page >= 1 && page <= totalPages) {
                setCurrentPage(page);
              }
            }}
            className={styles.pageJumpInput}
          />
          <span className={styles.pageJumpLabel}> de {totalPages}</span>
        </div>
      </div>
    </div>
  );
};

export default ClienteList;