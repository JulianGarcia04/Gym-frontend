import {defineStore} from "pinia"
import axios from "axios"
import {ref} from "vue"
import { useUsuariosStore } from "../stores/Usuarios";

export const useIngresosStore = defineStore("ingresos", ()=>{

  const useUsuarios = useUsuariosStore();

    const getIngresos = async()=>{
        try {
            const res = await axios.get("http://localhost:4500/api/ingresos/listar",{
              headers:{
                "x-token":useUsuarios.token
              },
            });
            return res.data
        } catch (error) {
            return error
        }
    };
    const getIngresoID = async (id) => {
      try {
        const res = await axios.get("http://localhost:4500/api/ingresos/listarid/${id}");
        return res;
      } catch (error) {
        console.error("Error fetching mantenimiento by ID:", error);
        return error;
      }
    };

    const addIngreso = async (data) => {
        try {
          const res = await axios.post("http://localhost:4500/api/ingresos/escribir", data);
          return res;
        } catch (error) {
          console.error("Error adding ingreso:", error);
          return error;
        }
      };

      const updateIngreso = async (data) => {
        try {
          const res = await axios.post(`http://localhost:4500/api/ingresos/modificar/${id}`, data);
          return res;
        } catch (error) {
          console.error("Error adding ingreso:", error);
          return error;
        }
      };


    return{ getIngresos, addIngreso,updateIngreso, getIngresoID}
})