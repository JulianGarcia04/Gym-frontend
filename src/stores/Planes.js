import {defineStore} from "pinia"
import axios from "axios"
import {ref} from "vue"

export const usePlanesStore = defineStore("planes", ()=>{

    const getPlanes = async () => {
      try {
        const res = await axios.get("http://localhost:4500/api/planes/listar");
        return res;
      } catch (error) {
        console.error("Error fetching planes:", error);
        return error;
      }
    };
    const getPlanID = async (id) => {
      try {
        const res = await axios.get(`http://localhost:4500/api/planes/listarid/${id}`);
        return res;
      } catch (error) {
        console.error("Error fetching usuario by ID:", error);
        return error;
      }
    };
    const listaractivos = async () => {
      try {
        const res = await axios.get("http://localhost:4500/api/planes/listaractivados");
        return res;
      } catch (error) {
        console.error("Error fetching plan:", error);
        return error;
      }
    };

    const listarInactivos = async () => {
      try {
        const res = await axios.get("http://localhost:4500/api/planes/listardesactivados");
        return res;
      } catch (error) {
        console.error("Error fetching planes:", error);
        return error;
      }
    };
  
    const updatePlan = async (id, data) => {
      try {
        const res = await axios.put(`http://localhost:4500/api/planes/modificar/${id}`, data);
        return res;
      } catch (error) {
        console.error("Error updating plan:", error);
        return error;
      }
    };
  
    const addPlan = async (data) => {
      try {
        const res = await axios.post("http://localhost:4500/api/planes/escribir", data);
        return res;
      } catch (error) {
        console.error("Error adding plan:", error);
        return error;
      }
    };
  
    const activatePlan = async (id) => {
      try {
        const res = await axios.put(`http://localhost:4500/api/planes/activar/activos/${id}`);
        return res;
      } catch (error) {
        console.error("Error activating plan:", error);
        return error;
      }
    };
  
    const deactivatePlan = async (id) => {
      try {
        const res = await axios.put(`http://localhost:4500/api/planes/desactivar/desactivados/${id}`);
        return res;
      } catch (error) {
        console.error("Error deactivating plan:", error);
        return error;
      }
    };
  
    return {getPlanes, getPlanID, listarInactivos,listaractivos, updatePlan, addPlan, activatePlan, deactivatePlan};
  });