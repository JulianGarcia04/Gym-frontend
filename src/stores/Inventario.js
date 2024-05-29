import {defineStore} from "pinia"
import axios from "axios"
import {ref} from "vue"

export const useInventarioStore = defineStore("inventario", ()=>{

    
    const getInventario = async()=>{
        try {
            const res = await axios.get("http://localhost:4000/api/inventario/listar")
            return res
        } catch (error) {
            return error
        }
    };
    const updateInventario = async (id, data) => {
        try {
          const res = await axios.put(`http://localhost:4000/api/inventario/modificar/${id}`, data);
          return res;
        } catch (error) {
          console.error("Error updating inventario:", error);
          return error;
        }
      };
    
      const addInventario = async (data) => {
        try {
          const res = await axios.post("http://localhost:4000/api/inventario/escribir", data);
          return res;
        } catch (error) {
          console.error("Error adding inventario:", error);
          return error;
        }
      };
    
    return{ getInventario, updateInventario, addInventario}
})