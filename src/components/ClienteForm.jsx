import { useState, useEffect } from 'react';
import styles from './ClienteForm.module.css';

const ClienteForm = ({ cliente = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (cliente) {
      setFormData({
        nombre: cliente.nombre || '',
        apellido: cliente.apellido || '',
        email: cliente.email || '',
        telefono: cliente.telefono || '',
        direccion: cliente.direccion || ''
      });
    }
  }, [cliente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setIsDirty(true);
    
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }
    
    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    } else if (formData.apellido.trim().length < 2) {
      newErrors.apellido = 'El apellido debe tener al menos 2 caracteres';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!/^[\d\s\-\+\(\)]{8,20}$/.test(formData.telefono)) {
      newErrors.telefono = 'Teléfono inválido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error en el formulario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (isDirty) {
      if (window.confirm('¿Está seguro de cancelar? Se perderán los cambios no guardados.')) {
        onCancel();
      }
    } else {
      onCancel();
    }
  };

  const formTitle = cliente?.id_cliente ? 'Editar Cliente' : 'Nuevo Cliente';
  const formSubtitle = cliente?.id_cliente 
    ? 'Actualice la información del cliente' 
    : 'Complete todos los campos para registrar un nuevo cliente';

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.formHeader}>
        <div className={styles.formTitleContainer}>
          <div className={styles.formIcon}>
            {cliente?.id_cliente ? '✏️' : '👤'}
          </div>
          <div>
            <h2 className={styles.title}>{formTitle}</h2>
            <p className={styles.subtitle}>{formSubtitle}</p>
          </div>
        </div>
        
        <div className={styles.formStatus}>
          <span className={`${styles.statusBadge} ${cliente?.id_cliente ? styles.statusEdit : styles.statusNew}`}>
            {cliente?.id_cliente ? 'En Edición' : 'Nuevo Registro'}
          </span>
        </div>
      </div>

      <div className={styles.formContent}>
        {/* Sección de Información Personal */}
        <div className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>👤</div>
            <h3 className={styles.sectionTitle}>Información Personal</h3>
          </div>
          
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="nombre" className={styles.label}>
                <span className={styles.labelText}>Nombre</span>
                <span className={styles.required}>*</span>
              </label>
              <div className={styles.inputContainer}>
                <span className={styles.fieldIcon}>👨</span>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.nombre ? styles.errorInput : ''}`}
                  placeholder="Ingrese el nombre completo"
                  disabled={isSubmitting}
                  maxLength="100"
                />
              </div>
              {errors.nombre && (
                <div className={styles.error}>
                  <span className={styles.errorIcon}>⚠️</span>
                  <span>{errors.nombre}</span>
                </div>
              )}
              <div className={styles.fieldHelper}>
                {formData.nombre.length}/100 caracteres
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="apellido" className={styles.label}>
                <span className={styles.labelText}>Apellido</span>
                <span className={styles.required}>*</span>
              </label>
              <div className={styles.inputContainer}>
                <span className={styles.fieldIcon}>👪</span>
                <input
                  type="text"
                  id="apellido"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.apellido ? styles.errorInput : ''}`}
                  placeholder="Ingrese el apellido"
                  disabled={isSubmitting}
                  maxLength="100"
                />
              </div>
              {errors.apellido && (
                <div className={styles.error}>
                  <span className={styles.errorIcon}>⚠️</span>
                  <span>{errors.apellido}</span>
                </div>
              )}
              <div className={styles.fieldHelper}>
                {formData.apellido.length}/100 caracteres
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Contacto */}
        <div className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>📞</div>
            <h3 className={styles.sectionTitle}>Información de Contacto</h3>
          </div>
          
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                <span className={styles.labelText}>Correo Electrónico</span>
                <span className={styles.optional}>(Opcional)</span>
              </label>
              <div className={styles.inputContainer}>
                <span className={styles.fieldIcon}>✉️</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.email ? styles.errorInput : ''}`}
                  placeholder="ejemplo@correo.com"
                  disabled={isSubmitting}
                />
              </div>
              {errors.email && (
                <div className={styles.error}>
                  <span className={styles.errorIcon}>⚠️</span>
                  <span>{errors.email}</span>
                </div>
              )}
              <div className={styles.fieldHelper}>
                Se enviarán notificaciones a este email
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="telefono" className={styles.label}>
                <span className={styles.labelText}>Teléfono</span>
                <span className={styles.required}>*</span>
              </label>
              <div className={styles.inputContainer}>
                <span className={styles.fieldIcon}>📱</span>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.telefono ? styles.errorInput : ''}`}
                  placeholder="+51 999 888 777"
                  disabled={isSubmitting}
                />
              </div>
              {errors.telefono && (
                <div className={styles.error}>
                  <span className={styles.errorIcon}>⚠️</span>
                  <span>{errors.telefono}</span>
                </div>
              )}
              <div className={styles.fieldHelper}>
                Formato: +51 999 888 777
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Dirección */}
        <div className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>📍</div>
            <h3 className={styles.sectionTitle}>Dirección</h3>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="direccion" className={styles.label}>
              <span className={styles.labelText}>Dirección Completa</span>
              <span className={styles.optional}>(Opcional)</span>
            </label>
            <div className={styles.textareaContainer}>
              <span className={styles.fieldIcon}>🏠</span>
              <textarea
                id="direccion"
                name="direccion"
                value={formData.direccion}
                onChange={handleChange}
                rows="4"
                placeholder="Calle, número, ciudad, provincia, código postal..."
                className={`${styles.textarea} ${isSubmitting ? styles.disabled : ''}`}
                disabled={isSubmitting}
                maxLength="500"
              />
            </div>
            <div className={styles.fieldHelper}>
              {formData.direccion.length}/500 caracteres
            </div>
          </div>
        </div>
      </div>

      <div className={styles.formFooter}>
        <div className={styles.footerActions}>
          <button 
            type="button" 
            className={styles.cancelButton}
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            <span className={styles.buttonIcon}>←</span>
            Cancelar
          </button>
          
          <div className={styles.submitActions}>
            {isDirty && (
              <span className={styles.unsavedChanges}>
                ⚠️ Tiene cambios sin guardar
              </span>
            )}
            <button 
              type="submit" 
              className={`${styles.submitButton} ${isDirty ? styles.hasChanges : ''}`}
              disabled={isSubmitting || !isDirty}
            >
              {isSubmitting ? (
                <span className={styles.loading}>
                  <span className={styles.spinner}></span>
                  Procesando...
                </span>
              ) : (
                <>
                  <span className={styles.buttonIcon}>
                    {cliente?.id_cliente ? '💾' : '✅'}
                  </span>
                  {cliente?.id_cliente ? 'Actualizar Cliente' : 'Registrar Cliente'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default ClienteForm;