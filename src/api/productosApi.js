import api from "./axiosConfig";

// Obtener todos los productos
export const obtenerProductos = () => {
  return api.get("/productos");
};

// Obtener producto por ID
export const obtenerProductoPorId = (id) => {
  return api.get(`/productos/${id}`);
};

// Crear producto
export const crearProducto = (producto) => {
  return api.post("/productos", producto);
};

// Actualizar producto
export const actualizarProducto = (id, producto) => {
  return api.put(`/productos/${id}`, producto);
};

// Eliminar producto
export const eliminarProducto = (id) => {
  return api.delete(`/productos/${id}`);
};
