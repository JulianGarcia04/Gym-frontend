
<template>
  <div class="contenedor">
    <div class="busqueda">
      <!-- <q-input class="input" v-model="IngresosId" label="Buscar por ID" />
      <q-btn 
        class="boton_buscar" 
        color="primary" 
        @click="buscarIngreso"
        :loading="loading"
      >Buscar
        <template v-slot:loading>
          <q-spinner color="white" size="1em" />
        </template>
      </q-btn> -->
      <q-input
        class="input"
        v-model="filtroNombre"
        label="Buscar por Nombre"
        @click="resetdate"
      />

      <q-input
        class="input"
        v-model="filtroFecha"
        label="Filtrar por Fecha"
        type="date"
        @click="resetname"
      />

      <q-btn
        class="todos"
        color="primary"
        @click="listarIngresos"
        :loading="loading"
        >Todos
        <template v-slot:loading>
          <q-spinner color="white" size="1em" />
        </template>
      </q-btn>
    </div>
    <div class="boton_agregar">
      <q-btn
        class="boton_agregar"
        color="primary"
        @click="abrirDialogoNuevoIngreso"
        :loading="loading"
      >
        <q-icon name="add" /> Nuevo Ingreso
        <template v-slot:loading>
          <q-spinner color="white" size="1em" />
        </template>
      </q-btn>
    </div>
    <div class="q-pa-md">
      <q-table
        title="Ingresos"
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
      </q-table>
    </div>

    <q-dialog v-model="isDialogOpen">
      <q-card class="formulario">
        <q-card-section>
          <div class="text-h6">
            {{ esNuevoIngreso ? "Agregar Ingreso" : "Editar Ingreso" }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="guardarEdicion">
            <div class="campo-formulario">
              <label for="cliente">Cliente</label>
              <q-select
                standout
                v-model="form.idCliente"
                :options="organizarClientes"
                option-value="valor"
                option-label="label"
                label="Cliente"
                style=" margin-bottom: 20px"
              />
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
                style="margin-bottom: 20px"
              />
            </div>
            <div class="opciones">
              <q-card-actions align="right">
                <q-btn flat label="Cancelar"
                class="cancelar"
                 @click="cerrarDialogo" />
                <q-btn
                  type="submit"
                  label="Guardar"
                  color="positive"
                  :loading="loading"
                >
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
import { useIngresosStore } from "../stores/Ingresos";
import { useSedesStore } from "../stores/Sedes";
import { useClientesStore } from "../stores/Clientes";
import { useQuasar } from "quasar";

const $q = useQuasar();
const useIngresos = useIngresosStore();
const filtroNombre = ref("");
const useSede = useSedesStore();
const useCliente = useClientesStore();
const sedes = ref([]);
const clientes = ref([]);
const loading = ref(false);
const filtroFecha = ref("");

const rows = ref([]);
const columns = ref([
  {
    name: "fecha",
    label: "Fecha",
    field: (row) => row.fecha.split("T")[0],
    align: "center",
  },
  {
    name: "idCliente",
    label: "Cliente",
    field: (row) => row.idCliente.nombre,
    align: "center",
  },
  {
    name: "idSede",
    label: "Sede",
    field: (row) => row.idSede.nombre,
    align: "center",
  },
  { name: "editar", label: "Editar", field: "editar", align: "center" },
]);

const isDialogOpen = ref(false);
const esNuevoIngreso = ref(false);
const form = ref({
  _id: "",
  idCliente: "",
  idSede: "",
});

function guardarIngresoReciente(id) {
  localStorage.setItem("ingresoReciente", id);
}

function obtenerIngresoReciente() {
  return localStorage.getItem("ingresoReciente");
}

async function listarIngresos() {
  try {
    filtroFecha.value = "";
    filtroNombre.value = "";
    const res = await useIngresos.getIngresos();
    console.log("Respuesta del servidor:", res);

    if (res && res.data && res.data.ingreso) {
      const ingresoRecienteId = obtenerIngresoReciente();

      // Ordenar los ingresos
      rows.value = res.data.ingreso.sort((a, b) => {
        if (a._id === ingresoRecienteId) return -1;
        if (b._id === ingresoRecienteId) return 1;
        return new Date(b.fecha) - new Date(a.fecha);
      });

      console.log("Filas ordenadas:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar ingresos:", error);
  }
}

async function editar(row) {
  await listarSedes();
  await listarClientes();

  form.value = {
    ...row,
    idSede:
      organizarSedes.value.find((sede) => sede.valor === row.idSede._id) || "",
    idCliente:
      organizarClientes.value.find(
        (cliente) => cliente.valor === row.idCliente._id
      ) || "",
  };
  esNuevoIngreso.value = false;
  isDialogOpen.value = true;
}

async function abrirDialogoNuevoIngreso() {
  loading.value = true;
  try {
    await listarClientes();
    await listarSedes();
    form.value = {
      idCliente: "",
      idSede: "",
    };
    esNuevoIngreso.value = true;
    isDialogOpen.value = true;
  } catch (error) {
    console.error("Error al abrir el diálogo:", error);
  } finally {
    loading.value = false;
  }
}

async function guardarEdicion() {
  try {
    const isValid = await validar();
    if (!isValid) return;

    const formData = {
      ...form.value,
      idSede: form.value.idSede.valor || form.value.idSede,
      idCliente: form.value.idCliente.valor || form.value.idCliente,
    };

    if (esNuevoIngreso.value) {
      await useIngresos.addIngreso(formData);
    } else {
      await useIngresos.updateIngreso(formData._id, formData);
    }
    await listarIngresos();
    cerrarDialogo();
    mostrarMensajeExito("Ingreso guardado exitosamente");
  } catch (error) {
    console.error("Error al guardar la edición:", error);
    mostrarMensajeError("Error al guardar el ingreso");
  } finally {
    loading.value = false;
  }
}

async function validar() {
  let verificado = true;
  if (
    !form.value.idCliente ||
    (typeof form.value.idCliente === "object" &&
      Object.keys(form.value.idCliente).length === 0)
  ) {
    mostrarMensajeError("Seleccione un cliente");
    verificado = false;
  }
  if (
    !form.value.idSede ||
    (typeof form.value.idSede === "object" &&
      Object.keys(form.value.idSede).length === 0)
  ) {
    mostrarMensajeError("Seleccione una sede");
    verificado = false;
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

function cerrarDialogo() {
  isDialogOpen.value = false;
}

// const filtrados = computed(() => {
//   if (filtroNombre.value === "") {
//     return rows.value;
//   }
//   return rows.value.filter((row) =>
//     row.nombre.toLowerCase().includes(filtroNombre.value.toLowerCase())
//   );
// });
// async function buscarIngreso() {
//   if (filtroNombre.value.trim() !== '') {
//     loading.value = true;
//     try {
//       const id = IngresosId.value.trim();
//       const res = await useIngresos.getIngresoID(id);
//       if (res && res.data && res.data.ingreso) {
//         rows.value = [res.data.ingreso];
//       } else {
//         console.error('Ingreso no encontrado');
//         rows.value = [];
//       }
//     } catch (error) {
//       console.error('Error al buscar el Ingreso:', error);
//       rows.value = [];
//     } finally {
//       loading.value = false;
//     }
//   } else {
//     console.error('Por favor ingrese un ID de Ingreso válido');
//   }
// }

function resetname() {
  filtroNombre.value = "";
}
function resetdate() {
  filtroFecha.value = "";
}

const filtrados = computed(() => {
  if (filtroNombre.value !== "") {
    return rows.value.filter((row) =>
      row.idCliente.nombre
        .toLowerCase()
        .includes(filtroNombre.value.toLowerCase())
    );
  } else if (filtroFecha.value !== "") {
    return rows.value.filter(
      (row) => row.fecha.split("T")[0] == filtroFecha.value
    );
  } else return rows.value;
});

onMounted(async () => {
  await listarIngresos();
  await listarSedes();
  await listarClientes();
});

let sedesTodo = ref([]);
let nombreCodigo = ref([]);

const organizarSedes = computed(() => {
  return sedesTodo.value.map((element) => ({
    label: element.nombre,
    valor: element._id,
    nombre: element.nombre,
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

let nombreCodigoC = ref([]);
let clientesTodo = ref([]);

const organizarClientes = computed(() => {
  nombreCodigoC.value = clientesTodo.value.map((element) => ({
    label: `${element.nombre} - ${element.documento}`,
    valor: element._id,
    nombre: element.nombre,
  }));
  return nombreCodigoC.value;
});

async function listarClientes() {
  try {
    const res = await useCliente.getClientes();
    console.log('Respuesta completa de getClientes:', res);
    
    if (res.data && res.data.cliente) {  // Cambiado de 'activados' a 'maquina'
      console.log('Todas los clientes:', res.data.cliente);
      
      clientesTodo.value = res.data.cliente.filter(cliente => cliente.estado === 1 || cliente.estado === 'activo');
      console.log('clientes activos después del filtro:', clientesTodo.value);
    } else {
      console.error('La respuesta no contiene clientes');
      clientesTodo.value = [];
    }
  } catch (error) {
    console.error("Error al listar clientes:", error);
    clientesTodo.value = [];
  }
}

function filtrarUsuarios() {}
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
  font-size: 3rem;
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

.todos {
  margin-left: 10px;
  align-items: center;
  text-align: center;
  display: flex;
  justify-content: center;
  font-size: 18px;
  border-radius: 10px;
  font-family: "Times New Roman";
  font-weight: bold;
}
.formulario {
  width: 80%; /* Ancho del formulario */
  margin: 40px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center; /* Centrar el contenido */
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
  background-color: #4caf50;
  color: #fff;
}

.q-btn[type="submit"]:hover {
  background-color: #3e8e41;
}

.cancelar {
  background-color: red;
  color: white;
}

.opciones {
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
@media (max-width: 700px) {

.busqueda{
  display: flex;
  flex-direction: column;
}
.input{
  margin-top: 5px;
}
}
</style>