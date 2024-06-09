import { defineStore } from "pinia";
import axios from "axios"
import { ref } from "vue";

export const useUsuariosStore = defineStore("usuarios", () => {
  let token = ref("");
  let user = ref({})
  const getUsuarios = async () => {
    try {
      const res = await axios.get("http://localhost:4500/api/usuarios/listar");
      return res;
    } catch (error) {
      console.error("Error fetching usuarios:", error);
      return error;
    }
  };

  const getUsuariosID = async (id) => {
    try {
      const res = await axios.get(`http://localhost:4500/api/usuarios/listarid/${id}`);
      return res;
    } catch (error) {
      console.error("Error fetching usuario by ID:", error);
      return error;
    }
  };
  
  const updateUsuario = async (id, data) => {
    try {
      const res = await axios.put(`http://localhost:4500/api/usuarios/modificar/${id}`, data);
      return res;
    } catch (error) {
      console.error("Error updating usuario:", error);
      return error;
    }
  };

  const addUsuario = async (data) => {
    try {
      const res = await axios.post("http://localhost:4500/api/usuarios/escribir", data);
      return res;
    } catch (error) {
      console.error("Error adding usuario:", error);
      return error;
    }
  };

  const activateUsuario = async (id) => {
    try {
      const res = await axios.put(`http://localhost:4500/api/usuarios/activar/activos/${id}`);
      return res;
    } catch (error) {
      console.error("Error activating usuario:", error);
      return error;
    }
  };

  const deactivateUsuario = async (id) => {
    try {
      const res = await axios.put(`http://localhost:4500/api/usuarios/desactivar/desactivados/${id}`);
      return res;
    } catch (error) {
      console.error("Error deactivating usuario:", error);
      return error;
    }
  };

const listarActivos = async () => {
  console.log(token.value);
  try {
    const res = await axios.get("http://localhost:4500/api/usuarios/listaractivados", {
      headers: {
        token:token.value}
    });
    return res;
  } catch (error) {
    console.error("Error fetching usuarios:", error);
    return error;
  }
};
const listarInactivos = async () => {
  try {
    const res = await axios.get("http://localhost:4500/api/usuarios/listardesactivados");
    return res;
  } catch (error) {
    console.error("Error fetching usuarios:", error);
    return error;
  }
};
  const login = async (email, password) => {
    try {
      const res = await axios.post("http://localhost:4500/api/usuarios/login", {
        email,
        password,
      });
      token.value = res.data.token;
      user.value = res.data.user 
      console.log(token.value);
      console.log(res.data);
      return res.data;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };

  return { getUsuarios, updateUsuario, addUsuario, activateUsuario, deactivateUsuario, login, token, user, getUsuariosID, listarActivos, listarInactivos};
}, {
  persist: true
});



