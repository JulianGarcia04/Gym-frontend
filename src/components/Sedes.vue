

<template>
  <div class="contenedor">
    <div class="busqueda">
      <q-input
        class="input"
        v-model="filtroNombre"
        label="Buscar por Nombre"
        @input="filtrarSedes"
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
      <q-btn class="boton_agregar" color="primary" @click="abrirDialogoNuevaSede">
        <q-icon name="add" /> Nuevo Sede
      </q-btn>
    </div>
    <div class="q-pa-md">
      <q-table
        title="Sedes"
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
            <q-btn v-if="props.row.estado == 1" @click="desactivar(props.row)">
              ❌
            </q-btn>

            <q-btn v-else @click="activar(props.row)">✅</q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog v-model="isDialogOpen">
      <q-card class="formulario">
        <q-card-section>
          <div class="text-h6">
            {{ esNuevaSede ? "Agregar Sede" : "Editar Sede" }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="guardarEdicion">
            <div class="campo-formulario">
              <q-input v-model="form.nombre" label="Nombre" required />
            </div>
            <div class="campo-formulario">
              <q-input v-model="form.ciudad" label="Ciudad" required />
            </div>
            <div class="campo-formulario">
              <q-input v-model="form.direccion" label="Dirección" required />
            </div>
            <div class="campo-formulario">
              <q-input v-model="form.telefono" label="Teléfono" required />
            </div>
            <div class="campo-formulario">
              <q-input v-model="form.horario" label="Horario" required />
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
import { useSedesStore } from "../stores/Sedes";
import { useQuasar } from 'quasar';

const $q = useQuasar();
const useSedes = useSedesStore();
const SedesId = ref("");
const filtroNombre = ref("");
let sedes = ref([]);

function listar(tipo) {
  if (tipo === 'activos') {
    listarActivos();
  } else if (tipo === 'inactivos') {
    listarInactivos();
  } else {
    listarSedes();
  }
}

const rows = ref([]);
const columns = ref([
  { name: "nombre", label: "Nombre", field: "nombre", align: "center" },
  { name: "ciudad", label: "Ciudad", field: "ciudad", align: "center" },
  {
    name: "direccion",
    label: "Dirección",
    field: "direccion",
    align: "center",
  },
  { name: "telefono", label: "Teléfono", field: "telefono", align: "center" },
  { name: "horario", label: "Horario", field: "horario", align: "center" },
  { name: "estado", label: "Estado", field: "estado", align: "center" },
  { name: "editar", label: "Editar", field: "editar", align: "center" },
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },
]);

const isDialogOpen = ref(false);
const esNuevaSede = ref(false);
const form = ref({
  id: null,
  nombre: "",
  ciudad: "",
  direccion: "",
  telefono: "",
  horario: "",
  estado: 1,
});

async function listarSedes() {
  const r = await useSedes.getSedes();
  console.log(r.data);
  sedes.value = r.data.sede;
  console.log(sedes.value);
  rows.value = r.data.sede;
}
const listarActivos = async () => {
  try {
    const res = await useSedes.listaractivos();
    rows.value = res.data.activadas;
    console.log(res.data.activadas);
  } catch (error) {
    console.error("Error fetching usuarios:", error);
  }
};
const listarInactivos = async () => {
  try {
    const res = await useSedes.listarInactivos();
    rows.value = res.data.desactivadas;
    console.log(res.data.desactivadas);
  } catch (error) {
    console.error("Error fetching usuarios:", error);
  }
};
function editar(row) {
  form.value = { ...row };
  esNuevaSede.value = false;
  isDialogOpen.value = true;
}

function abrirDialogoNuevaSede() {
  form.value = {
    id: null,
    nombre: "",
    ciudad: "",
    direccion: "",
    telefono: "",
    horario: "",
    estado: 1,
  };
  esNuevaSede.value = true;
  isDialogOpen.value = true;
}

async function guardarEdicion() {
    try {
    const isValid = await validar();
    
    if (!isValid) {
      return;
    }

    if (esNuevaSede.value) {
      await useSedes.addSede(form.value);
    } else {
      await useSedes.updateSede(form.value._id, form.value);
    }
    listarSedes();
    cerrarDialogo();
    mostrarMensajeExito("Sede guardada exitosamente");

  } catch (error) {
    console.error("Error al guardar la edición:", error);
  }
}
async function validar() {
  let verificado = true;

  if (form.value.nombre === "") {
    mostrarMensajeError("el nombre está vacía");
    verificado = false;
  }
  if (form.value.ciudad === "") {
    mostrarMensajeError("La ciudad está vacía");
    verificado = false;
  }
    if (form.value.direccion === "") {
    mostrarMensajeError("la direccion está vacía");
    verificado = false;
 } if (form.value.telefono === "" || isNaN(form.value.telefono) || form.value.telefono < 0 || form.value.telefono.length < 10) {
    mostrarMensajeError("El teléfono debe ser un número válido y tener al menos 10 caracteres");
    verificado = false;
  }
    if (form.value.horario === "") {
    mostrarMensajeError("el horario está vacío");
    verificado = false;
  }
  return verificado;
}
function mostrarMensajeError(mensaje) {
  $q.notify({
    type: 'negative',
    message: mensaje,
    position: 'bottom-right',
  });
}

function mostrarMensajeExito(mensaje) {
  $q.notify({
    type: 'positive',
    message: mensaje,
    position: 'bottom-right',
  });
}


async function activar(row) {
  try {
    await useSedes.activateSede(row._id);
    listarSedes();
  } catch (error) {
    console.error("Error al activar la sede:", error);
  }
}

async function desactivar(row) {
  try {
    await useSedes.deactivateSede(row._id);
    listarSedes();
  } catch (error) {
    console.error("Error al desactivar la sede:", error);
  }
}

function cerrarDialogo() {
  isDialogOpen.value = false;
}
async function buscarSede() {
  if (SedesId.value.trim() !== "") {
    try {
      let buscarId = sedes.value.find((sede) => sede.nombre === SedesId.value);
      console.log(buscarId._id);
      let id = buscarId._id;
      let r = await useSedes.getSedeID(id);
      rows.value = [r.data.sede];
    } catch (error) {
      console.error("Error al buscar la sede:", error);
      rows.value = [];
    }
  } else {
    console.error("Por favor ingrese un ID de sede válido");
  }
}

const filtrados = computed(() => {
  if (filtroNombre.value === "") {
    return rows.value;
  }
  return rows.value.filter((row) =>
    row.nombre.toLowerCase().includes(filtroNombre.value.toLowerCase())
  );
});

function filtrarSedes() {
  // Esta función puede estar vacía, ya que el filtrado se maneja en la propiedad computada
}

onMounted(() => {
  listarSedes();
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
  color: #716a0e;
  font-family: Georgia;
  font-weight: bold;
}

.q-table__bottom-row {
  font-size: 2rem;
  
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

.sede {
  background-color: white;
  color: black;
  border-radius: 10px;
  margin-right: 20px;
  width: auto;
  padding: 10px 20px;
  font-family: "Times New Roman";
  font-size: 18px;
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

.input {
  background-color: white;
  color: black;
  border-radius: 10px;
  margin-right: 20px;
  padding: 0px 20px;
  font-family: "Times New Roman";
}
@media (max-width: 700px) {

.busqueda{
  display: flex;
  flex-direction: column;
}
}
</style>
