<template>
  <div class="contenedor">
    <div class="busqueda">
      <q-input class="input" v-model="IngresosId" label="Buscar por ID" />
      <q-btn class="boton_buscar" color="primary" @click="buscarIngreso"
        >Buscar</q-btn
      >
        <q-btn class="todos" color="primary" @click="listarIngresos()"
        >Todos</q-btn
      >
    </div>
    <div class="boton_agregar">
      <q-btn
        class="boton_agregar"
        color="primary"
        @click="abrirDialogoNuevoIngreso"
      >
        <q-icon name="add" /> Nuevo Ingreso
      </q-btn>
    </div>
    <div class="q-pa-md">
      <q-table
        title="Ingresos"
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

    <q-dialog v-model="isDialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">
            {{ esNuevoIngreso ? "Agregar Ingreso" : "Editar Ingreso" }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="guardarEdicion">
            <q-input v-model="form.idCliente" label="Id Cliente" required />
            <q-input v-model="form.idSede" label="Id Sede" required />

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
import { useIngresosStore } from "../stores/Ingresos";

const useIngresos = useIngresosStore();
const IngresosId=ref("")

const rows = ref([]);
const columns = ref([
  { name: "fecha", label: "Fecha", field: "fecha", align: "center" },
  {
    name: "idCliente",
    label: "idCliente",
    field: (row) => row.idCliente.nombre,
    align: "center",
  },
  {
    name: "idSede",
    label: "idSede",
    field: (row) => row.idSede.nombre,
    align: "center",
  },
  { name: "editar", label: "Editar", field: "editar", align: "center" },
]);

const isDialogOpen = ref(false);
const esNuevoIngreso = ref(false);
const form = ref({
  idCliente: "",
  idSede: "",
});

async function listarIngresos(IngresoId = null) {
  try {
    let r;
    if (IngresoId) {
      r = await useIngresos.getIngresoID(IngresoId);
      if (r && r.data && r.data.ingreso) {
        rows.value = [r.data.ingreso]; 
      } else {
        console.error('Ingreso no encontrado');
      }
    } else {
      r = await useIngresos.getIngresos();
      console.log(r.ingreso);
      rows.value = r.ingreso
      // if (r && r.ingreso) {
      //   rows.value = r.data.ingreso;
      // } else {
      //   console.error('Error fetching Ingresos:', r);
      // }

    }
  } catch (error) {
    console.error('Error fetching Ingresos:', error);
  }
}


function editar(row) {
  form.value = { ...row };
  esNuevoIngreso.value = false;
  isDialogOpen.value = true;
}

function abrirDialogoNuevoIngreso() {
  form.value = {
    idCliente: "",
    idSede: "",
  };
  esNuevoIngreso.value = true;
  isDialogOpen.value = true;
}

async function guardarEdicion() {
  try {
    if (esNuevoIngreso.value) {
      await useIngresos.addIngreso(form.value);
    } else {
      await useIngresos.updateIngreso(form.value._id, form.value);
    }
    listarIngresos();
    cerrarDialogo();
  } catch (error) {
    console.error("Error al guardar la edición:", error);
  }
}


function cerrarDialogo() {
  isDialogOpen.value = false;
}

async function buscarIngreso() {
  if (IngresosId.value.trim() !== '') {
    try {
      const id = IngresosId.value.trim();
      const r = await useIngresos.getIngresoID(id);
      if (r && r.data && r.data.ingreso) {
        rows.value = [r.data.ingreso];
      } else {
        console.error("Ingreso no encontrado");
        rows.value = [];
      }
    } catch (error) {
      console.error("Error al buscar el Ingreso:", error);
      rows.value = [];
    }
  } else {
    console.error("Por favor ingrese un ID de Ingreso válido");
  }
}
onMounted(() => {
  listarIngresos();
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