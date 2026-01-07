import { useState } from 'react';
import styles from './ClienteList.module.css';

const ClienteList = ({ clientes, onEdit, onDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState('desc');

  // Ordenar clientes
  const sortedClientes = [...clientes].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    if (sortField === 'id') {
      aValue = parseInt(aValue) || 0;
      bValue = parseInt(bValue) || 0;
    }
    
    if (sortField === 'dni') {
      aValue = parseInt(aValue) || 0;
      bValue = parseInt(bValue) || 0;
    }
    
    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Calcular paginación
  const totalItems = sortedClientes.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  
  // Obtener clientes para la página actual
  const currentPageClientes = sortedClientes.slice(startIndex, endIndex);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return '↕️';
    return sortDirection === 'asc' ? '↑' : '↓';
  };

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
              <th className={styles.tableHead} onClick={() => handleSort('id')}>
                <div className={styles.sortableHeader}>
                  ID {getSortIcon('id')}
                </div>
              </th>
              <th className={styles.tableHead} onClick={() => handleSort('dni')}>
                <div className={styles.sortableHeader}>
                  DNI {getSortIcon('dni')}
                </div>
              </th>
              <th className={styles.tableHead} onClick={() => handleSort('nombre')}>
                <div className={styles.sortableHeader}>
                  Nombre {getSortIcon('nombre')}
                </div>
              </th>
              <th className={styles.tableHead} onClick={() => handleSort('apellido')}>
                <div className={styles.sortableHeader}>
                  Apellido {getSortIcon('apellido')}
                </div>
              </th>
              <th className={styles.tableHead}>Email</th>
              <th className={styles.tableHead}>Teléfono</th>
              <th className={styles.tableHead}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentPageClientes.map((cliente) => (
              <tr key={`cliente-${cliente.id}`} className={styles.tableRow}>
                <td className={styles.tableCell}>
                  <span className={styles.idBadge}>#{cliente.id}</span>
                </td>
                <td className={styles.tableCell}>
                  <div className={styles.cellContent}>
                    <span className={styles.dniText}>{cliente.dni || '-'}</span>
                  </div>
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
                        title={cliente.email}
                      >
                        {cliente.email.length > 20 
                          ? `${cliente.email.substring(0, 20)}...` 
                          : cliente.email}
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
                        title={cliente.telefono}
                      >
                        {cliente.telefono}
                      </a>
                    ) : (
                      <span className={styles.emptyText}>—</span>
                    )}
                  </div>
                </td>
                <td className={styles.tableCell}>
                  <div className={styles.actionButtons}>
                    <button 
                      className={styles.editButton}
                      onClick={() => onEdit(cliente)}
                      title="Editar cliente"
                    >
                      <span className={styles.buttonIcon}>✏️</span>
                      <span className={styles.buttonText}>Editar</span>
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={() => onDelete(cliente.id)}
                      title="Eliminar cliente"
                    >
                      <span className={styles.buttonIcon}>🗑️</span>
                      <span className={styles.buttonText}>Eliminar</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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
            title="Primera página"
          >
            ««
          </button>
          
          <button
            className={styles.paginationButton}
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            title="Página anterior"
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
                  title={`Página ${page}`}
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
            title="Página siguiente"
          >
            »
          </button>
          
          <button
            className={styles.paginationButton}
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
            title="Última página"
          >
            »»
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClienteList;