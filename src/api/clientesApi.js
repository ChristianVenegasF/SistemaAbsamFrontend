import api from "./axiosConfig";

// Obtener todos los clientes
export const obtenerClientes = () => {
  return api.get("/clientes");
};

// Obtener cliente por ID
export const obtenerClientePorId = (id) => {
  return api.get(`/clientes/${id}`);
};

// Obtener cliente por DNI
export const obtenerClientePorDni = (dni) => {
  return api.get(`/clientes/dni/${dni}`);
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