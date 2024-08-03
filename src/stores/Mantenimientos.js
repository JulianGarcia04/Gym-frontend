import { defineStore } from "pinia";
import axios from "axios"
import { ref } from "vue";
import { useUsuariosStore } from "./Usuarios";

export const useMantenimientoStore = defineStore("mantenimiento", () => {
  
  const useUsuarios=useUsuariosStore()

  
  let token = ref("");
  const loading = ref(false); 
  let mantenimiento =ref([])

  const getMantenimiento = async () => {
    try {
      loading.value  = true;
      console.log(`este es el usuariotoken ${useUsuarios.token}`);
      console.log(` este es el local ${localStorage.getItem('x-token')}`);
      const response = await axios.get("api/mantenimiento/listar",{
          headers:{
                      "x-token": localStorage.getItem('x-token'),

          }
  });
     return response;
  } catch (error) {
      console.error("NO se pudo obtener la lista de mantenimiento",error);
      console.log(`${useUsuarios.token} es el token`);

      throw error;
  }
  finally {
      loading.value=false
}}

  const getMantenimientoID = async (id) => {
    loading.value = true;
    try {
      const res = await axios.get("api/mantenimiento/listarid/${id}");
      return res;
    } catch (error) {
      console.error("Error fetching mantenimiento by ID:", error);
      return error;
    }finally {
      loading.value = false;
    }
  };
  
  const updateMantenimiento = async (id, data) => {
    try {
      loading.value =true
      console.log(localStorage.getItem('x-token'));
      const r = await axios.put(`api/mantenimiento/modificar/${id}`, data,{
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
  const addMantenimiento= async (data) => {
    try {
      loading.value =true
      console.log(localStorage.getItem('x-token'));

      const r = await axios.post("api/mantenimiento/escribir", data,{
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

  const activateMantenimiento = async (id) => {
    loading.value = true;
    try {
      const res = await axios.put("api/mantenimiento/activar/activos/${id}");
      return res;
    } catch (error) {
      console.error("Error activating mantenimiento:", error);
      return error;
    }finally {
      loading.value = false;
    }
  };

  const deactivateMantenimiento = async (id) => {
    loading.value = true;
    try {
      const res = await axios.put("api/mantenimiento/desactivar/desactivados/${id}");
      return res;
    } catch (error) {
      console.error("Error deactivating mantenimiento:", error);
      return error;
    }finally {
      loading.value = false;
    }
  };

const listarActivos = async () => {
  console.log(token.value);
  loading.value = true;
  try {
    const res = await axios.get("api/mantenimiento/listaractivados", {
      headers: {
        token:token.value}
    });
    return res;
  } catch (error) {
    console.error("Error fetching mantenimiento:", error);
    return error;
  }finally {
    loading.value = false;
  }
};
const listarInactivos = async () => {
  loading.value = true;
  try {
    const res = await axios.get("api/mantenimiento/listardesactivados");
    return res;
  } catch (error) {
    console.error("Error fetching mantenimiento:", error);
    return error;
  }finally {
    loading.value = false;
  }
};

  return { getMantenimiento, getMantenimientoID, updateMantenimiento, addMantenimiento, activateMantenimiento, deactivateMantenimiento, listarActivos, listarInactivos, loading, 
    useUsuarios, mantenimiento};
}, {
  persist: true
});