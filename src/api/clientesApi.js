import api from "./axiosConfig";

// Obtener todos los clientes
export const obtenerClientes = () => {
  return api.get("/clientes");
};

// Obtener cliente por ID
export const obtenerClientePorId = (id) => {
  return api.get(`/clientes/${id}`);
};

// Crear cliente
export const crearCliente = (cliente) => {
  return api.post("/clientes", cliente);
};

// Actualizar cliente
export const actualizarCliente = (id, cliente) => {
  return api.put(`/clientes/${id}`, cliente);
};

// Eliminar cliente
export const eliminarCliente = (id) => {
  return api.delete(`/clientes/${id}`);
};

// Buscar clientes (opcional - si tu API tiene endpoint de búsqueda)
export const buscarClientes = (termino) => {
  return api.get(`/clientes/buscar?q=${termino}`);
};