

<template>
  <div class="contenedor">
    <div class="busqueda">
      <q-input
        class="input"
        v-model="filtroDescripcion"
        label="Buscar por Descripción"
        @input="filtrarInventario"
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
        @click="abrirDialogoNuevoInventario"
        :loading="loading"
      >
        <q-icon name="add" /> Nuevo inventario
        <template v-slot:loading>
          <q-spinner color="white" size="1em" />
        </template>
      </q-btn>
    </div>
    <div class="q-pa-md">
      <q-table
        title="Inventario"
        :rows="filtrados"
        :columns="columns"
        row-key="name"
        style="width: 100%"
      >
      <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <q-btn @click="editarestado(props.row)" v-if="props.row.estado == 1" class="option-button">
              ❌
                          <q-tooltip v-model="showing">Desactiva</q-tooltip>

            </q-btn>
            <q-btn @click="editarestado(props.row)" v-else class="option-button">
              ✅
                          <q-tooltip v-model="showing">Activa</q-tooltip>

            </q-btn>
          </q-td>
        </template>
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
        <template v-slot:body-cell-providers="props">
          <q-td :props="props">
            <q-btn @click="openProvidersDialog(props.row)"> 🚛 </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <q-dialog v-model="isDialogOpen">
      <q-card class="formulario">
        <q-card-section>
          <div class="text-h6">
            {{ esNuevoInventario ? "Agregar Producto" : "Editar Producto" }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="guardarEdicion">
            <!-- <div class="campo-formulario">
              <q-input v-model="form.codigo" label="Código" required />
            </div> -->
            <div class="campo-formulario">
              <q-input v-model="form.descripcion" label="Descripción" required />
            </div>
            <div class="campo-formulario">
              <q-input v-model="form.cantidad" label="Cantidad" required />
            </div>
            <div class="campo-formulario">
              <q-input v-model="form.valor" label="Valor" required />
            </div>
            <div class="campo-formulario">
              <q-input v-model="form.expirationDate" mask="date" :rules="['date']">
                <template v-slot:append>
                  <q-icon name="event" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="form.expirationDate" :options="expirationDateOptions">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Close" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
<div class="opciones">
  <q-card-actions align="right">
              <q-btn
              class="cancelar"
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
    <q-dialog v-model="isOpenProvidersDialog">
      <q-card>
        <q-card-section>
          <providers-table :item-id="selectedItem"/>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useInventarioStore } from "../stores/Inventario";
import { date, useQuasar } from 'quasar';

import ProvidersTable from './proveedores/ProvidersTable.vue'

const $q = useQuasar();
const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const useInventario = useInventarioStore();
const filtroDescripcion = ref("");
const InventariosId = ref("");
const inventarios = ref([]);
const rows = ref([]);
const loading = ref(false); // Estado de carga
const columns = ref([
  { name: "codigo", label: "Codigo", field: "codigo", align: "center" },
  {
    name: "descripcion",
    label: "Descripcion",
    field: "descripcion",
    align: "center",
  },
  { name: "cantidad", label: "Cantidad", field: "cantidad", align: "center" },
  {
    name: "valor",
    label: "Valor",
    field: (row) => formatNumber(row.valor),
    align: "center",
  },
  {
    name: "expirationDate",
    label: "Fecha de vencimiento",
    field: (row) => date.formatDate(new Date(row.expirationDate), 'YYYY/MM/DD'),
    align: "center",
  },
  { name: "editar", label: "Editar", field: "editar", align: "center" },
  { name: "providers", label: "Proveedores", field: "providers", align: "center" },
  { name: "estado", label: "Estado", field: "estado", align: "center" },
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },
]);

const isOpenProvidersDialog = ref(false)
const selectedItem = ref()

const isDialogOpen = ref(false);
const esNuevoInventario = ref(false);
const form = ref({
  id: null,
  descripcion: "",
  cantidad: "",
  valor: "",
  expirationDate: date.formatDate(new Date(), 'YYYY/MM/DD')
});

async function listarInventario(rawInventory) {
  loading.value = true;
  try {

    if (rawInventory) {
      inventarios.value = rawInventory;
      rows.value = rawInventory;
      return
    }

    const r = await useInventario.getInventario();
    useInventario.uploadInventory(r.data.inventario)
    inventarios.value = r.data.inventario;
    rows.value = r.data.inventario;
  } catch (error) {
    console.error("Error fetching Producto:", error);
  } finally {
    loading.value = false;
  }
}

