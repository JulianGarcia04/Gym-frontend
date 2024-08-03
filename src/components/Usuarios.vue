<template>
  <div class="contenedor">
    <div class="busqueda">
      <q-input
        class="input"
        v-model="filtroNombre"
        label="Buscar por Nombre"
        @input="filtrarUsuarios"
      />
      <q-btn-dropdown color="primary" icon="visibility" label="Ver" style="margin-left: 16px;">
        <q-list>
          <q-item clickable v-ripple @click="listar('todos')">
            <q-item-section>Listar Todos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listar('activos')">
            <q-item-section>Listar Activos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listar('inactivos')">
            <q-item-section>Listar Inactivos</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </div>
    <div class="boton_agregar">
      <q-btn
        class="boton_agregar"
        color="primary"
        @click="abrirDialogoNuevoUsuario"
      >
        <q-icon name="add" /> Nuevo Usuario
      </q-btn>
    </div>

    <div class="q-pa-md">
      <q-table
        title="Usuarios"
        :rows="filtrados"
        :columns="columns"
        row-key="name"
        style="width: 100%"
      >
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <q-chip
              :color="props.row.estado === 1 ? 'green' : 'red'"
              text-color="white"
            >
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
            <q-btn
              v-if="props.row.estado === 1"
              @click="desactivar(props.row)"
              :loading="useUsuarios.loading"
            >
              ❌
              <template v-slot:loading>
                <q-spinner color="white" size="1em" />
              </template>
            </q-btn>

            <q-btn
              v-else
              @click="activar(props.row)"
              :loading="useUsuarios.loading"
            >
              ✅
              <template v-slot:loading>
                <q-spinner color="white" size="1em" />
              </template>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <q-dialog v-model="isDialogOpen">
      <q-card class="formulario">
        <q-card-section>
          <div class="text-h6">
            {{ esNuevoUsuario ? "Agregar Usuario" : "Editar Usuario" }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="guardarEdicion">
            <div class="campo-formulario">
              <q-input v-model="form.nombre" label="Nombre" required />
            </div>
            <div class="campo-formulario">
              <q-input v-model="form.telefono" label="Teléfono" required />
            </div>
            <div class="campo-formulario">
              <label for="rol">Rol</label>
              <q-select standout v-model="form.rol" :options="options" label="Rol" style=" margin-bottom: 20px" />
            </div>
            <div class="campo-formulario">
              <q-input v-model="form.email" label="Email" required />
            </div>
            <div v-if="esNuevoUsuario" class="campo-formulario">
              <q-input v-model="form.password" type="password" label="Password" required />
            </div>
            <div class="campo-formulario">
              <label for="sede">Sede</label>
<q-select
      standout
      v-model="form.idSede"
      :options="organizarSedes"
      option-value="valor"
      option-label="label"
      label="Sede"
      style=" margin-bottom: 20px"
    />
            </div>
            <div class="opciones">
              <q-card-actions align="right">
              <q-btn class="cancelar"
                flat
                label="Cancelar"
                @click="cerrarDialogo"
              />
              <q-btn type="submit" label="Guardar" color="positive" :loading="loading">
                <template v-slot:loading>
                  <q-spinner color="white" size="1em" />
                </template>
              </q-btn>
            </q-card-actions>
            </div>
           
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>


<script setup>
import { ref, onMounted, computed } from "vue";
import { useUsuariosStore } from "../stores/Usuarios";
import { useSedesStore } from "../stores/Sedes.js";
import { useQuasar } from 'quasar'



const $q = useQuasar();
const useUsuarios = useUsuariosStore();
const useSede = useSedesStore();
const filtroNombre = ref("");
const sedes = ref([]);
let rol = ref("")

const rows = ref([]);
const columns = ref([
  { name: "nombre", label: "Nombre", field: "nombre", align: "center" },
  { name: "telefono", label: "Telefono", field: "telefono", align: "center" },
  { name: "rol", label: "Rol", field: "rol", align: "center" },
  {
    name: "sede",
    label: "Sede",
    field: (row) => row.idSede.nombre,
    align: "center",
  },
  { name: "email", label: "Email", field: "email", align: "center" },
  // { name: "password", label: "Password", field: "password", align: "center"},
  { name: "estado", label: "Estado", field: "estado", align: "center" },
  { name: "editar", label: "Editar", field: "editar", align: "center" },
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },
]);

