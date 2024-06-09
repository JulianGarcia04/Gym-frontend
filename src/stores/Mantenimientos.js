import { defineStore } from "pinia";
import axios from "axios"
import { ref } from "vue";

export const useMantenimientoStore = defineStore("mantenimiento", () => {
  let token = ref("");
  let user = ref({})
  const getMantenimiento = async () => {
    try {
      const res = await axios.get("http://localhost:4500/api/mantenimiento/listar");
      return res;
    } catch (error) {
      console.error("Error fetching mantenimiento:", error);
      return error;
    }
  };

  const getMantenimientoID = async (id) => {
    try {
      const res = await axios.get("http://localhost:4500/api/mantenimiento/listarid/${id}");
      return res;
    } catch (error) {
      console.error("Error fetching mantenimiento by ID:", error);
      return error;
    }
  };
  
  const updateMantenimiento = async (id, data) => {
    try {
      const res = await axios.put("http://localhost:4500/api/mantenimiento/modificar/${id}, data");
      return res;
    } catch (error) {
      console.error("Error updating mantenimiento:", error);
      return error;
    }
  };

  const addMantenimiento= async (data) => {
    try {
      const res = await axios.post("http://localhost:4500/api/mantenimiento/escribir", data);
      return res;
    } catch (error) {
      console.error("Error adding mantenimiento:", error);
      return error;
    }
  };

  const activateMantenimiento = async (id) => {
    try {
      const res = await axios.put("http://localhost:4500/api/mantenimiento/activar/activos/${id}");
      return res;
    } catch (error) {
      console.error("Error activating mantenimiento:", error);
      return error;
    }
  };

  const deactivateMantenimiento = async (id) => {
    try {
      const res = await axios.put("http://localhost:4500/api/mantenimiento/desactivar/desactivados/${id}");
      return res;
    } catch (error) {
      console.error("Error deactivating mantenimiento:", error);
      return error;
    }
  };

const listarActivos = async () => {
  console.log(token.value);
  try {
    const res = await axios.get("http://localhost:4500/api/mantenimiento/listaractivados", {
      headers: {
        token:token.value}
    });
    return res;
  } catch (error) {
    console.error("Error fetching mantenimiento:", error);
    return error;
  }
};
const listarInactivos = async () => {
  try {
    const res = await axios.get("http://localhost:4500/api/mantenimiento/listardesactivados");
    return res;
  } catch (error) {
    console.error("Error fetching mantenimiento:", error);
    return error;
  }
};

  return { getMantenimiento, getMantenimientoID, updateMantenimiento, addMantenimiento, activateMantenimiento, deactivateMantenimiento, listarActivos, listarInactivos};
}, {
  persist: true
});