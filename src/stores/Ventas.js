// import { defineStore } from "pinia";
// import axios from "axios";
// import { ref } from "vue";


// export const useVentasStore = defineStore("ventas", () => {
//   const getVentas = async () => {
//     try {
//       const res = await axios.get("http://localhost:4000/api/ventas/listar");
//       return res;
//     } catch (error) {
//       console.error("Error fetching ventas:", error);
//       return error;
//     }
//   };

//   const updateVenta = async (id, data) => {
//     try {
//       const res = await axios.put(`http://localhost:4000/api/ventas/modificar/${id}`, data);
//       return res;
//     } catch (error) {
//       console.error("Error updating Venta:", error);
//       return error;
//     }
//   };

//   const addVenta = async (data) => {
//     try {
//       const res = await axios.post("http://localhost:4000/api/ventas/escribir", data);
//       return res;
//     } catch (error) {
//       console.error("Error adding Venta:", error);
//       return error;
//     }
//   };


//   return { getVentas, updateVenta, addVenta };
// });


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

  const updateVenta = async (id, data) => {
    console.log("ID de la venta enviado desde el frontend:", id);
    console.log("Datos enviados desde el frontend:", data);
    try {
      const res = await axios.put(`http://localhost:4000/api/ventas/modificar/${id}`, data);
      return res;
    } catch (error) {
      console.error("Error updating ventas:", error);
      return error;
    }
  };

  const addVenta = async (data) => {
    try {
      const res = await axios.post("http://localhost:4000/api/ventas/escribir", data);
      return res;
    } catch (error) {
      console.error("Error adding ventas:", error);
      return error;
    }
  };


  return { ventas, getVentas, updateVenta, addVenta };
});
