
<template>
  <div class="contenedor">
    <div class="busqueda">
      <q-input class="input" v-model="PagosId" label="Buscar por ID" />
      <q-btn
        class="boton_buscar"
        color="primary"
        @click="buscarPago"
        :loading="usePagos.loading"
        >Buscar
        <template v-slot:loading>
          <q-spinner color="white" size="1em" />
        </template>
      </q-btn>
      <q-btn-dropdown
        color="primary"
        icon="visibility"
        label="Ver"
        style="margin-left: 16px"
      >
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
        @click="abrirDialogoNuevoPago"
        :loading="usePagos.loading"
      >
        <q-icon name="add" /> Nuevo Pago
      </q-btn>
    </div>

    <div class="q-pa-md">
      <q-table
        title="Pagos"
        :rows="rows"
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
            <q-btn v-if="props.row.estado == 1" @click="desactivar(props.row)"
              >❌</q-btn
            >

            <q-btn v-else @click="activar(props.row)">✅</q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <q-dialog v-model="isDialogOpen">
      <q-card class="formulario">
        <q-card-section>
          <div class="text-h6">
            {{ esNuevoPago ? "Agregar Pago" : "Editar Pago" }}
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
              <label for="plan">Plan</label>
              <q-select
                standout
                v-model="form.idPlan"
                :options="organizarPlanes"
                option-value="valor"
                option-label="label"
                label="Plan"
                style="margin-bottom: 20px"
              />
            </div>
<div class="opciones">
  <q-card-actions align="right">
              <q-btn
                flat
                class="cancelar"
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
import { usePagosStore } from "../stores/Pagos.js";
import { useClientesStore } from "../stores/Clientes.js";
import { usePlanesStore } from "../stores/Planes";
import { useQuasar } from "quasar";
const loading = ref(false);

const $q = useQuasar();
const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};
const usePagos = usePagosStore();
const useClientes = useClientesStore();
const usePlan = usePlanesStore();
const PagosId = ref("");
const clientes = ref([]);
const planes = ref([]);

function listar(tipo) {
  if (tipo === "activos") {
    listarActivos();
  } else if (tipo === "inactivos") {
    listarInactivos();
  } else {
    listarPagos();
  }
}

let c = ref([]);
let p = ref([]);

const rows = ref([]);
const columns = ref([
  {
    name: "idCliente",
    label: "Cliente",
    field: (row) => row.idCliente.nombre,
    align: "center",
  },
  {
    name: "idPlan",
    label: "Plan",
    field: (row) => row.idPlan.descripcion,
    align: "center",
  },
  {
    name: "valor",
    label: "Valor",
    field: (row) => formatNumber(row.valor),
    align: "center",
  },
  {
    name: "fecha",
    label: "Fecha",
    field: (row) => row.fecha.split("T")[0],
    align: "center",
  },
  { name: "estado", label: "Estado", field: "estado", align: "center" },
  { name: "editar", label: "Editar", field: "editar", align: "center" },
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },
]);

const isDialogOpen = ref(false);
const esNuevoPago = ref(false);
const form = ref({
  idCliente: "",
  idPlan: "",
  valor: "",
  fecha: "",
  estado: 1,
});

function obtenerUltimoPago() {
  return localStorage.getItem("ultimoPago");
}

async function listarPagos() {
  try {
    const res = await usePagos.getPagos();
    console.log("Respuesta del servidor:", res);

    if (res && res.data && res.data.pago) {
      const ultimoPagoId = obtenerUltimoPago();

      rows.value = res.data.pago.sort((a, b) => {
        if (a._id === ultimoPagoId) return -1;
        if (b._id === ultimoPagoId) return 1;
        return 0;
      });

      console.log("Pagos ordenados:", rows.value);
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar pagos:", error);
  }
}
const listarActivos = async () => {
  try {
    const res = await usePagos.listarActivos();
    rows.value = res.data.activados;
  } catch (error) {
    console.error("Error fetching pagos:", error);
  }
};

const listarInactivos = async () => {
  try {
    const res = await usePagos.listarInactivos();
    rows.value = res.data.desactivados;
  } catch (error) {
    console.error("Error fetching pagos:", error);
  }
};

async function editar(row) {
  await listarPlanes();
  await listarClientes();

  form.value = {
    ...row,
    idPlan:
      organizarPlanes.value.find((plan) => plan.valor === row.idPlan._id) ||
      null,
    idCliente:
      organizarClientes.value.find(
        (cliente) => cliente.valor === row.idCliente._id
      ) || null,
  };
  esNuevoPago.value = false;
  isDialogOpen.value = true;
}
async function abrirDialogoNuevoPago() {
  loading.value = true;
  try {
    await listarClientes();
    await listarPlanes();

    form.value = {
      idCliente: "",
      idPlan: "",
      valor: "",
      fecha: "",
      estado: 1,
    };
    esNuevoPago.value = true;
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

    if (!isValid) {
      return;
    }

    const formData = {
      ...form.value,
      idPlan: form.value.idPlan.valor || form.value.idPlan,
      idCliente: form.value.idCliente.valor || form.value.idCliente,
    };

    if (esNuevoPago.value) {
      const res = await usePagos.addPago(formData);
      if (res && res.data && res.data.pago) {
        localStorage.setItem("ultimoPago", res.data.pago._id);
      }
    } else {
      await usePagos.updatePago(formData._id, formData);
    }

    await listarPagos();
    cerrarDialogo();
    mostrarMensajeExito("Pago guardado exitosamente");
  } catch (error) {
    console.error("Error al guardar la edición:", error);
    mostrarMensajeError("Error al guardar el pago");
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
    !form.value.idPlan ||
    (typeof form.value.idPlan === "object" &&
      Object.keys(form.value.idPlan).length === 0)
  ) {
    mostrarMensajeError("Seleccione un plan");
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

async function activar(row) {
  try {
    await usePagos.activatePago(row._id);
    listarPagos();
  } catch (error) {
    console.error("Error al activar el pago:", error);
  }
}

async function desactivar(row) {
  try {
    await usePagos.desactivatePago(row._id);
    listarPagos();
  } catch (error) {
    console.error("Error al desactivar el pagos:", error);
  }
}

function cerrarDialogo() {
  isDialogOpen.value = false;
}

async function buscarPago() {
  if (PagosId.value.trim() !== "") {
    try {
      const id = PagosId.value.trim();
      const r = await usePagos.getPagoID(id);
      if (r && r.data && r.data.pago) {
        rows.value = [r.data.pago];
      } else {
        console.error("Pago no encontrado");
        rows.value = [];
      }
    } catch (error) {
      console.error("Error al buscar el pago:", error);
      rows.value = [];
    }
  } else {
    console.error("Por favor ingrese un ID de pago válido");
  }
}

onMounted(() => {
  listarPagos();
  listarPlanes();
});

let planesTodo = ref([]);
let nombreCodigo = ref([]);

const organizarPlanes = computed(() => {
  nombreCodigo.value = planesTodo.value.map((element) => ({
    label: `${element.codigo} - ${element.descripcion}`,
    valor: `${element._id}`,
    nombre: `${element.nombre}`,
  }));
  return nombreCodigo.value;
});

async function listarPlanes() {
  try {
    const res = await usePlan.getPlanes();
    planesTodo.value = res.data.plan;
  } catch (error) {
    console.error("Error al listar planes:", error);
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
    const res = await useClientes.getClientes();
    clientesTodo.value = res.data.cliente;
  } catch (error) {
    console.error("Error al listar clientes:", error);
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
}
</style> 


