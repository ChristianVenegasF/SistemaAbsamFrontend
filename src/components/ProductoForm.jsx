import { useState, useEffect } from "react";

const ProductoForm = ({ onGuardar, productoEditando }) => {

  const [producto, setProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: ""
  });

  useEffect(() => {
    if (productoEditando) {
      setProducto(productoEditando);
    }
  }, [productoEditando]);

  const handleChange = (e) => {
    setProducto({
      ...producto,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onGuardar(producto);
    setProducto({ nombre: "", descripcion: "", precio: "", stock: "" });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{productoEditando ? "Editar Producto" : "Nuevo Producto"}</h3>

      <input name="nombre" placeholder="Nombre" value={producto.nombre} onChange={handleChange} required />
      <input name="descripcion" placeholder="Descripción" value={producto.descripcion} onChange={handleChange} />
      <input name="precio" type="number" step="0.01" placeholder="Precio" value={producto.precio} onChange={handleChange} required />
      <input name="stock" type="number" placeholder="Stock" value={producto.stock} onChange={handleChange} required />

      <button type="submit">
        {productoEditando ? "Actualizar" : "Guardar"}
      </button>
    </form>
  );
};

export default ProductoForm;
