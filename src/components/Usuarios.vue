<template>
  <div class="contenedor">
    <div class="busqueda">
      <q-input class="input" v-model="usuarioId" label="Buscar por ID" />
      <q-btn class="boton_buscar" color="primary" @click="buscarUsuario">Buscar</q-btn>
      <div class="listar-ai">
        <button class="activar" color="primary" @click="listarActivos">Activos</button>
        <button class="inactivar" color="primary" @click="listarInactivos">Inactivos</button>
        <button class="todos" color="primary" @click="listarUsuarios()">Todos</button>
      </div>
    </div>
    <div class="boton_agregar">
      <q-btn class="boton_agregar" color="primary" @click="abrirDialogoNuevoUsuario">
        <q-icon name="add" /> Nuevo Usuario
      </q-btn>
    </div>

    <div class="q-pa-md">
      <q-table title="Usuarios" :rows="rows" :columns="columns" row-key="name" style="width: 100%">
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <q-chip :color="props.row.estado === 1 ? 'green' : 'red'" text-color="white">
              {{ props.row.estado === 1 ? "Activo" : "Inactivo" }}
            </q-chip>
          </q-td>
        </template>
        <template v-slot:body-cell-editar="props">
          <q-td :props="props">
            <q-btn @click="editar(props.row)"> 🖋️ </q-btn>
          </q-td>
        </template>
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <q-btn v-if="props.row.estado == 1" @click="desactivar(props.row)">❌</q-btn>

            <q-btn v-else @click="activar(props.row)">✅</q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <q-dialog v-model="isDialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">
            {{ esNuevoUsuario ? "Agregar Usuario" : "Editar Usuario" }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="guardarEdicion">
            <q-input v-model="form.nombre" label="Nombre" required />
            <q-input v-model="form.telefono" label="Teléfono" required />
            <q-input v-model="form.rol" label="Rol" required />
            <q-input v-model="form.email" label="Email" required />
            <q-input v-model="form.password" label="Password" required />
            <q-input v-model="form.idSede" label="Sede" required />

            <q-card-actions align="right">
              <q-btn flat label="Cancelar" color="negative" @click="cerrarDialogo" />
              <q-btn type="submit" label="Guardar" color="positive" />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useUsuariosStore } from "../stores/Usuarios";

const useUsuarios = useUsuariosStore();
const usuarioId = ref("");

const rows = ref([]);
const columns = ref([
  { name: "nombre", label: "Nombre", field: "nombre", align: "center" },
  { name: "telefono", label: "Telefono", field: "telefono", align: "center" },
  { name: "rol", label: "Rol", field: "rol", align: "center" },
  { name: "sede", label: "Sede", field: (row) => row.idSede.nombre, align: "center", },
  { name: "email", label: "Email", field: "email", align: "center" },
  // { name: "password", label: "Contraseña", field: "password", align: "center" },
  { name: "estado", label: "Estado", field: "estado", align: "center" },
  { name: "editar", label: "Editar", field: "editar", align: "center" },
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },
]);

const isDialogOpen = ref(false);
const esNuevoUsuario = ref(false);
const form = ref({
  idSede: null,
  nombre: "",
  email: "",
  telefono: "",
  password: "",
  rol: "",
  estado: 1,
});

async function listarUsuarios(usuarioId = null) {
  try {
    let r;
    if (usuarioId) {
      r = await useUsuarios.getUsuariosID(usuarioId);
      if (r && r.data && r.data.usuario) {
        rows.value = [r.data.usuario];
      } else {
        console.error("Usuario no encontrado");
      }
    } else {
      r = await useUsuarios.getUsuarios();
      if (r && r.data) {
        rows.value = r.data.usuario;
      } else {
        console.error("Error fetching usuarios:", r);
      }
    }
  } catch (error) {
    console.error("Error fetching usuarios:", error);
  }
}

const listarActivos = async () => {
  try {
    const res = await useUsuarios.listarActivos();
    rows.value = res.data.activados;
    console.log(res.data.activados);

  } catch (error) {
    console.error("Error fetching usuarios:", error);
  }
}
const listarInactivos = async () => {
  try {
    const res = await useUsuarios.listarInactivos();
    rows.value = res.data.desactivados;
    console.log(res.data.desactivados);
  } catch (error) {
    console.error("Error fetching usuarios:", error);
  }
}


