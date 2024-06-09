import { defineStore } from "pinia";
import axios from "axios"
import { ref } from "vue";

export const useInventarioStore = defineStore("inventario", () => {
  let token = ref("");
  let user = ref({})
  const getInventario = async () => {
    try {
      const res = await axios.get("http://localhost:4500/api/inventario/listar");
      return res;
    } catch (error) {
      console.error("Error fetching usuarios:", error);
      return error;
    }
  };

  const getInventariosID = async (id) => {
    try {
      const res = await axios.get(`http://localhost:4500/api/inventario/listarid/${id}`);
      return res;
    } catch (error) {
      console.error("Error fetching usuario by ID:", error);
      return error;
    }
  };
  
  const updateInventario = async (id, data) => {
    try {
      const res = await axios.put(`http://localhost:4500/api/inventario/modificar/${id}`, data);
      return res;
    } catch (error) {
      console.error("Error updating usuario:", error);
      return error;
    }
  };

  const addInventario = async (data) => {
    try {
      const res = await axios.post("http://localhost:4500/api/inventario/escribir", data);
      return res;
    } catch (error) {
      console.error("Error adding usuario:", error);
      return error;
    }
  };

  return { getInventario, getInventariosID, updateInventario, addInventario};
}, {
  persist: true
});
