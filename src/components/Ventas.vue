

<template>
  <div class="contenedor">
    <div class="busqueda">
      <q-input class="input" v-model="VentasId" label="Buscar por ID" />
      <q-btn class="boton_buscar" color="primary" @click="buscarVenta"
        >Buscar</q-btn
      >
        <q-btn class="todos" color="primary" @click="listarVentas()"
        >Todos</q-btn
      >
    </div>
    <div class="boton_agregar">
      <q-btn class="boton_agregar" color="primary" @click="abrirDialogoNuevaVenta">
        <q-icon name="add" /> Nuevo Venta
      </q-btn>
    </div>
    
    <div class="q-pa-md">
      <q-table title="Ventas" :rows="rows" :columns="columns" row-key="name" style="width: 100%">
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
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
              <q-btn   flat    label="Cancelar"  color="negative"  @click="cerrarDialogo"              />
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
const VentasId = ref("")

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

async function listarVentas(ventaId = null) {
  try {
    let r;
    if (ventaId) {
      r = await useVentas.getVentaID(ventaId);
      if (r && r.data && r.data.venta) {
        rows.value = [r.data.venta];
      } else {
        console.error("Venta no encontrado");
      }
    } else {
      r = await useVentas.getVentas();
      if (r && r.data) {
        rows.value = r.data.venta;
      } else {
        console.error("Error fetching ventas:", r);
      }
    }
  } catch (error) {
    console.error("Error fetching ventas:", error);
  }
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

async function buscarVenta() {
  if (VentasId.value.trim() !== '') {
    try {
      const id = VentasId.value.trim();
      const r = await useVentas.getVentaID(id);
      if (r && r.data && r.data.venta) {
        rows.value = [r.data.venta];
      } else {
        console.error("Venta no encontrado");
        rows.value = [];
      }
    } catch (error) {
      console.error("Error al buscar la venta:", error);
      rows.value = [];
    }
  } else {
    console.error("Por favor ingrese un ID de venta válido");
  }
}

onMounted(() => {
  listarVentas();
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
  font-size: 3.rem;
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
</style>