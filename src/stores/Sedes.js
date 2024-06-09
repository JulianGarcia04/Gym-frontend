

import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";


export const useSedesStore = defineStore("sedes", () => {
  let sedes = ref(null)
  const getSedes = async () => {
    try {
      const res = await axios.get("http://localhost:4500/api/sedes/listar");
      sedes.value = res.data.sede
      return res;
    } catch (error) {
      console.error("Error fetching sedes:", error);
      return error;
    }
  };

  const getSedeID = async (id) => {
    try {
      const res = await axios.get(`http://localhost:4500/api/sedes/listarid/${id}`);
      return res;
    } catch (error) {
      console.error("Error fetching usuario by ID:", error);
      return error;
    }
  };

  const listaractivos = async () => {
    try {
      const res = await axios.get("http://localhost:4500/api/sedes/listaractivados");
      return res;
    } catch (error) {
      console.error("Error fetching usuarios:", error);
      return error;
    }
  };
  const listarInactivos = async () => {
    try {
      const res = await axios.get("http://localhost:4500/api/sedes/listardesactivados");
      return res;
    } catch (error) {
      console.error("Error fetching usuarios:", error);
      return error;
    }
  };

  const updateSede = async (id, data) => {
    try {
      const res = await axios.put(`http://localhost:4500/api/sedes/modificar/${id}`, data);
      return res;
    } catch (error) {
      console.error("Error updating sede:", error);
      return error;
    }
  };

  const addSede = async (data) => {
    try {
      const res = await axios.post("http://localhost:4500/api/sedes/escribir", data);
      return res;
    } catch (error) {
      console.error("Error adding sede:", error);
      return error;
    }
  };

  const activateSede = async (id) => {
    try {
      const res = await axios.put(`http://localhost:4500/api/sedes/activar/activos/${id}`);
      return res;
    } catch (error) {
      console.error("Error activating sede:", error);
      return error;
    }
  };

  const deactivateSede = async (id) => {
    try {
      const res = await axios.put(`http://localhost:4500/api/sedes/desactivar/desactivados/${id}`);
      return res;
    } catch (error) {
      console.error("Error deactivating sede:", error);
      return error;
    }
  };

  return { getSedes,getSedeID,listaractivos,listarInactivos, updateSede, addSede, activateSede, deactivateSede, sedes };
});

