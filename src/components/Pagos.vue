
<template>
  <div class="contenedor">
    <div class="busqueda">
      <q-input class="input" v-model="PagosId" label="Buscar por ID" />
      <q-btn class="boton_buscar" color="primary" @click="buscarPago">Buscar</q-btn>
      <div class="listar-ai">
        <button class="activar" color="primary" @click="listarActivos">Activos</button>
        <button class="inactivar" color="primary" @click="listarInactivos">Inactivos</button>
        <button class="todos" color="primary" @click="listarPagos()">Todos</button>
      </div>
    </div>
    <div class="boton_agregar">
      <q-btn class="boton_agregar" color="primary" @click="abrirDialogoNuevoPago">
        <q-icon name="add" /> Nuevo Pago
      </q-btn>
    </div>

    <div class="q-pa-md">
      <q-table title="Pagos" :rows="rows" :columns="columns" row-key="name" style="width: 100%">
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
            {{ esNuevoPago ? "Agregar Pago" : "Editar Pago" }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="guardarEdicion">
            <q-input v-model="form.idCliente" label="Id Cliente" required />
            <q-input v-model="form.Idplan" label="Plan" required />
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
import { ref, onMounted } from "vue"
import {usePagosStore} from "../stores/Pagos"
import {useClientesStore} from "../stores/Clientes.js"

const usePagos= usePagosStore()
const useClientes = useClientesStore()
const PagosId = ref("")

let c = ref([])

const rows = ref([])
const columns = ref([
{name:"cliente", label: "Cliente", field: (row) => {
  const cliente = c.value.find((cliente) => cliente._id == row.idCliente)
  console.log(c.value);
}, align: "center" },
{name:"plan", label:"Plan", field: "IdPlan", align: "center" },
{name:"valor", label:"Valor", field: (row) => row.valor, align: "center" },
{name:"fecha", label:"Fecha", field:"fecha", align: "center"},
{name:"estado", label: "Estado", field: "estado", align: "center" },
{name:"editar", label: "Editar", field: "editar", align: "center" },
{name:"opciones", label:"Opciones", field:"opciones", align: "center"},
])

const isDialogOpen = ref(false);
const esNuevoPago = ref(false);
const form = ref({
  idCliente: "",
  Idplan: "",
  valor:"",
  fecha:"",
  estado: 1,
  });


async function listarPagos(pagoId = null) {
  try {
    let r;
    if (pagoId) {
      r = await usePagos.getPagoID(pagoId);
      if (r && r.data && r.data.pago) {
        rows.value = [r.data.pago];
      } else {
        console.error("Pago no encontrado");
      }
    } else {
      r = await usePagos.getPagos();
      let c1 = await useClientes.getClientes()
      c.value = c1.cliente
      console.log(r.pago);
      rows.value = r.pago
    }
  } catch (error) {
    console.error("Error fetching pagos:", error);
  }
}

const listarActivos = async () => {
  try {
    const res = await usePagos.listarActivos();
    rows.value = res.data.activados;
    console.log(res.data.activados);

  } catch (error) {
    console.error("Error fetching pagos:", error);
  }
}
const listarInactivos = async () => {
  try {
    const res = await usePagos.listarInactivos();
    rows.value = res.data.desactivados;
    console.log(res.data.desactivados);
  } catch (error) {
    console.error("Error fetching pagos:", error);
  }
}


function editar(row) {
  form.value = { ...row };
  esNuevoPago.value = false;
  isDialogOpen.value = true;
}

function abrirDialogoNuevoPago() {
  form.value = {
  idCliente: "",
  Idplan: "",
  valor:"",
  fecha:"",
  estado: 1,
  };
  esNuevoPago.value = true;
  isDialogOpen.value = true;
}

async function guardarEdicion() {
  try {
    if (esNuevoPago.value) {
      await usePagos.addPago(form.value);
    } else {
      await usePagos.updatePago(form.value._id, form.value);
    }
    listarPagos();
    cerrarDialogo();
  } catch (error) {
    console.error("Error al guardar la edición:", error);
  }
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



onMounted(()=>{
  listarPagos()
})
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
