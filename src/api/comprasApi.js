import axios from './axiosConfig'; // tu configuración de axios

export const registrarCompra = async (compra) => {
  try {
    const response = await axios.post('/compras', compra);
    return response.data;
  } catch (error) {
    console.error("Error al registrar compra:", error);
    throw error;
  }
};
