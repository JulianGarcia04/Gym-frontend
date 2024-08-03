<template>
  <div class="todo">
    <div class="body">
      <section>
        <form class="login-form" @submit.prevent="restablecerContraseña">
          <h2 style="color: white; font-family: 'Times New Roman'">Restablecer Contraseña</h2>
          <div class="form-group">
            <label for="nuevaContraseña" style="color: white; font-family: 'Times New Roman'; font-size: 23px;">Nueva Contraseña</label>
            <input type="password" id="nuevaContraseña" v-model="nuevaContraseña" required />
          </div>
          <div class="form-group password-group">
            <label for="confirmarContraseña" style="color: white; font-family: 'Times New Roman'; font-size: 23px;">Confirmar Contraseña</label>
            <input :type="passwordFieldType" id="confirmarContraseña" v-model="confirmarContraseña" required />
            <i :class="eyeIcon" @click="togglePasswordVisibility"></i>
          </div>
          <button type="submit" style="font-family: 'Times New Roman'; font-size: 23px; color: white;">Restablecer Contraseña</button>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useRoute, useRouter } from 'vue-router';
import { useUsuariosStore } from "../stores/Usuarios.js";

const nuevaContraseña = ref('');
const confirmarContraseña = ref('');
const $q = useQuasar();
const passwordVisible = ref(false);

const route = useRoute();
const router = useRouter();
const token = ref(route.query.token || '');
const _id = ref(''); 

const passwordFieldType = computed(() => (passwordVisible.value ? 'text' : 'password'));
const eyeIcon = computed(() => (passwordVisible.value ? 'eye-off-outline' : 'eye-outline'));

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

const mostrarMensajeError = (mensaje) => {
  $q.notify({
    type: 'negative',
    message: mensaje,
    position: 'bottom-right',
  });
};

const mostrarMensajeExito = (mensaje) => {
  $q.notify({
    type: 'positive',
    message: mensaje,
    position: 'bottom-right',
  });
};

const restablecerContraseña = async () => {
  try {
    if (nuevaContraseña.value !== confirmarContraseña.value) {
      mostrarMensajeError('Las contraseñas no coinciden');
      return;
    }

    if (!token.value) {
      mostrarMensajeError('Token no válido o faltante');
      return;
    }

    const decoded = JSON.parse(atob(token.value.split('.')[1]));
    _id.value = decoded.uid;


    const data = {
      password: nuevaContraseña.value,
    };

 
    const response = await useUsuariosStore().putUsuariospassword(_id.value, data);

    if (response.status === 200) {
      mostrarMensajeExito('Contraseña restablecida exitosamente');
      router.push('/');
    } else {
      mostrarMensajeError('Error al restablecer la contraseña');
    }
  } catch (error) {
    mostrarMensajeError('Ha ocurrido un error en el servidor');
    console.error(error);
  }
};
</script>

<style scoped>
.todo {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgb(0, 0, 0);
}

.body {
  text-align: center;
}

.login-form {
  background-color: rgb(75, 70, 70);
  padding: 60px;
  border-radius: 12px;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  
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
  top: 50%;
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
</style>
