import { defineStore } from "pinia";
import axiosInstance from "../utils/axiosInstance";
import { ref } from "vue";

export const useUsuariosStore = defineStore("usuarios", () => {
  const getUsuarios = async () => {
    try {
      const res = await axiosInstance.get("/usuarios/listar");
      return res;
    } catch (error) {
      console.error("Error fetching usuarios:", error);
      return error;
    }
  };

  return { getUsuarios };
});

