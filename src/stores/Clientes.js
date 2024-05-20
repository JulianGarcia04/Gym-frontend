import { defineStore } from "pinia";
import axiosInstance from "../utils/axiosInstance";
import { ref } from "vue";

export const useClientesStore = defineStore("clientes", () => {
  const getClientes = async () => {
    try {
      const res = await axiosInstance.get("/clientes/listar");
      return res;
    } catch (error) {
      console.error("Error fetching clientes:", error);
      return error;
    }
  };

  return { getClientes };
});
