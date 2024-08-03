


import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';
import { useUsuariosStore } from "./Usuarios";
import { Notify } from "quasar";

export const useVentasStore = defineStore('ventas', () => {
 
  let loading = ref(false)
  const useUsuarios=useUsuariosStore()
  const ventas = ref([]);

  const getVentas = async () => {
    try {
      loading.value  = true;
      console.log(`este es el usuariotoken ${useUsuarios.token}`);
      console.log(` este es el local ${localStorage.getItem('x-token')}`);
      const res = await axios.get('api/ventas/listar',{
        headers:{
                    "x-token": localStorage.getItem('x-token'),

        }
});

      return res;
    } catch (error) {
      console.error('Error fetching ventas:', error);
      throw error;
    }finally {
      loading.value=false
}
  };
  const updateVenta = async (id, data) => {
    try {
      loading.value = true;
      console.log(localStorage.getItem('x-token'));
      if (!id) {
        throw new Error("ID no definido");
      }
      const res = await axios.put(`api/ventas/modificar/${id}`, data, {
        headers: {
          "x-token": localStorage.getItem('x-token'),
        }
      });
      Notify.create({
        message: 'Venta actualizada correctamente',
        color: "positive",
        position: "top",
      });
      return res;
    } catch (error) {
      loading.value = false;
      console.error("Error actualizando venta:", error);
      if (error.response && error.response.data && error.response.data.errors) {
        Notify.create({
          type: 'negative',
          message: error.response.data.errors[0].msg,
        });
      } else {
        Notify.create({
          type: 'negative',
          message: 'Error al actualizar la venta',
        });
      }
      return error;
    } finally {
      loading.value = false;
    }
  };
  const getVentaID = async (id, data) => {
    console.log("ID de la venta enviado desde el frontend:", id);
    console.log("Datos enviados desde el frontend:", data);
    try {
      const res = await axios.put(`api/ventas/modificar/${id}`, data);
      return res;
    } catch (error) {
      console.error("Error updating ventas:", error);
      return error;
    }
  };

  const addVenta = async (data) => {
    try {
      loading.value =true
      console.log(localStorage.getItem('x-token'));
      const r = await axios.post("api/ventas/escribir", data,{
          headers:{
                      "x-token": localStorage.getItem('x-token'),

          }
      })
      Notify.create({
        message: 'Venta registrada correctamente',
        color: "positive",
        position: "top",
      });
  
      console.log(r);
      return r; // Asegúrate de devolver la respuesta correcta aquí
    } catch (error) {
      // Verifica si error.response y error.response.data existen antes de acceder a ellos
      if (error.response && error.response.data && error.response.data.errors) {
        Notify.create({
          type: 'negative',
          message: error.response.data.errors[0].msg,
        });
      } else {
        Notify.create({
          type: 'negative',
          message: 'Error al registrar la venta',
        });
      }
  
      loading.value = true;
      console.log(error);
      return error;
    } finally {
      loading.value = false;
    }
  };


  return { ventas, getVentas, updateVenta, addVenta, getVentaID, loading, 
    useUsuarios};
},
{persist: true}
);
