<template>
  <div class="contenedor">
    <div class="busqueda">
      <q-input class="input" v-model="clientesId" label="Buscar por ID" />
      <q-btn class="boton_buscar" color="primary" @click="buscarCliente()">Buscar</q-btn>
      <div class="listar-ai">
        <button class="activar" color="primary" @click="listarActivos">Activos</button>
        <button class="inactivar" color="primary" @click="listarInactivos">Inactivos</button>
        <button class="todos" color="primary" @click="listarClientes()">Todos</button>
      </div>
    </div>
    <div class="boton_agregar">
      <q-btn class="boton_agregar" color="primary" @click="abrirDialogoNuevoCliente()">
        <q-icon name="add" /> Nuevo Cliente
      </q-btn>
    </div>



    <div class="q-pa-md">
      <q-table
        title="Cliente"
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
            {{ esNuevoCliente ? "Agregar Cliente" : "Editar Cliente" }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="guardarEdicion">
            <q-input v-model="form.nombre" label="Nombre" required />
            <q-input v-model="form.documento" label="Documento" required />
            <q-input v-model="form.direccion" label="Direccion" required />
            <q-input v-model="form.fechaNacimiento" label="Fecha de Nacimiento" required />
            <q-input v-model="form.telefono" label="Telefono" required />
            <q-input v-model="form.estado" label="Estado" required />
            <q-input v-model="form.idPlan" label="Plan" required />
            <!-- <q-input v-model="form.fechavencimiento" label="fecha de vencimiento" required /> -->
            <q-input v-model="form.foto" label="foto" required />

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
import { useClientesStore } from "../stores/Clientes";

const useClientes = useClientesStore();
const clientesId = ref('');


const rows = ref([]);
const columns = ref([
  { name: "nombre", label: "Nombre", field: "nombre", align: "center" },
  { name: "documento", label: "Documento", field: "documento", align: "center" },
  { name: "direccion", label: "Direccion", field: "direccion", align: "center" },
  { name: "fechaNacimiento", label: "fecha de Nacimiento", field: (row)=> row.fechaNacimiento.split("T")[0], align: "center" },
  { name: "telefono", label: "Telefono", field: "telefono", align: "center" },
  { name: "estado", label: "Estado", field: "estado", align: "center" },
  { name: "idPlan", label: "Plan", field: (row)=>row.idPlan.descripcion, align: "center" },
  { name: "foto", label: "foto", field: "foto", align: "center" },
  { name: "editar", label: "Editar", field: "editar", align: "center" },
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },
]);

const isDialogOpen = ref(false);
const esNuevoCliente = ref(false);
const form = ref({
  idPlan: null,
  nombre: "",
  documento: "",
  direccion: "",
  fechaNacimiento: "",
  telefono: "",
  estado: 1,
  // fechavencimiento: "",
  foto: "",
});

async function listarClientes(clienteId = null) {
  try {
    let r;
    if (clienteId) {
      r = await useClientes.getClientesID(clienteId);
      if (r && r.data && r.data.cliente) {
        rows.value = [r.data.cliente]; 
      } else {
        console.error('cliente no encontrado');
      }
    } else {
      r = await useClientes.getClientes();
      console.log(r);
      rows.value = r.cliente
    }
  } catch (error) {
    console.error('Error fetching clientes:', error);
  }
}

const listarActivos = async () => {
  try {
    const res = await useClientes.listarActivos();
    rows.value = res.data.activados;
    console.log(res.data.activados);

  } catch (error) {
    console.error("Error fetching clientes:", error);
  }
}
const listarInactivos = async () => {
  try {
    const res = await useClientes.listarInactivos();
    rows.value = res.data.desactivados;
    console.log(res.data.desactivados);
  } catch (error) {
    console.error("Error fetching clientes:", error);
  }
}

function editar(row) {
  form.value = { ...row };
  esNuevoCliente.value = false;
  isDialogOpen.value = true;
}

function abrirDialogoNuevoCliente() {
  form.value = {
    nombre: "",
    documento: "",
    direccion: "",
    fechaNacimiento: "",
    telefono: "",
    estado: 1,
    // fechavencimiento: "",
    foto: "",
    idPlan: null,  
  };
  esNuevoCliente.value = true;
  isDialogOpen.value = true;
}

async function guardarEdicion() {
  console.log(form.value);
  try {
    if (esNuevoCliente.value) {
      const response = await useClientes.addCliente(form.value);
      console.log('Respuesta del servidor:', response);
    } else {
      const response = await useClientes.updateCliente(form.value._id, form.value);
      console.log('Respuesta del servidor:', response);
    }
    listarClientes();
    cerrarDialogo();
  } catch (error) {
    console.error("Error al guardar la edición:", error.response ? error.response.data : error);
  }
}

async function activar(row) {
  try {
    await useClientes.activateCliente(row._id);
    listarClientes();
  } catch (error) {
    console.error("Error al activar el Cliente:", error);
  }
}

async function desactivar(row) {
  try {
    await useClientes.desactivateCliente(row._id);
    listarClientes();
  } catch (error) {
    console.error("Error al desactivar el clientes:", error);
  }
}

function cerrarDialogo() {
  isDialogOpen.value = false;
}

async function buscarCliente() {
  if (clientesId.value.trim() !== '') {
    try {
      const id = clientesId.value.trim();
      const r = await useClientes.getClientesID(id);
      if (r && r.data && r.data.cliente) {
        const clienteEncontrado = r.data.cliente;
        form.value = { ...clienteEncontrado };
        esNuevoCliente.value = false;
        isDialogOpen.value = true;
      } else {
        console.error('cliente no encontrado');
      }
    } catch (error) {
      console.error('Error al buscar el cliente:', error);
    }
  } else {
    console.error('Por favor ingrese un ID de cliente válido');
  }
}


onMounted(() => {
  listarClientes();
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