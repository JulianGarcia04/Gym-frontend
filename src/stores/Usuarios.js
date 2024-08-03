import { defineStore } from "pinia";
import axios from "axios"
import { ref } from "vue";
import { useRouter } from 'vue-router';

export const useUsuariosStore = defineStore("usuarios", () => {
  // const token = ref("");
  const token = ref(localStorage.getItem('x-token') || "");

  const loading = ref(false);
  const usuarios = ref([]);
  const user = ref({});
  const role = ref(""); 
  const router = useRouter()

  const logout = () => {
    token.value=""
    console.log('Intentando eliminar el token...');
    localStorage.removeItem('x-token');
    // console.log('Token eliminado:', localStorage.getItem('token') === null);
    // role.clearUserData(); // Método para limpiar datos del usuario en el store, si es necesario
    router.push('/');
    console.clear()
    console.log("cerrandossss");
  };

  const getUsuarios = async () => {
    try {
      loading.value = true;
      console.log(` este es el local ${localStorage.getItem('x-token')}`);

      const res = await axios.get("api/usuarios/listar", {
        headers: {
          "x-token": localStorage.getItem('x-token')
        }
      });
      return res;
    } catch (error) {
      console.error("Error fetching usuarios:", error);
      return error;
    }finally {
      loading.value = false;
    }
  };

  const getUsuariosID = async (id) => {
    try {
      loading.value = true;
      console.log(localStorage.getItem('x-token'));
      const res = await axios.get(`api/usuarios/listarid/${id}`, {
        headers: {
          "x-token": localStorage.getItem('x-token')
        }
      });
      return res;
    } catch (error) {
      console.error("Error fetching usuario by ID:", error);
      return error;
    } finally {
      loading.value = false;
    }
  };
  
  const updateUsuario = async (id, data) => {
    try {
      loading.value = true;    
      console.log(localStorage.getItem('x-token'));
      const res = await axios.put(`api/usuarios/modificar/${id}`, data, {
        headers: {
          "x-token": localStorage.getItem('x-token')
        }
      });
      return res;
    } catch (error) {
      console.error("Error updating usuario:", error);
      return error;
    }finally {
      loading.value = false;
    }
  };

  const addUsuario = async (data) => {
    try {
       loading.value = true;
      console.log(localStorage.getItem('x-token'));
      const res = await axios.post("api/usuarios/escribir", data, {
        headers: {
          "x-token": localStorage.getItem('x-token')
        }
      });
      return res;
    } catch (error) {
      console.error("Error adding usuario:", error);
      return error;
    }finally {
      loading.value = false;
    }
  };

  const activateUsuario = async (id) => {
    try {
      loading.value = true;
      console.log(localStorage.getItem('x-token'));

      const res = await axios.put(`api/usuarios/activar/activos/${id}`, {}, {
        headers: {
          "x-token": localStorage.getItem('x-token')
        }
      });
      return res;
    } catch (error) {
      console.error("Error activating usuario:", error);
      return error;
    }finally {
      loading.value = false;
    }
  };

  const deactivateUsuario = async (id) => {
    try {
      loading.value = true;
      console.log(localStorage.getItem('x-token'));
      const res = await axios.put(`api/usuarios/desactivar/desactivados/${id}`, {}, {
      headers: {
        "x-token": localStorage.getItem('x-token')
      }
        });
          return res;
    } catch (error) {
      console.error("Error deactivating usuario:", error);
      return error;
    } finally {
      loading.value = false;
    }
  };

const listarActivos = async () => {
  try {
    loading.value = true;
    console.log(localStorage.getItem('x-token'));
    const res = await axios.get("api/usuarios/listaractivados", {
      headers: {
        "x-token": localStorage.getItem('x-token')
      }}
    );
    return res;
  } catch (error) {
    console.error("Error fetching usuarios:", error);
    return error;
  }finally {
    loading.value = false;
  }
};
const listarInactivos = async () => {
  try {
    loading.value = true;
    console.log(localStorage.getItem('x-token'));
    const res = await axios.get("api/usuarios/listardesactivados", {
      headers: {
        "x-token": localStorage.getItem('x-token')
      }
    }); return res;
  } catch (error) {
    console.error("Error fetching usuarios:", error);
    return error;
  }finally {
    loading.value = false;
  }
};

  const login = async (email, password) => {
    try {
      const res = await axios.post("api/usuarios/login", {
        email,
        password,
      });
      token.value = res.data.token;
      user.value = res.data.usuario; 
      role.value = res.data.usuario.rol; 

      localStorage.setItem('x-token', res.data.token);
      console.log('Token guardado:', res.data.token); 

      return res.data;
    } catch (error) {
      console.error("Error during login:", error);
      throw error;
    }
  };
  const validaremail = async (email) => {
    try {
      const res = await axios.get(`api/usuarios/email?email=${email}`);
      localStorage.setItem('x-token', res.data.token); // Corrección aquí
      return res;
    } catch (error) {
      console.error("No se pudo obtener la informacion requerida", error);
      return error;
    }};

    const putUsuariospassword = async (id, data) => {
      try {
        loading.value = true;
        console.log(localStorage.getItem('x-token'));

        const response = await axios.put(`api/usuarios/password/${id}`, data, {
          headers: {
            "x-token": localStorage.getItem('x-token')
          }
        });
        return response;
      } catch (error) {
        console.log("No se pudo actualizar el usuario", error);
        return error;
      } finally {
        loading.value = false;
      }
    };
    

  
  return { getUsuarios, logout,updateUsuario, addUsuario, activateUsuario, deactivateUsuario, validaremail, login, token, user, getUsuariosID, listarActivos, listarInactivos, putUsuariospassword, role, loading, usuarios};
}, {
  persist: true
});



