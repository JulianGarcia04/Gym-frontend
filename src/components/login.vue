<template>
  <div>
    <div id="app">
      <div class="contenedor">
        <form class="login-form" @submit.prevent="login">
          <h2 style="color: white; font-family: 'Times New Roman'">Login</h2>
          <div class="form-group">
            <label for="email" style="color: white; font-family: 'Times New Roman'; font-size: 23px;">Correo Electrónico:</label>
            <input type="email" id="email" v-model="email" required>
          </div>
          <div class="form-group password-group">
            <label for="password" style="color: white; font-family: 'Times New Roman'; font-size: 23px;">Contraseña:</label>
            <div class="password-wrapper">
              <input :type="passwordFieldType" id="password" v-model="password" required>
              <i :class="passwordIcon" @click="togglePasswordVisibility"></i>
            </div>
          </div>
          <button type="submit" style="font-family: 'Times New Roman'; font-size: 23px; color: white;">Iniciar Sesión</button>
          <button type="button" class="btrecuperar" @click="activador()">Recuperar Contraseña</button>
        </form>
      </div>
    </div>

    <div class="recuperarpass" v-if="vifrecuperarpass">
      <div class="divbtx">
        <button type="submit" class="btx" @click="cerrar()">X</button>
      </div>
      <div class="inputbox">
        <label style=  "font-size: 23px;" for="">Ingresar correo</label>
        <input type="email" required v-model="emailrecuperador" />
      </div>
      <button type="submit" @click="recuperar()" style="margin-top:4%">Recuperar contraseña</button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useUsuariosStore } from "../stores/Usuarios";
import { useRouter } from "vue-router";
import { useQuasar } from 'quasar';
import axios from 'axios';

export default {
  setup() {
    const email = ref('');
    const password = ref('');
    const passwordVisible = ref(false);
    const router = useRouter();
    const usuariosStore = useUsuariosStore();
    const $q = useQuasar();
    const emailrecuperador = ref("");
    const vifrecuperarpass = ref(false);

    const passwordFieldType = computed(() => passwordVisible.value ? 'text' : 'password');
    const passwordIcon = computed(() => passwordVisible.value ? 'fas fa-eye-slash' : 'fas fa-eye');

    function mostrarMensajeError(mensaje) {
      $q.notify({
        type: 'negative',
        message: mensaje,
        position: 'bottom-right',
      });
    };

    function mostrarMensajeExito(mensaje) {
      $q.notify({
        type: 'positive',
        message: mensaje,
        position: 'bottom-right',
      });
    };

    const login = async () => {
      try {
        console.log('Correo:', email.value);
        console.log('Contraseña:', password.value);
        const response = await usuariosStore.login(email.value, password.value);
        console.log("Login successful:", response);
        router.push("/home"); 
        console.log("correcto");
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
        mostrarMensajeError("Correo o contraseña incorrectos.");
      }
    };

    const togglePasswordVisibility = () => {
      passwordVisible.value = !passwordVisible.value;
    };


    function activador() {
  vifrecuperarpass.value = true;
}

function cerrar() {
  vifrecuperarpass.value = false;
}

async function recuperar() {
  try {
    if (emailrecuperador.value === '') {
      mostrarMensajeError('Ingrese correo electrónico');
      return;
    }

    const res = await axios.post('api/usuarios/recuperar-password', { email: emailrecuperador.value });

    if (res.status == 200) {
      mostrarMensajeExito('Correo de recuperación enviado');
      vifrecuperarpass.value = false;
    } else {
      mostrarMensajeError('Correo no encontrado en ningún usuario');
    }
  } catch (error) {
    mostrarMensajeError('Ha ocurrido un error en el servidor');
    console.log(error);
  }
}



    return {
      email,
      password,
      login,
      passwordVisible,
      togglePasswordVisibility,
      passwordFieldType,
      passwordIcon,
      activador,
      cerrar,
      recuperar,
      vifrecuperarpass,
      emailrecuperador,
    };
  }
}

</script>

<style scoped>
.contenedor {
  font-family: Arial, sans-serif;
  background-color: rgb(0, 0, 0);
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

#app {
  text-align: center;
}

.login-form {
  background-color: rgb(75, 70, 70);
  padding: 60px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  width: 40%; 
  max-height: 43vmax;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
  position: relative;
}

label {
  display: block;
  font-weight: bold;
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 20px; 
  font-size: 20px; 
  border: 1px solid #ffd700;
  border-radius: 4px;
  background-color: #000;
  color: #ffd700;
}

.password-group input {
  width: 100%;
  padding: 20px;
  font-size: 20px; 
  border: 1px solid #ffd700;
  border-radius: 4px;
  background-color: #000;
  color: #ffd700;
}

.password-group i {
  position: absolute;
  top: 70%;
  right: 15px; 
  transform: translateY(-50%);
  cursor: pointer;
  color: #ffd700;
  font-size: 24px; 
}

button {
  background-color: #d19f13;
  color: black;
  padding: 15px 30px; 
  border: 3px solid rgb(71, 56, 4);
  border-radius: 6px;
  cursor: pointer;
  font-size: 24px; 
  transition: background-color 0.3s, color 0.3s, transform 0.2s;
}

button:hover {
  background-color: #ffdb4d;
  color: black;
}

.btrecuperar{
margin-top: 3%;
border-color: #d19e1300;
background-color: #d19e1300;
}

.recuperarpass{
  position:absolute;
  background-color: transparent;
  border: 2px solid rgb(255, 255, 255, 0.5);
  border-radius: 20px;
  backdrop-filter: blur(55px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem 3rem;
height:45vmax;
width: 35vmax;
z-index: 99;
top:3%;
right:32vmax;
}

.btx{
  position: absolute;
  font-size:medium;
  color:rgb(255, 255, 255);
background-color: #ffffff00;
width: 3vmax;
top:1%;
right: 1%;
border-color: #00000000;
}
.password-wrapper {
  position: relative;
}

.password-wrapper input {
  padding-right: 30px; /* Espacio para el ícono */
}

.password-wrapper i {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #aaa;
}

.password-wrapper i:hover {
  color: #333;
}

@media (max-width: 1300px) {

  .login-form {
    padding: 20px; 
  }
    h2 {
    font-size: 28px;
  }
}
@media (max-width: 1220px) {

  .login-form {
    padding: 10px; 
    max-height: 60vmax;
  }
}
@media (max-width: 1220px) {

  .login-form {
    max-height: 80vmax;
  }
}
@media (max-width: 768px) {
  .login-form {
    width: 60%;
    max-height: 85vmax;
  }

  input[type="email"],
  input[type="password"] {
    padding: 15px;
    font-size: 18px;
  }

  button {
    padding: 12px 24px;
    font-size: 20px;
  }

  .password-group i {
    font-size: 20px;
  }
}
@media (max-width: 450px) {
  .login-form {
    width: 80%;
    padding: 20px;
  }

  input[type="email"],
  input[type="password"] {
    padding: 10px;
    font-size: 16px;
  }

  button {
    padding: 10px 20px;
    font-size: 18px;
  }

  .password-group i {
    font-size: 18px;
  }

  .recuperarpass {
    width: 80%;
    height: auto;
    padding: 1rem;
    right: 10%;
  }

  .btx {
    font-size: small;
    width: 2em;
  }
}
</style>

