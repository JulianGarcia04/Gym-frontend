import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const usePagosStore = defineStore('pagos', () => {
  const pagos = ref([]);

  const getPagos = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/pagos/listar');
      pagos.value = res.data;
      return res;
    } catch (error) {
      console.error('Error fetching pagos:', error);
      throw error;
    }
  };

  return { pagos, getPagos };
});
