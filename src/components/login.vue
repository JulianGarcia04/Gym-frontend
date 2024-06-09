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
        <div class="form-group">
          <label for="password" style="color: white; font-family: 'Times New Roman'; font-size: 23px;">Contraseña:</label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <button type="submit" style="font-family: 'Times New Roman'; font-size: 23px; color: white;">Iniciar Sesión</button>
      </form>
    </div>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import { useUsuariosStore } from "../stores/Usuarios";
import { useRouter } from "vue-router";

export default {
  setup() {
    const email = ref('gisel@gmail.com');
    const password = ref('Gisel12345$');
    const router = useRouter();
    const usuariosStore = useUsuariosStore();

    const login = async () => {
      try {
        console.log('Correo:', email.value);
        console.log('Contraseña:', password.value);
        const response = await usuariosStore.login(email.value, password.value);
        console.log("Login successful:", response);
        router.push("/Home"); 
      } catch (error) {
        console.error("Error al iniciar sesión:", error);
        alert("Correo o contraseña incorrectos.");
      }
    };

    return {
      email,
      password,
      login
    };
  }
}
</script>

<style scoped>

.contenedor{
  font-family: Arial, sans-serif;
  background-color: black;
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
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  width: 20%
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

label {
  display: block;
  font-weight: bold;
}

input[type="email"],
input[type="password"] {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ffd700;
  border-radius: 4px;
  background-color: #000;
  color: #ffd700;
}

button {
  background-color: #d19f13;
  color: black;
  padding: 10px 20px;
  border: 3px solid rgb(71, 56, 4);
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s, color 0.3s, transform 0.2s;

}

button:hover {
  background-color: #ffdb4d;
  color: black;
}
</style>
