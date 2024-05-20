import { defineStore } from "pinia";
import axios from "axios";

export const useMantenimientosStore = defineStore("mantenimientos", () => {
  const getMantenimientos = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/mantenimiento/listar");
      return res;
    } catch (error) {
      console.error("Error fetching mantenimientos:", error);
      return error;
    }
  };

  return { getMantenimientos };
});


