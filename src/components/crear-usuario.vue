<template>
  <div>
    <form @submit.prevent="createUser">
      <input v-model="nombre" placeholder="Nombre" required />
      <input v-model="email" placeholder="Email" required />
      <input v-model="telefono" placeholder="Telefono" required />
      <input v-model="password" placeholder="Contraseña" type="password" required />
      <input v-model="rol" placeholder="Rol" required />
      <button type="submit">Crear Usuario</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      nombre: '',
      email: '',
      telefono: '',
      password: '',
      rol: ''
    };
  },
  methods: {
    async createUser() {
      try {
        const response = await axios.post('http://localhost:4000/api/usuarios', {
          nombre: this.nombre,
          email: this.email,
          telefono: this.telefono,
          password: this.password,
          rol: this.rol,
        });
        console.log(response.data);
        alert('Usuario creado con éxito');
      } catch (error) {
        console.error(error);
        alert('Error al crear el usuario');
      }
    }
  }
};
</script>