const isDialogOpen = ref(false);
const esNuevoUsuario = ref(false);
const form = ref({
  _id: "",
  idSede: "",
  nombre: "",
  email: "",
  telefono: "",
  password: "",
  rol: "",
  estado: 1,
});

function listar(tipo) {
  filtroNombre.value=""
  if (tipo === "activos") {
    listarActivos();
  } else if (tipo === "inactivos") {
    listarInactivos(); 
  } else {
    listarUsuarios();
  }
}
      const model = ref(null);
      const options = [
        'Administrador', 'Recepcionista', 'Instructor'
      ];

async function listarUsuarios(usuarioId = null) {
  try {
    let r;
    if (usuarioId) {
      console.log(usuarioId);
      // r = await useUsuarios.getUsuariosID(usuarioId);
      if (r && r.data && r.data.usuario) {
        rows.value = [r.data.usuario];
      } else {
        console.error("Usuario no encontrado");
      }
    } else {
      r = await useUsuarios.getUsuarios();
      if (r && r.data) {
        rows.value = r.data.usuario;
        console.log(r.data.usuario);
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
  } catch (error) {
    console.error("Error fetching usuarios:", error);
  }
};
const listarInactivos = async () => {
  try {
    const res = await useUsuarios.listarInactivos();
    rows.value = res.data.desactivados;
  } catch (error) {
    console.error("Error fetching usuarios:", error);
  }
};

async function editar(row) {
  await listarSedes();

  console.log('Row:', row); // Verifica el contenido de row

  form.value = {
    ...row,
    idSede: organizarSedes.value.find(sede => sede.valor === row.idSede._id) || null,
  };

  console.log('Form Value:', form.value); // Verifica el contenido de form.value
  esNuevoUsuario.value = false;
  isDialogOpen.value = true;
}
async function abrirDialogoNuevoUsuario() {
await listarSedes();
      form.value = {
        _id: "",
        nombre: "",
        telefono: "",
        rol: "",
        email: "",
        password: "",
        idSede: "",
        estado: 1,
      };
  console.log(rol.value);
  console.log(form.value);
  esNuevoUsuario.value = true;
  isDialogOpen.value = true;
}
async function guardarEdicion() {
  try {
    const isValid = await validar();
    if (!isValid) return;

    const formData = { ...form.value };
    formData.idSede = formData.idSede.valor;

    let result;
    if (esNuevoUsuario.value) {
      result = await useUsuarios.addUsuario(formData);
    } else {
      delete formData.password;
      result = await useUsuarios.updateUsuario(formData._id, formData);
    }

    if (result && !result.isAxiosError) {
      mostrarMensajeExito('Usuario guardado exitosamente');
      listarUsuarios();
      listarSedes();
      cerrarDialogo();
    }
  } catch (error) {
    console.error("Error al guardar la edición:", error);
    mostrarMensajeError("Error al guardar el usuario");
  }
}

async function validar() {
  let verificado = true;

function validarFormatoEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
function validpassword(password) {
  const regex = /^(?=(.*[A-Za-zñÑáéíóúÁÉÍÓÚüÜ]){3,})(?=(.*\d){3,})[\wñÑáéíóúÁÉÍÓÚüÜ\d]{6,}$/;
  return regex.test(password);
}

  if (form.value.nombre === "") {
    mostrarMensajeError("El nombre está vacío");
    verificado = false;
  }
if (form.value.email === "" || !validarFormatoEmail(form.value.email)) {
  mostrarMensajeError("El email no es válido");
  verificado = false;
}
  if (form.value.idSede === "") {
    mostrarMensajeError("la sede está vacía");
    verificado = false;
  }
  if (form.value.rol === "") {
    mostrarMensajeError("el rol está vacía");
    verificado = false;
  }

  if (form.value.telefono === "" || isNaN(form.value.telefono) || form.value.telefono < 0 || form.value.telefono.length < 10) {
    mostrarMensajeError("El teléfono debe ser un número válido y tener al menos 10 caracteres");
    verificado = false;
  }
if (!form.value.password) {
  console.log('La contraseña está vacía o es undefined');
  mostrarMensajeError("La contraseña no puede estar vacía");
  verificado = false;
// } else if (!validpassword(form.value.password)) {
//   console.log('La contraseña no cumple con los requisitos');
//   mostrarMensajeError("La contraseña debe tener al menos 3 números y 3 letras");
//   verificado = false;
} else {
  verificado = true;
}


  return verificado;
}

function mostrarMensajeError(mensaje) {
    $q.notify({
        type: "negative",
        message: mensaje,
        position: "bottom-right",
    });
}

function mostrarMensajeExito(mensaje) {
    $q.notify({
        type: "positive",
        message: mensaje,
        position: "bottom-right",
    });
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
  await listarUsuarios(filtroNombre.value);
}

const filtrados = computed(() => {
  if (filtroNombre.value === "") {
    return rows.value;
  }
  return rows.value.filter((row) =>
    row.nombre.toLowerCase().includes(filtroNombre.value.toLowerCase())
  );
});

function filtrarUsuarios() {
}

onMounted(async () => {
   listarUsuarios();
await listarSedes();
});

let sedesTodo = ref([]);
let nombreCodigo = ref([]);

const organizarSedes = computed(() => {
  return sedesTodo.value.map((element) => ({
    label: element.nombre,
    valor: element._id,
    nombre: element.nombre, // Agrega el nombre para mostrar en el select
  }));
});


async function listarSedes() {
  try {
    const res = await useSede.listaractivos();
    console.log('Sedes Response:', res); // Verifica la estructura completa de la respuesta

    if (res.data && res.data.activadas) {
      console.log('Sedes Activas:', res.data.activadas); // Verifica las sedes activas
      sedesTodo.value = res.data.activadas;
    } else {
      console.error('La respuesta de la API no contiene las sedes.');
    }
  } catch (error) {
    console.error("Error al listar sedes:", error);
  }
}

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
  color: #716a0e;
  font-family: Georgia;
  font-weight: bold;
}

.q-table__bottom-row {
  font-size: 1.5rem;
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
  background-color: #bd9727;
  color: white;
  padding: 10px 20px;
  border: 1px solid white;
}

.formulario {
  width: 80%; /* Ancho del formulario */
  margin: 40px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center; /* Centrar el contenido */;
}

.campo-formulario {
  margin-bottom: 20px;
}

.campo-formulario label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  color: #716a0e;
  font-size: 18px; /* Tamaño de la letra */
  font-family: Arial, sans-serif; /* Fuente */
    font-family: Georgia;

}

.campo-formulario.q-input,
.campo-formulario.q-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff; /* Fondo blanco */
}

.campo-formulario.q-input:focus,
.campo-formulario.q-select:focus {
  border-color: #aaa;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.q-card-actions {
  padding: 20px;
  background-color: #f9f9f9;
  border-top: 1px solid #ddd;
  text-align: center; /* Centrar los botones */
}

.q-btn {
  margin: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.q-btn[type="submit"] {
  background-color: #4CAF50;
  color: #fff;
}

.q-btn[type="submit"]:hover {
  background-color: #3e8e41;
}

.cancelar{
  background-color: red;
  color: white;
}

.opciones{
  display: flex;
  justify-content: center;
}

.q-btn.flat {
  background-color: #fff;
  color: #333;
  border: 1px solid #ddd;
}

.q-btn.flat:hover {
  background-color: #f9f9f9;
}
@media (max-width: 410px) {

.busqueda{
  display: flex;
  flex-direction: column;
}
}
</style>
