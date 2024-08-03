import { defineStore } from 'pinia';
import axios from 'axios';
import { ref } from 'vue';
import { useUsuariosStore } from "./Usuarios";

export const usePagosStore = defineStore('pagos', () => {

  let loading = ref(false)
  const useUsuarios=useUsuariosStore()
  const pagos = ref([]);



  const getPagos = async () => {
            try {
                loading.value  = true;
                console.log(`este es el usuariotoken ${useUsuarios.token}`);
                console.log(` este es el local ${localStorage.getItem('x-token')}`);
                const response = await axios.get("api/pagos/listar",{
                    headers:{
                                "x-token": localStorage.getItem('x-token'),

                    }
            });
               return response;
            } catch (error) {
                console.error("NO se pudo obtener la lista de pagos",error);
                console.log(`${useUsuarios.token} es el token`);

                throw error;
            }
            finally {
                loading.value=false
        }}

  const getPagoID = async (id) => {
    try {
      const res = await axios.get(`api/pagos/listarid/${id}`);
      return res;
    } catch (error) {
      console.error("Error fetching pago by ID:", error);
      return error;
    }
  };

const listarActivos = async () => {
  try {
    loading.value  = true;
    console.log(`este es el usuariotoken ${useUsuarios.token}`);
    console.log(` este es el local ${localStorage.getItem('x-token')}`);
    const response = await axios.get("api/pagos/listaractivados",{
        headers:{
                    "x-token": localStorage.getItem('x-token'),

        }
});
   return response;
} catch (error) {
    console.error("NO se pudo obtener la lista de pagos",error);
    console.log(`${useUsuarios.token} es el token`);

    throw error;
}
finally {
    loading.value=false
}}

const listarInactivos = async () => {
  try {
    loading.value  = true;
    console.log(`este es el usuariotoken ${useUsuarios.token}`);
    console.log(` este es el local ${localStorage.getItem('x-token')}`);
    const response = await axios.get("api/pagos/listardesactivados",{
        headers:{
                    "x-token": localStorage.getItem('x-token'),

        }
});
   return response;
} catch (error) {
    console.error("NO se pudo obtener la lista de pagos",error);
    console.log(`${useUsuarios.token} es el token`);

    throw error;
}
finally {
    loading.value=false
}}

const updatePago = async (id, data) => {
  try {
    loading.value = true;
    console.log(localStorage.getItem('x-token'));
    const r = await axios.put(`api/pagos/modificar/${id}`, data, {
      headers: {
                "x-token": localStorage.getItem('x-token'),

      }
    });
    console.log(r);
    return r;
  } catch (error) {
    loading.value = false;
    console.log(error);
    return error;
  } finally {
    loading.value = false;
  }
};

const addPago = async (data) => {
  try {
    loading.value =true
    console.log(localStorage.getItem('x-token'));

    const r = await axios.post("api/pagos/escribir", data,{
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

const activatePago = async (id) => {
  try {
    loading.value =true
    console.log(localStorage.getItem('x-token'));
    const r = await axios.put(`api/pagos/activar/activos/${id}`, {},{
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

const desactivatePago = async (id) => {
  try {
    loading.value =true
    console.log(localStorage.getItem('x-token'));
    const r = await axios.put(`api/pagos/desactivar/desactivados/${id}`, {},{
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
return {  getPagos,getPagoID, listarActivos, listarInactivos,updatePago,addPago,activatePago,desactivatePago, pagos, loading, 
  useUsuarios };
},
{persist: true}

);