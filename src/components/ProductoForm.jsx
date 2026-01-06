import { useState, useEffect } from 'react';
import styles from './ProductoForm.module.css';

const ProductoForm = ({ onGuardar, productoEditando, onCancelar }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    stock: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (productoEditando) {
      setFormData({
        nombre: productoEditando.nombre,
        precio: productoEditando.precio.toString(),
        stock: productoEditando.stock.toString()
      });
    }
  }, [productoEditando]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    
    if (!formData.precio || isNaN(formData.precio) || parseFloat(formData.precio) <= 0) {
      newErrors.precio = 'Ingrese un precio válido mayor a 0';
    }
    
    if (!formData.stock || isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Ingrese un stock válido (mayor o igual a 0)';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    const producto = {
      ...formData,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock),
      ...(productoEditando && { idProducto: productoEditando.idProducto })
    };
    
    onGuardar(producto);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      precio: '',
      stock: ''
    });
    setErrors({});
  };

  const handleCancel = () => {
    resetForm();
    onCancelar?.();
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formHeader}>
        <h3 className={styles.formTitle}>
          {productoEditando ? '✏️ Editar Producto' : '＋ Nuevo Producto'}
        </h3>
        {productoEditando && (
          <span className={styles.badge}>Editando ID: #{productoEditando.idProducto}</span>
        )}
      </div>

      <div className={styles.formGrid}>
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>
            Nombre del Producto *
          </label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className={`${styles.input} ${errors.nombre ? styles.inputError : ''}`}
            placeholder="Ej: Laptop Dell XPS 13"
            autoFocus
          />
          {errors.nombre && (
            <span className={styles.errorText}>{errors.nombre}</span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>
            Precio (USD) *
          </label>
          <div className={styles.inputWithIcon}>
            <span className={styles.currency}>$</span>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              className={`${styles.input} ${errors.precio ? styles.inputError : ''}`}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
          {errors.precio && (
            <span className={styles.errorText}>{errors.precio}</span>
          )}
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.inputLabel}>
            Stock Disponible *
          </label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className={`${styles.input} ${errors.stock ? styles.inputError : ''}`}
            placeholder="0"
            min="0"
          />
          {errors.stock && (
            <span className={styles.errorText}>{errors.stock}</span>
          )}
          {formData.stock && (
            <div className={styles.stockHint}>
              {parseInt(formData.stock) === 0 ? '⚠️ Producto sin stock' : 
               parseInt(formData.stock) <= 10 ? '⚠️ Stock bajo' : '✅ Stock suficiente'}
            </div>
          )}
        </div>
      </div>

      <div className={styles.formActions}>
        <button
          type="button"
          onClick={handleCancel}
          className={`${styles.button} ${styles.buttonOutline}`}
        >
          Cancelar
        </button>
        
        <button
          type="submit"
          className={`${styles.button} ${styles.buttonPrimary}`}
        >
          {productoEditando ? '💾 Actualizar Producto' : '➕ Crear Producto'}
        </button>
      </div>
    </form>
  );
};

export default ProductoForm;