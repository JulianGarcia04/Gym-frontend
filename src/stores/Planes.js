import {defineStore} from "pinia"
import axios from "axios"
import {ref} from "vue"

export const usePlanesStore = defineStore("planes", ()=>{

    const getPlanes = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/planes/listar");
        return res;
      } catch (error) {
        console.error("Error fetching planes:", error);
        return error;
      }
    };
  
    const updatePlan = async (id, data) => {
      try {
        const res = await axios.put(`http://localhost:4000/api/planes/modificar/${id}`, data);
        return res;
      } catch (error) {
        console.error("Error updating plan:", error);
        return error;
      }
    };
  
    const addPlan = async (data) => {
      try {
        const res = await axios.post("http://localhost:4000/api/planes/escribir", data);
        return res;
      } catch (error) {
        console.error("Error adding plan:", error);
        return error;
      }
    };
  
    const activatePlan = async (id) => {
      try {
        const res = await axios.put(`http://localhost:4000/api/planes/activar/activos/${id}`);
        return res;
      } catch (error) {
        console.error("Error activating plan:", error);
        return error;
      }
    };
  
    const deactivatePlan = async (id) => {
      try {
        const res = await axios.put(`http://localhost:4000/api/planes/desactivar/desactivados/${id}`);
        return res;
      } catch (error) {
        console.error("Error deactivating plan:", error);
        return error;
      }
    };
  
    return {getPlanes, updatePlan, addPlan, activatePlan, deactivatePlan};
  });