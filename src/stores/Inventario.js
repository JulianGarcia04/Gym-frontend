

import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useUsuariosStore } from "./Usuarios";

export const useInventarioStore = defineStore("inventario", () => {
 
  const useUsuarios=useUsuariosStore()

  const inventarios = ref([]);
  const loading = ref(false); 
  let inventario =ref([])


  const getInventario = async () => {
    try {
      loading.value  = true;
      console.log(`este es el usuariotoken ${useUsuarios.token}`);
      console.log(` este es el local ${localStorage.getItem('x-token')}`);
      const response = await axios.get("api/inventario/listar",{
          headers:{
                      "x-token": localStorage.getItem('x-token'),

          }
  });
     return response;
  } catch (error) {
      console.error("NO se pudo obtener la lista de inventario",error);
      throw error;
  }
  finally {
      loading.value=false
}}


  const getInventariosID = async (id) => {
    try {
      const res = await axios.get(`api/inventario/listarid/${id}`);
      return res;
    } catch (error) {
      console.error("Error fetching inventario by ID:", error);
      return error;
    }
  };
  const listaractivados = async () => {
    try {
      loading.value = true;
      console.log(localStorage.getItem('x-token'));
      const response = await axios.get("api/inventario/listaractivados", {
        headers: {
                  "x-token": localStorage.getItem('x-token'),

        },
      });
      return response;
    } catch (error) {
      console.error("NO se pudo obtener la lista de inventario", error);
      console.log(`${useUsuarios.token} es el token`);

      throw error;
    } finally {
      loading.value = false;
    }
  };

  const listardesactivados = async () => {
    try {
      loading.value = true;
      console.log(localStorage.getItem('x-token'));
      const response = await axios.get("api/inventario/listardesactivados", {
        headers: {
                  "x-token": localStorage.getItem('x-token'),

        },
      });
      return response;
    } catch (error) {
      console.error("NO se pudo obtener la lista de inventario", error);
      throw error;
    } finally {
      loading.value = false;
    }
  };

  const updateInventario = async (id, data) => {
    try {
      loading.value =true
      console.log(localStorage.getItem('x-token'));

      const r = await axios.put(`api/inventario/modificar/${id}`, data,{
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

  const addInventario = async (data) => {
    try {
      loading.value =true
      console.log(localStorage.getItem('x-token'));

      const r = await axios.post("api/inventario/escribir", data,{
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
const putActivarInventario = async (id) => {
  try {
    loading.value = true;
    console.log(localStorage.getItem('x-token'));

    const r = await axios.put(
      `api/inventario/activar/activados/${id}`,
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

const putDesactivarInventario = async (id) => {
  try {
    loading.value = true;

    console.log(localStorage.getItem('x-token'));

    const r = await axios.put(
      `api/inventario/desactivar/desactivados/${id}`,
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

  return { 
    getInventario, 
    getInventariosID, 
    listaractivados,
    listardesactivados,
    updateInventario, 
    addInventario, 
    putActivarInventario,
    putDesactivarInventario,
    inventarios,
    inventario,
    loading, 
    useUsuarios 
  };
}, {
  persist: true
});
