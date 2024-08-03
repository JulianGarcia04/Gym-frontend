import { defineStore } from "pinia";
import axios from "axios"
import { ref } from "vue";
import { useUsuariosStore } from "./Usuarios";

export const useMaquinasStore = defineStore("maquinas", () => {
 
  const useUsuarios=useUsuariosStore()

  let maquinas =ref([])
  // let token = ref("");
  const loading = ref(false); 

  const getMaquinas = async () => {
    try {
      loading.value  = true;
      console.log(`este es el usuariotoken ${useUsuarios.token}`);
      console.log(` este es el local ${localStorage.getItem('x-token')}`);
      const response = await axios.get("api/maquinas/listar",{
          headers:{
                      "x-token": localStorage.getItem('x-token'),

          }
  });
     return response;
  } catch (error) {
      console.error("NO se pudo obtener la lista de maquinas",error);
      console.log(`${useUsuarios.token} es el token`);

      throw error;
  }
  finally {
      loading.value=false
}}

  const getMaquinasID = async (id) => {
    loading.value = true;
    try {
      const res = await axios.get(`api/maquinas/listarid/${id}`);
      return res;
    } catch (error) {
      console.error("Error fetching usuario by ID:", error);
      return error;
    }finally {
      loading.value = false;
    }
  };
  
  const updateMaquina = async (id, data) => {
    try {
      loading.value = true;
      console.log(localStorage.getItem('x-token'));

      if (!id) {
        throw new Error("ID no definido");
      }
                const response = await axios.put(`api/maquinas/modificar/${id}`, data, {
        headers: {
                  "x-token": localStorage.getItem('x-token'),

        }
      });
  
      console.log(response.data); 
  
      return response; 
    } catch (error) {
      console.error('Error fetching:', error);
      return error;
    } finally {
      loading.value = false; 
    }
  };

  const addMaquina = async (data) => {
    try {
      loading.value =true
      console.log(localStorage.getItem('x-token'));

      const r = await axios.post("api/maquinas/escribir", data,{
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

  const activateMaquina = async (id) => {
    try {
      loading.value =true
      console.log(localStorage.getItem('x-token'));

      const r = await axios.put(`api/maquinas/activar/activos/${id}`, {},{
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
  const deactivateMaquina = async (id) => {
    try {
      loading.value =true
      console.log(localStorage.getItem('x-token'));

      const r = await axios.put(`api/maquinas/desactivar/desactivos/${id}`, {},{
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

const listarActivos = async () => {
  try {
    loading.value = true;
    console.log(localStorage.getItem('x-token'));
    console.log(useUsuarios.token);
    const response = await axios.get("api/maquinas/listaractivadas", {
      headers: {
                "x-token": localStorage.getItem('x-token'),

      },
    });
    return response;
  } catch (error) {
    console.error("NO se pudo obtener la lista de maquinas", error);
    throw error;
  } finally {
    loading.value = false;
  }
};
const listarInactivos = async () => {
  try {
    loading.value = true;
    console.log(localStorage.getItem('x-token'));
    const response = await axios.get("api/maquinas/listardesactivadas", {
      headers: {
                "x-token": localStorage.getItem('x-token'),

      },
    });
    return response;
  } catch (error) {
    console.error("NO se pudo obtener la lista de maquinas", error);
    throw error;
  } finally {
    loading.value = false;
  }
};


  return { getMaquinas, updateMaquina, addMaquina, activateMaquina, deactivateMaquina, getMaquinasID, listarActivos, listarInactivos, maquinas, loading, 
    useUsuarios};
}, {
  persist: true
});
