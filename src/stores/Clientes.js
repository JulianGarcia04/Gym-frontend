import { defineStore } from "pinia";
import axios from "axios"
import { ref } from "vue";

export const useClientesStore = defineStore("clientes", () => {
  const getClientes = async () => {
    try {
      const res = await axios.get("http://localhost:4500/api/clientes/listar");
      return res;
    } catch (error) {
      console.error("Error fetching clientes:", error);
      return error;
    }
  };

  const getClientesID = async (id) => {
    try {
      const res = await axios.get(`http://localhost:4500/api/clientes/listarid/${id}`);
      return res;
    } catch (error) {
      console.error("Error fetching clientes by ID:", error);
      return error;
    }
  };
  
  const updateCliente = async (id, data) => {
    try {
      const res = await axios.put(`http://localhost:4500/api/clientes/modificar/${id}`, data);
      return res;
    } catch (error) {
      console.error("Error updating clientes:", error);
      return error;
    }
  };
  const listarActivos = async () => {
    try {
      const res = await axios.get("http://localhost:4500/api/clientes/listaractivados");
      return res;
    } catch (error) {
      console.error("Error fetching usuarios:", error);
      return error;
    }
  };
  const listarInactivos = async () => {
    try {
      const res = await axios.get("http://localhost:4500/api/clientes/listardesactivados");
      return res;
    } catch (error) {
      console.error("Error fetching usuarios:", error);
      return error;
    }
  };

  const addCliente = async (data) => {
    try {
      const res = await axios.post("http://localhost:4500/api/clientes/escribir", data);
      return res;
    } catch (error) {
      console.error("Error adding clientes:", error);
      return error;
    }
  };

  const activateCliente = async (id) => {
    try {
      const res = await axios.put(`http://localhost:4500/api/clientes/activar/activados/${id}`);
      return res;
    } catch (error) {
      console.error("Error activating clientes:", error);
      return error;
    }
  };

  const desactivateCliente = async (id) => {
    try {
      const res = await axios.put(`http:///localhost:4500/api/clientes/desactivar/desactivados/${id}`);
      return res;
    } catch (error) {
      console.error("Error deactivating clientes:", error);
      return error;
    }
  };




  return { getClientes, listarActivos, listarInactivos, updateCliente, addCliente, activateCliente, desactivateCliente, getClientesID};
}, {
  persist: true
});