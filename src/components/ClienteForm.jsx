import { useState, useEffect } from 'react';
import styles from './ClienteForm.module.css';

const ClienteForm = ({ cliente = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    dni: '',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [initialData, setInitialData] = useState({});

  useEffect(() => {
    if (cliente && cliente.id) {
      const initial = {
        dni: cliente.dni || '',
        nombre: cliente.nombre || '',
        apellido: cliente.apellido || '',
        email: cliente.email || '',
        telefono: cliente.telefono || '',
        direccion: cliente.direccion || ''
      };
      
      setFormData(initial);
      setInitialData(initial);
      setIsDirty(false);
    } else {
      setFormData({
        dni: '',
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        direccion: ''
      });
      setInitialData({});
      setIsDirty(false);
    }
  }, [cliente]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    let newValue = value;
    
    // Validación en tiempo real para DNI (solo números)
    if (name === 'dni') {
      newValue = value.replace(/\D/g, '');
    }
    
    // Para teléfono, permitir números, espacios y signos comunes
    if (name === 'telefono') {
      newValue = value.replace(/[^\d\s+\-()]/g, '');
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Verificar si hay cambios
    const hasChanges = JSON.stringify({...initialData, [name]: newValue}) !== JSON.stringify(initialData);
    setIsDirty(hasChanges);
    
    // Limpiar error del campo que se está editando
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validar DNI (8 dígitos) - requerido
    if (!formData.dni.trim()) {
      newErrors.dni = 'El DNI es requerido';
    } else if (!/^\d{8}$/.test(formData.dni)) {
      newErrors.dni = 'El DNI debe tener 8 dígitos exactos';
    }
    
    // Validar nombre (requerido)
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    } else if (formData.nombre.trim().length > 100) {
      newErrors.nombre = 'El nombre no puede exceder 100 caracteres';
    }
    
    // Validar apellido (requerido)
    if (!formData.apellido.trim()) {
      newErrors.apellido = 'El apellido es requerido';
    } else if (formData.apellido.trim().length < 2) {
      newErrors.apellido = 'El apellido debe tener al menos 2 caracteres';
    } else if (formData.apellido.trim().length > 100) {
      newErrors.apellido = 'El apellido no puede exceder 100 caracteres';
    }
    
    // Validar email (opcional, pero si existe debe ser válido)
    if (formData.email && formData.email.trim()) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = 'Email inválido';
      } else if (formData.email.length > 100) {
        newErrors.email = 'El email no puede exceder 100 caracteres';
      }
    }
    
    // Validar teléfono (requerido)
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (formData.telefono.replace(/\D/g, '').length < 6) {
      newErrors.telefono = 'El teléfono debe tener al menos 6 dígitos';
    } else if (formData.telefono.replace(/\D/g, '').length > 15) {
      newErrors.telefono = 'El teléfono no puede exceder 15 dígitos';
    }
    
    // Validar dirección (opcional)
    if (formData.direccion && formData.direccion.length > 255) {
      newErrors.direccion = 'La dirección no puede exceder 255 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm() || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Crear objeto con datos formateados
      const clienteData = {
        dni: formData.dni.trim(),
        nombre: formData.nombre.trim(),
        apellido: formData.apellido.trim(),
        email: formData.email.trim() || null,
        telefono: formData.telefono.trim(),
        direccion: formData.direccion.trim() || null
      };
      
      console.log('Enviando datos:', clienteData);
      await onSubmit(clienteData);
    } catch (error) {
      console.error("Error en el formulario:", error);
      // Los errores del backend se manejan en la página principal
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

  const formTitle = cliente?.id ? 'Editar Cliente' : 'Nuevo Cliente';
  const formSubtitle = cliente?.id 
    ? 'Actualice la información del cliente' 
    : 'Complete todos los campos para registrar un nuevo cliente';

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.formHeader}>
        <div className={styles.formTitleContainer}>
          <div className={styles.formIcon}>
            {cliente?.id ? '✏️' : '👤'}
          </div>
          <div>
            <h2 className={styles.title}>{formTitle}</h2>
            <p className={styles.subtitle}>{formSubtitle}</p>
          </div>
        </div>
        
        <div className={styles.formStatus}>
          <span className={`${styles.statusBadge} ${cliente?.id ? styles.statusEdit : styles.statusNew}`}>
            {cliente?.id ? 'En Edición' : 'Nuevo Registro'}
          </span>
        </div>
      </div>

      <div className={styles.formContent}>
        {/* Sección de Identificación */}
        <div className={styles.formSection}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionIcon}>🆔</div>
            <h3 className={styles.sectionTitle}>Identificación</h3>
          </div>
          
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="dni" className={styles.label}>
                <span className={styles.labelText}>DNI</span>
                <span className={styles.required}>*</span>
              </label>
              <div className={styles.inputContainer}>
                <span className={styles.fieldIcon}>🆔</span>
                <input
                  type="text"
                  id="dni"
                  name="dni"
                  value={formData.dni}
                  onChange={handleChange}
                  className={`${styles.input} ${errors.dni ? styles.errorInput : ''}`}
                  placeholder="Ingrese 8 dígitos del DNI"
                  disabled={isSubmitting || !!cliente?.id}
                  maxLength="8"
                  pattern="\d*"
                  inputMode="numeric"
                  autoComplete="off"
                />
              </div>
              {errors.dni && (
                <div className={styles.error}>
                  <span className={styles.errorIcon}>⚠️</span>
                  <span>{errors.dni}</span>
                </div>
              )}
              <div className={styles.fieldHelper}>
                {formData.dni.length}/8 dígitos
                {cliente?.id && (
                  <span className={styles.fieldWarning}>
                    ⚠️ El DNI no se puede modificar
                  </span>
                )}
              </div>
            </div>

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
                  placeholder="Ingrese el nombre"
                  disabled={isSubmitting}
                  maxLength="100"
                  autoComplete="off"
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
                  autoComplete="off"
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
                  maxLength="100"
                  autoComplete="email"
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
                  placeholder="999888777 o +51 999 888 777"
                  disabled={isSubmitting}
                  maxLength="20"
                  autoComplete="tel"
                />
              </div>
              {errors.telefono && (
                <div className={styles.error}>
                  <span className={styles.errorIcon}>⚠️</span>
                  <span>{errors.telefono}</span>
                </div>
              )}
              <div className={styles.fieldHelper}>
                Mínimo 6 dígitos, máximo 15 dígitos
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
                rows="3"
                placeholder="Calle, número, ciudad, provincia..."
                className={`${styles.textarea} ${errors.direccion ? styles.errorTextarea : ''} ${isSubmitting ? styles.disabled : ''}`}
                disabled={isSubmitting}
                maxLength="255"
                autoComplete="street-address"
              />
            </div>
            {errors.direccion && (
              <div className={styles.error}>
                <span className={styles.errorIcon}>⚠️</span>
                <span>{errors.direccion}</span>
              </div>
            )}
            <div className={styles.fieldHelper}>
              {formData.direccion.length}/255 caracteres
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
              className={`${styles.submitButton} ${isSubmitting ? styles.submitting : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className={styles.loading}>
                  <span className={styles.spinner}></span>
                  Procesando...
                </span>
              ) : (
                <>
                  <span className={styles.buttonIcon}>
                    {cliente?.id ? '💾' : '✅'}
                  </span>
                  {cliente?.id ? 'Actualizar Cliente' : 'Registrar Cliente'}
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