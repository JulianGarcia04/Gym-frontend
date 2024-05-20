<template>
  <div>
    <div id="app">
      <form class="login-form" @submit.prevent="login">
        <h2>Login </h2>
        <div class="form-group">
          <label for="email">Correo Electrónico:</label>
          <input type="email" id="email" v-model="email" required>
        </div>
        <div class="form-group">
          <label for="password">Contraseña:</label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, createApp } from "vue";

export default {
  setup() {
    const email = ref('');
    const password = ref('');

    const login = () => {
      // Aquí puedes agregar la lógica para autenticar al usuario
      console.log('Correo:', email.value);
      console.log('Contraseña:', password.value);
      // Por ahora, solo mostraremos los datos en la consola
    };

    return {
      email,
      password,
      login
    };
  }
}
</script>
<style >
body {
  font-family: Arial, sans-serif;
  background-color: #79c1bb;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
}

#app {
  text-align: center;
}

.login-form {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  max-width: 300px;
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
  border: 1px solid #ccc;
  border-radius: 4px;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background-color: #45a049;
}

</style>