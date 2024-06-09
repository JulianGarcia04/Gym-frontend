import { defineStore } from "pinia";
import axios from "axios"
import { ref } from "vue";

export const useMaquinasStore = defineStore("maquinas", () => {
  let token = ref("");
  let user = ref({})
  const getMaquinas = async () => {
    try {
      const res = await axios.get("http://localhost:4500/api/maquinas/listar");
      return res;
    } catch (error) {
      console.error("Error fetching usuarios:", error);
      return error;
    }
  };

  const getMaquinasID = async (id) => {
    try {
      const res = await axios.get(`http://localhost:4500/api/maquinas/listarid/${id}`);
      return res;
    } catch (error) {
      console.error("Error fetching usuario by ID:", error);
      return error;
    }
  };
  
  const updateMaquina = async (id, data) => {
    try {
      const res = await axios.put(`http://localhost:4500/api/maquinas/modificar/${id}`, data);
      return res;
    } catch (error) {
      console.error("Error updating usuario:", error);
      return error;
    }
  };

  const addMaquina = async (data) => {
    try {
      const res = await axios.post("http://localhost:4500/api/maquinas/escribir", data);
      return res;
    } catch (error) {
      console.error("Error adding usuario:", error);
      return error;
    }
  };

  const activateMaquina = async (id) => {
    try {
      const res = await axios.put(`http://localhost:4500/api/maquinas/activar/activos/${id}`);
      return res;
    } catch (error) {
      console.error("Error activating usuario:", error);
      return error;
    }
  };

  const deactivateMaquina = async (id) => {
    try {
      const res = await axios.put(`http://localhost:4500/api/maquinas/desactivar/desactivados/${id}`);
      return res;
    } catch (error) {
      console.error("Error deactivating usuario:", error);
      return error;
    }
  };

const listarActivos = async () => {
  console.log(token.value);
  try {
    const res = await axios.get("http://localhost:4500/api/maquinas/listaractivados", {
      headers: {
        token:token.value}
    });
    return res;
  } catch (error) {
    console.error("Error fetching usuarios:", error);
    return error;
  }
};
const listarInactivos = async () => {
  try {
    const res = await axios.get("http://localhost:4500/api/maquinas/listardesactivados");
    return res;
  } catch (error) {
    console.error("Error fetching usuarios:", error);
    return error;
  }
};

  return { getMaquinas, updateMaquina, addMaquina, activateMaquina, deactivateMaquina, getMaquinasID, listarActivos, listarInactivos};
}, {
  persist: true
});