function editar(row) {
  form.value = { ...row };
  esNuevoUsuario.value = false;
  isDialogOpen.value = true;
}

function abrirDialogoNuevoUsuario() {
  form.value = {
    nombre: "",
    telefono: "",
    rol: "",
    email: "",
    password: "",
    idSede: "",
    estado: 1,
  };
  esNuevoUsuario.value = true;
  isDialogOpen.value = true;
}

async function guardarEdicion() {
  try {
    if (esNuevoUsuario.value) {
      await useUsuarios.addUsuario(form.value);
    } else {
      await useUsuarios.updateUsuario(form.value._id, form.value);
    }
    listarUsuarios();
    cerrarDialogo();
  } catch (error) {
    console.error("Error al guardar la edición:", error);
  }
}

async function activar(row) {
  try {
    await useUsuarios.activateUsuario(row._id);
    listarUsuarios();
  } catch (error) {
    console.error("Error al activar el usuario:", error);
  }
}

async function desactivar(row) {
  try {
    await useUsuarios.deactivateUsuario(row._id);
    listarUsuarios();
  } catch (error) {
    console.error("Error al desactivar el usuario:", error);
  }
}

function cerrarDialogo() {
  isDialogOpen.value = false;
}

async function buscarUsuario() {
  if (usuarioId.value.trim() !== "") {
    try {
      const id = usuarioId.value.trim();
      const r = await useUsuarios.getUsuariosID(id);
      if (r && r.data && r.data.usuario) {
        rows.value = [r.data.usuario];
      } else {
        console.error("Usuario no encontrado");
        rows.value = [];
      }
    } catch (error) {
      console.error("Error al buscar el usuario:", error);
      rows.value = [];
    }
  } else {
    console.error("Por favor ingrese un ID de usuario válido");
  }
}

onMounted(() => {
  listarUsuarios();
});
</script>

<style scoped>
.contenedor {
  font-family: Arial, sans-serif;
  background: linear-gradient(to bottom, #303030, #6e6e6e, #a8a8a8);
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.q-pa-md {
  padding: 50px;
}

.text-h6 {
  font-size: 2rem;
}

.q-table__bottom-row {
  font-size: 1.5rem;
  /* Tamaño de fuente personalizado para la tabla */
}

.q-btn {
  cursor: pointer;
}

.boton_agregar {
  align-items: center;
  text-align: center;
  display: flex;
  justify-content: center;
  margin-top: 15px;
  font-size: 18px;
  border-radius: 10px;
  font-family: "Times New Roman";
  font-weight: bold;
}

.busqueda {
  margin-top: 25px;

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.input {
  background-color: white;
  color: black;
  border-radius: 10px;
  margin-right: 20px;
  width: 15%;
  padding: 0px 20px;
  font-family: "Times New Roman";
}

.boton_buscar {
  align-items: center;
  text-align: center;
  display: flex;
  justify-content: center;
  font-size: 18px;
  border-radius: 10px;
  font-family: "Times New Roman";
  font-weight: bold;
}

.listar-ai {
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  margin-left: 20px;
  gap: 10px;
}

.activar {
  align-items: center;
  text-align: center;
  display: flex;
  justify-content: center;
  font-size: 20px;
  border-radius: 10px;
  font-family: "Times New Roman";
  background-color: green;
  color: white;
  padding: 10px 20px;
  border: 1px solid white;


}

.inactivar {
  align-items: center;
  text-align: center;
  display: flex;
  justify-content: center;
  font-size: 20px;
  border-radius: 10px;
  font-family: "Times New Roman";
  background-color: red;
  color: white;
  padding: 10px 20px;
  border: 1px solid white;
}

.todos {
  align-items: center;
  text-align: center;
  display: flex;
  justify-content: center;
  font-size: 20px;
  border-radius: 10px;
  font-family: "Times New Roman";
  background-color: #BD9727;
  color: white;
  padding: 10px 20px;
  border: 1px solid white;
}
</style>
