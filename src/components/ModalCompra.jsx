import { useState } from 'react';
import { registrarCompra } from '../api/comprasApi';
import './ModalCompra.css';

export default function ModalCompra({ producto, onClose, onCompraExitosa }) {
  const [cantidad, setCantidad] = useState(1);
  const [precioCompra, setPrecioCompra] = useState('');
  const [precioVenta, setPrecioVenta] = useState(producto.precio);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Calcular valores automáticos
  const calcularTotalCompra = () => {
    const precio = parseFloat(precioCompra) || 0;
    return (precio * cantidad).toFixed(2);
  };

  const calcularMargen = () => {
    const precioC = parseFloat(precioCompra) || 0;
    const precioV = parseFloat(precioVenta) || 0;
    if (precioC === 0) return 0;
    return (((precioV - precioC) / precioC) * 100).toFixed(1);
  };

  const handleGuardar = async () => {
    setError('');
    
    if (!cantidad || cantidad <= 0) {
      setError('Ingrese una cantidad válida mayor a 0');
      return;
    }
    
    if (!precioCompra || parseFloat(precioCompra) <= 0) {
      setError('Ingrese un precio de compra válido');
      return;
    }
    
    if (!precioVenta || parseFloat(precioVenta) <= 0) {
      setError('Ingrese un precio de venta válido');
      return;
    }

    setLoading(true);

    try {
      await registrarCompra({
        producto: { idProducto: producto.idProducto },
        cantidad: parseInt(cantidad),
        precioCompra: parseFloat(precioCompra),
        precioVenta: parseFloat(precioVenta)
      });

      onCompraExitosa();
      onClose();
      
      // Mostrar toast de éxito (podrías implementar un sistema de notificaciones)
      const event = new CustomEvent('toast', { 
        detail: { 
          titulo: '¡Éxito!', 
          mensaje: 'Compra registrada correctamente', 
          tipo: 'success' 
        } 
      });
      window.dispatchEvent(event);
      
    } catch (error) {
      setError('Error al registrar la compra. Verifique los datos.');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      <div className="modal-overlay" onClick={onClose}></div>
      
      {/* Modal */}
      <div className="modal-compra">
        {/* Header */}
        <div className="modal-header">
          <div className="modal-header-content">
            <h2 className="modal-title">
              <span className="modal-icon">🛒</span>
              Registrar Compra
            </h2>
            <button className="modal-close-btn" onClick={onClose} aria-label="Cerrar">
              ✕
            </button>
          </div>
          <div className="modal-subtitle">
            Producto: <span className="producto-name">{producto.nombre}</span>
            <span className="producto-id">ID: #{producto.idProducto}</span>
          </div>
        </div>

        {/* Info del producto actual */}
        <div className="producto-info">
          <div className="info-item">
            <span className="info-label">Stock actual:</span>
            <span className="info-value stock">{producto.stock} unidades</span>
          </div>
          <div className="info-item">
            <span className="info-label">Precio actual:</span>
            <span className="info-value precio">S/.{producto.precio.toFixed(2)}</span>
          </div>
        </div>

        {/* Formulario */}
        <div className="modal-body">
          <div className="form-grid">
            {/* Cantidad */}
            <div className="input-group">
              <label className="input-label">
                <span className="label-icon">📦</span>
                Cantidad *
              </label>
              <div className="input-with-addons">
                <button 
                  className="quantity-btn minus"
                  onClick={() => setCantidad(prev => Math.max(1, prev - 1))}
                  type="button"
                  disabled={cantidad <= 1}
                >
                  −
                </button>
                <input
                  type="number"
                  min="1"
                  value={cantidad}
                  onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
                  className="modal-input"
                  placeholder="0"
                />
                <button 
                  className="quantity-btn plus"
                  onClick={() => setCantidad(prev => prev + 1)}
                  type="button"
                >
                  +
                </button>
              </div>
              <div className="input-hint">Cantidad a comprar</div>
            </div>

            {/* Precio Compra */}
            <div className="input-group">
              <label className="input-label">
                <span className="label-icon">💰</span>
                Precio de Compra *
              </label>
              <div className="input-with-icon">
                <span className="currency-icon">S/.</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={precioCompra}
                  onChange={(e) => setPrecioCompra(e.target.value)}
                  className="modal-input"
                  placeholder="0.00"
                />
              </div>
              <div className="input-hint">Precio unitario de compra</div>
            </div>

            {/* Precio Venta */}
            <div className="input-group">
              <label className="input-label">
                <span className="label-icon">🏷️</span>
                Precio de Venta *
              </label>
              <div className="input-with-icon">
                <span className="currency-icon">S/.</span>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={precioVenta}
                  onChange={(e) => setPrecioVenta(e.target.value)}
                  className="modal-input"
                  placeholder="0.00"
                />
              </div>
              <div className="input-hint">Precio unitario de venta</div>
            </div>
          </div>

          {/* Resumen de compra */}
          <div className="resumen-compra">
            <h3 className="resumen-title">
              <span className="resumen-icon">📊</span>
              Resumen de la Compra
            </h3>
            <div className="resumen-grid">
              <div className="resumen-item">
                <span className="resumen-label">Cantidad:</span>
                <span className="resumen-value">{cantidad} unidades</span>
              </div>
              <div className="resumen-item">
                <span className="resumen-label">Precio compra:</span>
                <span className="resumen-value">S/.{(parseFloat(precioCompra) || 0).toFixed(2)} c/u</span>
              </div>
              <div className="resumen-item">
                <span className="resumen-label">Precio venta:</span>
                <span className="resumen-value">S/.{(parseFloat(precioVenta) || 0).toFixed(2)} c/u</span>
              </div>
              <div className="resumen-item total">
                <span className="resumen-label">Total compra:</span>
                <span className="resumen-value total-amount">S/.{calcularTotalCompra()}</span>
              </div>
              <div className="resumen-item">
                <span className="resumen-label">Margen de ganancia:</span>
                <span className={`resumen-value margen ${parseFloat(calcularMargen()) > 0 ? 'positivo' : 'negativo'}`}>
                  {calcularMargen()}%
                </span>
              </div>
              <div className="resumen-item">
                <span className="resumen-label">Nuevo stock:</span>
                <span className="resumen-value stock-nuevo">{producto.stock + cantidad} unidades</span>
              </div>
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}
        </div>

        {/* Footer con acciones */}
        <div className="modal-footer">
          <button
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="btn btn-primary"
            onClick={handleGuardar}
            disabled={loading || !precioCompra || !precioVenta}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Procesando...
              </>
            ) : (
              <>
                <span className="btn-icon">💾</span>
                Registrar Compra
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}