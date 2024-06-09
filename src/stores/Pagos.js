import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const usePagosStore = defineStore('pagos', () => {
  const pagos = ref([]);

  const getPagos = async () => {
    try {
      const res = await axios.get('http://localhost:4500/api/pagos/listar');
      pagos.value = res.data;
      return res;
    } catch (error) {
      console.error('Error fetching pagos:', error);
      throw error;
    }
  };

  const getPagoID = async (id) => {
    try {
      const res = await axios.get(`http://localhost:4500/api/pagos/listarid/${id}`);
      return res;
    } catch (error) {
      console.error("Error fetching pago by ID:", error);
      return error;
    }
  };
const listarActivos = async () => {
  try {
    const res = await axios.get("http://localhost:4500/api/pagos/listaractivados");
    return res;
  } catch (error) {
    console.error("Error fetching pago:", error);
    return error;
  }
};

const listarInactivos = async () => {
  try {
    const res = await axios.get("http://localhost:4500/api/pagos/listardesactivados");
    return res;
  } catch (error) {
    console.error("Error fetching pagos:", error);
    return error;
  }
};

const updatePago = async (id, data) => {
  try {
    const res = await axios.put(`http://localhost:4500/api/pagos/modificar/${id}`, data);
    return res;
  } catch (error) {
    console.error("Error updating pagos:", error);
    return error;
  }
};

const addPago = async (data) => {
  try {
    const res = await axios.post("http://localhost:4500/api/pagos/escribir", data);
    return res;
  } catch (error) {
    console.error("Error adding pago:", error);
    return error;
  }
};

const activatePago = async (id) => {
  try {
    const res = await axios.put(`http://localhost:4500/api/pagos/activar/activos/${id}`);
    return res;
  } catch (error) {
    console.error("Error activating pago:", error);
    return error;
  }
};

const desactivatePago = async (id) => {
  try {
    const res = await axios.put(`http://localhost:4500/api/pagos/desactivar/desactivados/${id}`);
    return res;
  } catch (error) {
    console.error("Error deactivating pago:", error);
    return error;
  }
};
return {  getPagos,getPagoID, listarActivos, listarInactivos,updatePago,addPago,activatePago,desactivatePago };
});