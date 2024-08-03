

import { defineStore } from "pinia";
import axios from "axios";

export const useIntervalStore = defineStore('intervalStore', () => {
  const listarinterval = async () => {
    try {
      const response = await axios.get("api/interval/listar");
      console.log("interval listadoooooooooo:", response.data);
      return response;
    } catch (error) {
      console.error("No se pudo obtener la lista de intervalos", error);
      throw error;
    }
  };

  const startInterval = () => {

    listarinterval();
    
    setInterval(listarinterval, 600000); // 600000 ms = 10 min
  };

  return { listarinterval, startInterval };
}, { persist: true });


    
    