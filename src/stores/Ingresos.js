
import { defineStore } from "pinia";
import axios from "axios";
import { ref } from "vue";
import { useUsuariosStore } from "./Usuarios";

export const useIngresosStore = defineStore("ingresos", () => {
  const useUsuarios = useUsuariosStore();
  const loading = ref(false); 
  let ingresos =ref([])

  const getIngresos = async () => {
    try {
      loading.value  = true;
      console.log(`este es el usuariotoken ${useUsuarios.token}`);
      console.log(` este es el local ${localStorage.getItem('x-token')}`);
      const response = await axios.get("api/ingresos/listar",{
          headers:{
                      "x-token": localStorage.getItem('x-token'),

          }
  });
     return response;
  } catch (error) {
      console.error("NO se pudo obtener la lista de ingresos",error);
console.log(`${useUsuarios.token} es el token`);

      throw error;
  }
  finally {
      loading.value=false
}}


  const getIngresoID = async (id) => {
    loading.value = true;
    try {
      const res = await axios.get(`api/ingresos/listarid/${id}`);
      return res;
    } catch (error) {
      console.error("Error fetching ingreso by ID:", error);
      return error;
    } finally {
      loading.value = false;
    }
  };

  const addIngreso = async (data) => {
    try {
      loading.value =true
      console.log(localStorage.getItem('x-token'));

      const r = await axios.post("api/ingresos/escribir", data,{
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

  const updateIngreso = async (id, data) => {
    try {
      loading.value =true
      console.log(localStorage.getItem('x-token'));
      const r = await axios.put(`api/ingresos/modificar/${id}`, data,{
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
  return { getIngresos, addIngreso, updateIngreso, getIngresoID, loading, 
    useUsuarios, ingresos };
},
{persist: true}
);
