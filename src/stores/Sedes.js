

import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useUsuariosStore } from "./Usuarios";


export const useSedesStore = defineStore("sedes", () => {

  let loading = ref(false)
  const useUsuarios=useUsuariosStore()
  let sedes =ref([])
  
  const getSedes = async () => {
    try {
      loading.value  = true;
      console.log(`este es el usuariotoken ${useUsuarios.token}`);
      console.log(` este es el local ${localStorage.getItem('x-token')}`);
      const res = await axios.get("api/sedes/listar",{
        headers:{
          "x-token": localStorage.getItem('x-token'),
        }
});
   return res;
;
    } catch (error) {
      console.error("Error fetching sedes:", error);
      return error;
    }            finally {
      loading.value=false
}
  };
  const getSedeID = async (id) => {
    try {
      const res = await axios.get(`api/sedes/listarid/${id}`);
      return res;
    } catch (error) {
      console.error("Error fetching usuario by ID:", error);
      return error;
    }
  };

  const listaractivos = async () => {
    try {
      loading.value = true;
      console.log(localStorage.getItem('x-token'));
      const res = await axios.get("api/sedes/listaractivados", {
        headers: {
                  "x-token": localStorage.getItem('x-token'),

        },
      }); return res;
    } catch (error) {
      console.error("Error fetching usuarios:", error);
      return error;
    }finally {
      loading.value = false;
    }
  };
  const listarInactivos = async () => {
    try {
      loading.value = true;
      console.log(localStorage.getItem('x-token'));
      const res = await axios.get("api/sedes/listardesactivados", {
        headers: {
                  "x-token": localStorage.getItem('x-token'),

        },
      });return res;
    } catch (error) {
      console.error("Error fetching usuarios:", error);
      return error;
    } finally {
      loading.value = false;
    }
  };

  const updateSede = async (id, data) => {
    try {
      loading.value = true;
      console.log(localStorage.getItem('x-token'));
      if (!id) {
        throw new Error("ID no definido");
      }
      const res = await axios.put(`api/sedes/modificar/${id}`, data, {
        headers: {
                  "x-token": localStorage.getItem('x-token'),
        }
      }); return res;
    } catch (error) {
      loading.value = false;
      console.error("Error updating sede:", error);
      return error;
    }finally {
      loading.value = false;
    }
  };

  const addSede = async (data) => {
    const loading = ref(true);
    console.log(localStorage.getItem('x-token'));
    try {
      const response = await axios.post("api/sedes/escribir", data, {
        headers: {
                  "x-token": localStorage.getItem('x-token'),

        }
      });
      console.log(response);
      return response;
    } catch (error) {
      console.log(error);
      throw new Error(error.response ? error.response.data.error : error.message);
    } finally {
      loading.value = false;
    }
  };

  const activateSede = async (id) => {
    try {
      loading.value =true
      console.log(localStorage.getItem('x-token'));
      const r = await axios.put(`api/sedes/activar/activos/${id}`, {},{
          headers:{
                      "x-token": localStorage.getItem('x-token'),

          }
      })
      console.log(r);
      return r
  } catch (error) {
      loading.value =true
      console.log(error);
      return error;
  }finally{
      loading.value = false
  }
}

  const deactivateSede = async (id) => {
    try {
      loading.value =true
      console.log(localStorage.getItem('x-token'));
      const r = await axios.put(`api/sedes/desactivar/desactivados/${id}`, {},{
          headers:{
                      "x-token": localStorage.getItem('x-token'),

          }
      })
      console.log(r);
      return r
  } catch (error) {
      loading.value =true
      console.log(error);
      return error;
  }finally{
      loading.value = false
  }
}
  return { getSedes,getSedeID,listaractivos,listarInactivos, updateSede, addSede, activateSede, deactivateSede, sedes, loading, 
    useUsuarios };
},

{persist: true}

);

