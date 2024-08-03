
import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useUsuariosStore } from "./Usuarios";
import { Notify } from "quasar";

export const useClientesStore = defineStore("clientes", () => {
  
  const useUsuarios=useUsuariosStore()

  let clientes = ref([]);
  const loading = ref(false); 

  const getClientes = async (payload) => {
    try {
      loading.value = true;
      console.log(localStorage.getItem('x-token'));

      let ruta;
      if (payload == null) ruta = "api/clientes/listar";
      else ruta=`api/clientes/listar?busqueda=${payload}`;
      const response = await axios.get(ruta, {
        headers: {
                 "x-token": localStorage.getItem('x-token'),
        },
      });
      return response;
    } catch (error) {
      console.error("NO se pudo obtener la lista de clientes", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };
  const listarClientesporPlan = async (id) => {
    try {
      loading.value = true;
      console.log(`este es el usuariotoken ${useUsuarios.token}`);
      console.log(` este es el local ${localStorage.getItem('x-token')}`);

      const response = await axios.get(`api/clientes/porplan/${id}`, {
        headers: {
                 "x-token": localStorage.getItem('x-token'),
        },
      });
      return response;
    } catch (error) {
      console.error("NO se pudo obtener la lista de clientes", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };
  const listarClientesporCumpleanos = async (dia, mes) => {
    try {
        loading.value = true;
        console.log(localStorage.getItem('x-token'));

        const response = await axios.get(`api/clientes/cumpleanos?dia=${dia}&mes=${mes}`, {
            headers: {
                       "x-token": localStorage.getItem('x-token'),
            },
        });
        return response.data;
    } catch (error) {
        console.error("No se pudo obtener la lista de clientes", error);
        throw error;
    } finally {
        loading.value = false;
    }
};

  const getClientesID = async (id) => {
    loading.value = true;
    try {
      const res = await axios.get(`api/clientes/listarid/${id}`);
      return res;
    } catch (error) {
      console.error("Error fetching clientes by ID:", error);
      return error;
    } finally {
      loading.value = false;
    }
  };

  const updateCliente = async (id, data) => {
    try {
      loading.value = true;
      console.log(localStorage.getItem('x-token'));
      const r = await axios.put(`api/clientes/modificar/${id}`, data, {
        headers: {
                 "x-token": localStorage.getItem('x-token'),
        },
      });
      console.log(r);
      return r;
    } catch (error) {
      loading.value = true;
      console.log(error);
      return error;
    } finally {
      loading.value = false;
    }
  };
  const listarActivos = async () => {
    try {
      loading.value = true;
      console.log(localStorage.getItem('x-token'));

      const response = await axios.get("api/clientes/listaractivados", {
        headers: {
                 "x-token": localStorage.getItem('x-token'),
        },
      });
      return response;
    } catch (error) {
      console.error("NO se pudo obtener la lista de clientes", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const listarInactivos = async () => {
    try {
      loading.value = true;
      console.log(localStorage.getItem('x-token'));
      const response = await axios.get("api/clientes/listardesactivados", {
        headers: {
                 "x-token": localStorage.getItem('x-token'),
        },
      });
      return response;
    } catch (error) {
      console.error("NO se pudo obtener la lista de clientes", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const addCliente = async (data) => {
    try {
      loading.value = true;
      console.log(localStorage.getItem('x-token'));

      const r = await axios.post("api/clientes/escribir", data, {
        headers: {
                 "x-token": localStorage.getItem('x-token'),
        },
      });
      Notify.create({
        message: 'Cliente registrado correctamente',
        color: "positive",
        position: "top",
      })
      console.log(r);
      return r;
    } catch (error) {
      Notify.create({
        type: 'negative',
        message: error.response.data.errors[0].msg
      })
      console.log(error);
      return error;
    } finally {
      loading.value = false;
    }
  };

  const activateCliente = async (id) => {
    try {
      loading.value = true;
      console.log(localStorage.getItem('x-token'));

      const r = await axios.put(
        `api/clientes/activar/activados/${id}`,
        {},
        {
          headers: {
                   "x-token": localStorage.getItem('x-token'),
          },
        }
      );
      console.log(r);
      return r;
    } catch (error) {
      loading.value = true;
      console.log(error);
      return error;
    } finally {
      loading.value = false;
    }
  };
  const desactivateCliente = async (id) => {
    try {
      loading.value = true;
      console.log(localStorage.getItem('x-token'));

      const r = await axios.put(
        `api/clientes/desactivar/desactivados/${id}`,
        {},
        {
          headers: {
                   "x-token": localStorage.getItem('x-token'),
          },
        }
      );
      console.log(r);
      return r;
    } catch (error) {
      loading.value = true;
      console.log(error);
      return error;
    } finally {
      loading.value = false;
    }
  };

  const putClienteSeguimiento = async (id, seguimientos) => {
    try {
      console.log('Datos a enviar:', seguimientos); 
  
      const response = await axios.put(
        `api/clientes/modificar/seguimiento/${id}`,
        { seguimiento: seguimientos.seguimiento }, 
        {
          headers: {
                   "x-token": localStorage.getItem('x-token'),
          },
        }
      );
  
      console.log("Respuesta del servidor:", response.data);
      

    } catch (error) {
      console.error("Error al actualizar seguimiento:", error);
    }
  }
  const putEditaSeguimiento = async (clienteId, seguimientoId, seguimientoData) => {
    try {
      const response = await axios.put(
        `/api/clientes/editar/seguimiento/${clienteId}/${seguimientoId}`,
        { seguimiento: seguimientoData },
        {
          headers: {
            "x-token": localStorage.getItem('x-token'),
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error en putEditaSeguimiento:", error.response?.data || error.message);
      throw error;
    }
  };

  return {
    getClientes,
    listarActivos,
    listarInactivos,
    listarClientesporCumpleanos,
    listarClientesporPlan,
    updateCliente,
    putClienteSeguimiento,
    putEditaSeguimiento,
    addCliente,
    activateCliente,
    desactivateCliente,
    getClientesID,
    clientes,
    loading, 
    useUsuarios
  };
}, {
  persist: true
});
