<!-- <template>
  <div class="contenedor">
    <div class="q-pa-md">
      <q-table title="Ventas" :rows="rows" :columns="columns" row-key="name" style="width: 100%">
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <q-chip :color="props.row.estado === 1 ? 'green' : 'red'" text-color="white">
              {{ props.row.estado === 1 ? 'Activo' : 'Inactivo' }}
            </q-chip>
          </q-td>
        </template>
        <template v-slot:body-cell-editar="props">
          <q-td :props="props">
            <q-btn @click="editar(props.row)">
              🖋️
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <q-btn color="primary" @click="abrirDialogoNuevaVenta">
      <q-icon name="add" /> Nueva Venta
    </q-btn>

    <q-dialog v-model="isDialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ esNuevaVenta ? 'Agregar Venta' : 'Editar Venta' }}</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="guardarEdicion">
            <q-input v-model="f.id" label="ID" type="hidden" />
            <q-input v-model="form.ValorUnitario" label="Valor Unitario" required />
            <q-input v-model="form.cantidad" label="Cantidad" required />


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
import {useVentasStore} from "../stores/Ventas"

const useVentas= useVentasStore()

const rows = ref([])
const columns = ref([
{name:"id", label:"ID Producto", field:"id", align: "center"},
{name:"fecha", label:"Fecha", field:"fecha", align: "center"},
{name:"cantidad", label:"Cantidad  ", field:"cantidad", align: "center"},
{name:"valorUnitario", label:"valor Unitario", field:"valorUnitario", align: "center"},
{name:"total", label:"Total", field:"total", align: "center"},
{ name: "editar", label: "Editar", field: "editar", align: "center" },
])

const isDialogOpen = ref(false);
const esNuevaVenta = ref(false);
const form = ref({
  id: null,
  cantidad: "",
  ValorUnitario: "",
});

async function listarVentas() {
  const r = await useVentas.getVentas();
  console.log(r.data);
  rows.value = r.data.Venta;
}

function editar(row) {
  form.value = { ...row };
  esNuevaVenta.value = false;
  isDialogOpen.value = true;
}

function abrirDialogoNuevaVenta() {
  form.value = {
  id: null,
  cantidad: "",
  ValorUnitario: "",
  };
  esNuevaVenta.value = true;
  isDialogOpen.value = true;
}

async function guardarEdicion() {
  try {
    if (esNuevaVenta.value) {
      await useVentas.addVenta(form.value);
    } else {
      await useVentas.updateVenta(form.value._id, form.value);
    }
    listarVentas();
    cerrarDialogo();
  } catch (error) {
    console.error("Error al guardar la edición:", error);
  }
}

function cerrarDialogo() {
  isDialogOpen.value = false;
}

onMounted(() => {
  listarVentas();
});
</script> -->

<template>
  <div class="contenedor">
    <div class="q-pa-md">
      <q-table
        title="Ventas"
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
      </q-table>
    </div>

    <q-btn color="primary" @click="abrirDialogoNuevaVenta">
      <q-icon name="add" /> Nueva Venta
    </q-btn>

    <q-dialog v-model="isDialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">
            {{ esNuevaVenta ? "Agregar Venta" : "Editar Venta" }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="guardarEdicion">
            <q-input v-model="form.idProducto" label="Producto" required />
            <q-input v-model="form.cantidad" label="Cantidad" required />
            <q-input v-model="form.valorUnitario" label="Valor Unitario" required/>

            <q-card-actions align="right">
              <q-btn
                flat
                label="Cancelar"
                color="negative"
                @click="cerrarDialogo"
              />
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
import { useVentasStore } from "../stores/Ventas";

const useVentas = useVentasStore();

const rows = ref([]);
const columns = ref([
  {
    name: "idProducto",
    label: "Producto",
    field: (row) => row.idProducto.descripcion,
    align: "center",
  },
  { name: "cantidad", label: "Cantidad  ", field: "cantidad", align: "center" },
  {
    name: "valorUnitario",
    label: "valor Unitario",
    field: "valorUnitario",
    align: "center",
  },
  { name: "total", label: "Total", field: "total", align: "center" },
  { name: "editar", label: "Editar", field: "editar", align: "center" },
]);

const isDialogOpen = ref(false);
const esNuevaVenta = ref(false);
const form = ref({
  idProducto: "",
  cantidad: "",
  valorUnitario: "",
  total: "",
});

async function listarVentas() {
  const r = await useVentas.getVentas();
  console.log(r.data);
  rows.value = r.data.venta;
}

function editar(row) {
  form.value = { 
    _id:row._id,
    idProducto: row.idProducto._id,
    cantidad: parseInt(row.cantidad),
    valorUnitario: row.valorUnitario,
  };
  esNuevaVenta.value = false;
  isDialogOpen.value = true;
}





function abrirDialogoNuevaVenta() {
  form.value = {
    idProducto: "",
    cantidad: "",
    valorUnitario: "",
    total: "",
  };
  esNuevaVenta.value = true;
  isDialogOpen.value = true;
}

async function guardarEdicion() {
  console.log(form.value);
  try {
    if (esNuevaVenta.value) {
      await useVentas.addVenta(form.value);
    } else {
      console.log("ID de la venta:", form.value._id);
      console.log("Cantidad:", form.value.cantidad);
      console.log("Valor unitario:", form.value.valorUnitario);

      await useVentas.updateVenta(form.value._id, form.value); 
    }
    listarVentas();
    cerrarDialogo();
  } catch (error) {
    console.error("Error al guardar la edición:", error);
  }
}

function cerrarDialogo() {
  isDialogOpen.value = false;
}

onMounted(() => {
  listarVentas();
});
</script>