function openProvidersDialog (row) {
  selectedItem.value = row._id
  isOpenProvidersDialog.value = true;
}

function editar(row) {
  form.value = { ...row, expirationDate: date.formatDate(new Date(row.expirationDate), 'YYYY/MM/DD') };
  esNuevoInventario.value = false;
  isDialogOpen.value = true;
}

function abrirDialogoNuevoInventario() {
  form.value = {
    id: null,
    // codigo: "",
    descripcion: "",
    cantidad: "",
    valor: "",
    expirationDate: date.formatDate(new Date(), 'YYYY/MM/DD')
  };
  esNuevoInventario.value = true;
  isDialogOpen.value = true;
}

function expirationDateOptions(date) {
  return new Date(date) > new Date()
}

async function guardarEdicion() {
    try {
    const isValid = await validar();
    
    if (!isValid) {
      return;
    }

    const mapFormData = {
      ...form.value,
      experationDate: new Date(form.value.experationDate)
    }

    if (esNuevoInventario.value) {
      await useInventario.addInventario(mapFormData);
    } else {
      await useInventario.updateInventario(form.value._id, mapFormData);
    }
    listarInventario();
    cerrarDialogo();
    mostrarMensajeExito("Producto guardado exitosamente");
  } catch (error) {
    console.error("Error al guardar la edición:", error);
  } finally {
    loading.value = false;
  }
}
async function editarestado(info){
if(info.estado == 1){
let desactivado= await useInventario.putDesactivarInventario(info._id)
}else if(info.estado == 0){
let activado= await useInventario.putActivarInventario(info._id)
}
  listarInventario()
}

async function validar() {
  let verificado = true;


  if (form.value.descripcion === "") {
    mostrarMensajeError("La descripcion está vacía");
    verificado = false;
  }
  if (!form.value.cantidad || !/^\d+$/.test(form.value.cantidad)) {
    mostrarMensajeError('La cantidad debe ser un número');
    verificado = false;
  }
  if (!form.value.valor || !/^\d+$/.test(form.value.valor)) {
    mostrarMensajeError('El valor debe ser un número');
    verificado = false;
  }

  if (new Date(form.value.experationDate) <= new Date() ) {
    mostrarMensajeError('La fecha de vencimiento debe ser mayor a la fecha actual');
    verificado = false
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

function cerrarDialogo() {
  isDialogOpen.value = false;
}

async function buscarInventario() {
  try {
    let buscarId = inventarios.value[InventariosId.value - 1];
    let id = buscarId._id;
    let r = await useInventario.getInventariosID(id);
    rows.value = [r.data.inventario];
    } catch (error) {
    console.error("Error al buscar el producto:", error);
    rows.value = [];
  }
}
const filtrados = computed(() => {
  if (filtroDescripcion.value === "") {
    return rows.value;
  }
  return rows.value.filter((row) =>
    row.descripcion.toLowerCase().includes(filtroDescripcion.value.toLowerCase())
  );
});

function filtrarInventario() {
}

watch(useInventario.inventario, (newInventory) => {
  listarInventario(newInventory ?? []);
}, {
  immediate: true,
  deep: true
})

async function listar(tipo) {
  switch (tipo) {
    case 'activos':
      listarActivos();
      break;
    case 'inactivos':
      listarInactivos();
      break;
    default:
      listarClientes();
      break;
  }
}

const listarActivos = async () => {
  try {
    const res = await useInventario.listaractivados();
    rows.value = res.data.activados;
  } catch (error) {
    console.error("Error fetching clientes:", error);
  }
};

const listarInactivos = async () => {
  try {
    const res = await useInventario.listardesactivados();
    rows.value = res.data.desactivados;
  } catch (error) {
    console.error("Error fetching clientes:", error);
  }
};
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
.inventario{
  background-color: white;
  color: black;
  border-radius: 10px;
  margin-right: 20px;
  width: auto;
  padding: 10px 20px;
  font-family: "Times New Roman";
  font-size: 18px;
}
@media (max-width: 700px) {

.busqueda{
  display: flex;
  flex-direction: column;
}
}
</style>



