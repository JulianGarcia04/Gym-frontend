<template>
  <div class="contenedor">
    <div class="boton_agregar">
    <q-btn class="boton_agregar" color="primary" @click="abrirDialogoNuevoPlan">
      <q-icon name="add" /> Nuevo Plan
    </q-btn>
  </div>
    <div class="q-pa-md">
      <q-table title="Planes" :rows="rows" :columns="columns" row-key="name" style="width: 100%;">
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <q-chip :color="props.row.estado === 1 ? 'green' : 'red'" text-color="white" >
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
        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <q-btn @click="activar(props.row)">
              ✅
            </q-btn>
            <q-btn @click="desactivar(props.row)">
              ❌
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <q-dialog v-model="isDialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">{{ esNuevoPlan ? 'Agregar Plan' : 'Editar Plan' }}</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="guardarEdicion">
            <q-input v-model="form.descripcion" label="Descripción" required />
            <q-input v-model="form.dias" label="Dias" required />
            <q-input v-model="form.valor" label="Valor" required />

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
import {usePlanesStore} from "../stores/Planes"

const usePlanes= usePlanesStore()

const rows = ref([])
const columns = ref([
{name:"descripcion", label:"Descripcion", field:"descripcion", align: "center"},
{name:"dias", label:"Dias", field:"dias", align: "center"},
{name:"valor", label:"Valor", field:"valor", align: "center"},
{ name: "estado", label: "Estado", field: "estado", align: "center" },
{name:"editar", label: "Editar", field: "editar", align: "center" },
{name:"opciones", label: "Opciones", field: "opciones", align: "center" },
])

const isDialogOpen = ref(false);
const esNuevoPlan = ref(false);
const form = ref({
  id: null,
  descripcion: "",
  dias: "",
  valor: "",
  estado: 1,
});

async function listarPlanes(){
  const r = await usePlanes.getPlanes()
  console.log(r.data);
  rows.value = r.data.plan;
}
function editar(row) {
  form.value = { ...row };
  esNuevoPlan.value = false;
  isDialogOpen.value = true;
}

function abrirDialogoNuevoPlan() {
  form.value = {
    id: null,
    descripcion: "",
    dias: "",
    valor: "",
    estado: 1,
  };
  esNuevoPlan.value = true;
  isDialogOpen.value = true;
}

async function guardarEdicion() {
  try {
    if (esNuevoPlan.value) {
      await usePlanes.addPlan(form.value);
    } else {
      await usePlanes.updatePlan(form.value._id, form.value);
    }
    listarPlanes();
    cerrarDialogo();
  } catch (error) {
    console.error("Error al guardar la edición:", error);
  }
}

async function activar(row) {
  try {
    await usePlanes.activatePlan(row._id);
    listarPlanes();
  } catch (error) {
    console.error("Error al activar el plan:", error);
  }
}

async function desactivar(row) {
  try {
    await usePlanes.deactivatePlan(row._id);
    listarPlanes();
  } catch (error) {
    console.error("Error al desactivar el plan:", error);
  }
}

function cerrarDialogo() {
  isDialogOpen.value = false;
}

onMounted(() => {
  listarPlanes();
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
  font-size: 1.5rem; /* Tamaño de fuente personalizado para la tabla */
}

.q-btn {
  cursor: pointer;
}
.boton_agregar{
  align-items: center;
  text-align: center;
  display: flex;
  justify-content: center;
  margin-top: 35px;
}
</style>