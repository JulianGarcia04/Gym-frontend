

<template>
  <div class="contenedor">
    <div class="busqueda">
      <q-input class="input" v-model="VentasId" label="Buscar por ID" />
      <q-btn class="boton_buscar" color="primary" @click="buscarVenta"
        >Buscar</q-btn
      >
      <q-btn class="todos" color="primary" @click="listarVentas()">Todos</q-btn>
    </div>
    <div class="boton_agregar">
      <q-btn
        class="boton_agregar"
        color="primary"
        @click="abrirDialogoNuevaVenta"
      >
        <q-icon name="add" /> Nuevo Venta
      </q-btn>
    </div>

    <div class="q-pa-md">
      <q-table
        title="Ventas"
        :rows="rows"
        :columns="columns"
        row-key="name"
        style="width: 100%"
      >
        <template v-slot:body-cell-estado="props">
          <q-td :props="props"> </q-td>
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
            {{ esNuevaVenta ? "Agregar Venta" : "Editar Venta" }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="guardarEdicion">
            <div class="campo-formulario">
              <label for="producto">Producto</label>
 <!-- <q-select standout   v-model="form.idProducto"
  :options="organizarInventario"
  option-label="label"
  label="Inventario"
  @update:model-value="actualizarValorUnitario"
  map-options
      /> -->

      <q-select
  standout
  v-model="form.idProducto"
  :options="organizarInventario"
  option-label="label"
  option-value="value"
  label="Inventario"
  @update:model-value="actualizarValorUnitario"
  map-options
/>
            </div>
            <div class="campo-formulario">
              <q-input v-model="form.cantidad" label="Cantidad" required />
            </div>
            <div class="campo-formulario">
              <q-input
                v-model="form.valorUnitario"
                label="Valor Unitario"
                required
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
import { ref, onMounted, computed, watch } from "vue";
import { useVentasStore } from "../stores/Ventas";
import { useInventarioStore } from "../stores/Inventario";
import { useQuasar } from 'quasar';

const $q = useQuasar();
const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const useVentas = useVentasStore();
const VentasId = ref("");
const useProducto = useInventarioStore();
const productos = ref([]);

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
    field: (row) => formatNumber(row.valorUnitario),
    align: "center",
  },
  {
    name: "total",
    label: "Total",
    field: (row) => formatNumber(row.total),
    align: "center",
  },
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

async function editar(row) {
  await listarInventarios();
  const productoSeleccionado = organizarInventario.value.find(item => item.value === row.idProducto._id);
  form.value = {
    ...row,
    idProducto: productoSeleccionado || null,
  };
  if (productoSeleccionado) {
    actualizarValorUnitario(productoSeleccionado);
  }
  esNuevaVenta.value = false;
  isDialogOpen.value = true;
}

const idInventarioSeleccionado = ref(null);

const organizarInventario = computed(() => {
  return inventarioTodo.value.map((element) => ({
    label: `${element.descripcion} - ${element.codigo}`,
    value: element._id,  // Esto es el ID de MongoDB
    valor: element.valor, // Este es el precio unitario
    idProducto: element.idProducto || element._id // Asegúrate de asignar el idProducto correcto
  }));
});

let inventarioTodo = ref([]);
let nombreCodigo = ref([]);

  async function listarInventarios() {
      try {
     const res = await useProducto.listaractivados()
      console.log(res.data);
      inventarioTodo.value=res.data.activados
      } catch (error) {
          console.error("Error al listar inventario:", error);
      }
  }


function actualizarValorUnitario(seleccionado) {
  console.log("Producto seleccionado:", seleccionado);
  if (seleccionado && seleccionado.valor) {
    console.log("Valor unitario encontrado:", seleccionado.valor);
    form.value.valorUnitario = seleccionado.valor;
    form.value.idProducto = seleccionado;
    idInventarioSeleccionado.value = seleccionado.value; // MongoDB ID
  } else {
    console.log("Producto no encontrado o sin valor unitario");
    form.value.valorUnitario = '';
    form.value.idProducto = null;
    idInventarioSeleccionado.value = null;
  }
}
watch(idInventarioSeleccionado.value, (newValue) => {
  console.log("idInventario cambiado a:", newValue);
  actualizarValorUnitario(newValue);
});


async function abrirDialogoNuevaVenta() {
  await useProducto.getInventario();
  productos.value = useProducto.inventarios;
  console.log(productos.value);
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
    const isValid = await validar();
    if (!isValid) {
      return;
    }

    const formData = { ...form.value };
    
    // Comprobamos si idProducto es un objeto y tiene la propiedad value
    if (typeof formData.idProducto === 'object' && formData.idProducto !== null) {
      formData.idProducto = formData.idProducto.value || formData.idProducto._id;
    } else if (typeof formData.idProducto === 'string') {
      // Si ya es una cadena (posiblemente el ID), lo dejamos como está
      // No hacemos nada aquí
    } else {
      console.error('Error: idProducto no tiene el formato esperado');
      mostrarMensajeError('Error al procesar el producto seleccionado');
      return;
    }

    console.log("Datos a guardar:", formData);

    if (esNuevaVenta.value) {
      await useVentas.addVenta(formData);
    } else {
await useVentas.updateVenta(formData._id, formData);
    }

    await listarVentas();
    await listarInventarios();
    cerrarDialogo();
    // mostrarMensajeExito("Venta guardada exitosamente");
  } catch (error) {
    console.error("Error al guardar la edición:", error);
    mostrarMensajeError('Error al guardar la venta');
  }
} 




async function validar() {
  let verificado = true;
  if (!form.value.idProducto || (typeof form.value.idProducto === 'object' && !form.value.idProducto.valor)) {
    mostrarMensajeError('El Producto está vacío');
    verificado = false;
  }
  if (!form.value.cantidad){
    mostrarMensajeError('la cantidad está vacía');
    verificado = false;
  }
  if (!form.value.valorUnitario || !/^\d+$/.test(form.value.valorUnitario)) {
    mostrarMensajeError('El valor debe ser un número');
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
function cerrarDialogo() {
  isDialogOpen.value = false;
}

async function buscarVenta() {
  if (VentasId.value.trim() !== "") {
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
  listarInventarios();

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
}
</style>