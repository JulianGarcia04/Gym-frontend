import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"
import { useUsuariosStore } from "./Usuarios";

export const usePlanesStore = defineStore("planes", () => {
  
  let loading = ref(false)
  const useUsuarios=useUsuariosStore()
  let planes =ref([])

  const getPlanes = async () => {
    try {
      loading.value  = true;
      console.log(`este es el usuariotoken ${useUsuarios.token}`);
      console.log(` este es el local ${localStorage.getItem('x-token')}`);
      const response = await axios.get("api/planes/listar",{
          headers:{
                      "x-token": localStorage.getItem('x-token'),

          }
  });
     return response;
  } catch (error) {
      console.error("NO se pudo obtener la lista de planes",error);
      throw error;
  }
  finally {
      loading.value=false
}}

  const getPlanID = async (id) => {
    try {
      const res = await axios.get(`api/planes/listarid/${id}`);
      return res;
    } catch (error) {
      console.error("Error fetching usuario by ID:", error);
      return error;
    }
  };
  const getPlanesActivos = async () => {
    try {
      loading.value = true;
      console.log(localStorage.getItem('x-token'));
      console.log(useUsuarios.token);
      const response = await axios.get("api/planes/listaractivos", {
        headers: {
                  "x-token": localStorage.getItem('x-token'),

        },
      });
      return response;
    } catch (error) {
      console.error("No se pudo obtener la lista de planes", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const listarInactivos = async () => {
    try {
      loading.value = true;
      console.log(localStorage.getItem('x-token'));
      const response = await axios.get("api/planes/listardesactivados", {
        headers: {
                  "x-token": localStorage.getItem('x-token'),

        },
      });
      return response;
    } catch (error) {
      console.error("NO se pudo obtener la lista de planes", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const updatePlan = async (id, data) => {
    try {
      loading.value =true
      console.log(localStorage.getItem('x-token'));

      const r = await axios.put(`api/planes/modificar/${id}`, data,{
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

  const addPlan = async (data) => {
    try {
      loading.value =true
      console.log(localStorage.getItem('x-token'));
      const r = await axios.post("api/planes/escribir", data,{
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

  const activatePlan = async (id) => {
    try {
      loading.value =true
      console.log(localStorage.getItem('x-token'));

      const r = await axios.put(`api/planes/activar/activos/${id}`, {},{
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


  const deactivatePlan = async (id) => {
    try {
      loading.value =true
      console.log(localStorage.getItem('x-token'));

      const r = await axios.put(`api/planes/desactivar/desactivados/${id}`, {},{
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

  return { getPlanes, getPlanID, listarInactivos, getPlanesActivos, updatePlan, addPlan, activatePlan, deactivatePlan, planes, loading, 
    useUsuarios };
},

{persist: true}

);