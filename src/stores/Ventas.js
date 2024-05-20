import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';

export const useVentasStore = defineStore('ventas', () => {
  const ventas = ref([]);

  const getVentas = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/ventas/listar');
      ventas.value = res.data;
      return res;
    } catch (error) {
      console.error('Error fetching ventas:', error);
      throw error;
    }
  };

  return { ventas, getVentas };
});
