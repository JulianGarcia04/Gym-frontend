import { defineStore } from "pinia";
import axios from "axios";

export const useMaquinasStore = defineStore("maquinas", () => {
  const getMaquinas = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/maquinas/listar");
      return res;
    } catch (error) {
      console.error("Error fetching maquinas:", error);
      return error;
    }
  };

  return { getMaquinas };
});

