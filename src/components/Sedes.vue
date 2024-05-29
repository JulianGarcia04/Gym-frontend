

<template>
  <div class="contenedor">
    <div class="boton_agregar">
    <q-btn class="boton_agregar" color="primary" @click="abrirDialogoNuevaSede">
      <q-icon name="add" /> Nueva Sede
    </q-btn>
  </div>
    <div class="q-pa-md">
      <q-table title="Sedes" :rows="rows" :columns="columns" row-key="name" style="width: 100%">
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
          <div class="text-h6">{{ esNuevaSede ? 'Agregar Sede' : 'Editar Sede' }}</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="guardarEdicion">
            <q-input v-model="form.nombre" label="Nombre" required />
            <q-input v-model="form.ciudad" label="Ciudad" required />
            <q-input v-model="form.direccion" label="Dirección" required />
            <q-input v-model="form.telefono" label="Teléfono" required />
            <q-input v-model="form.horario" label="Horario" required />

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
import { ref, onMounted } from "vue";
import { useSedesStore } from "../stores/Sedes";

const useSedes = useSedesStore();

const rows = ref([]);
const columns = ref([
  { name: "nombre", label: "Nombre", field: "nombre", align: "center" },
  { name: "ciudad", label: "Ciudad", field: "ciudad", align: "center" },
  { name: "direccion", label: "Dirección", field: "direccion", align: "center" },
  { name: "telefono", label: "Teléfono", field: "telefono", align: "center" },
  { name: "horario", label: "Horario", field: "horario", align: "center" },
  { name: "estado", label: "Estado", field: "estado", align: "center" },
  { name: "editar", label: "Editar", field: "editar", align: "center" },
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },
]);

const isDialogOpen = ref(false);
const esNuevaSede = ref(false);
const form = ref({
  id: null,
  nombre: "",
  ciudad: "",
  direccion: "",
  telefono: "",
  horario: "",
  estado: 1,
});

async function listarSedes() {
  const r = await useSedes.getSedes();
  console.log(r.data);
  rows.value = r.data.sede;
}

function editar(row) {
  form.value = { ...row };
  esNuevaSede.value = false;
  isDialogOpen.value = true;
}

function abrirDialogoNuevaSede() {
  form.value = {
    id: null,
    nombre: "",
    ciudad: "",
    direccion: "",
    telefono: "",
    horario: "",
    estado: 1,
  };
  esNuevaSede.value = true;
  isDialogOpen.value = true;
}

async function guardarEdicion() {
  try {
    if (esNuevaSede.value) {
      await useSedes.addSede(form.value);
    } else {
      await useSedes.updateSede(form.value._id, form.value);
    }
    listarSedes();
    cerrarDialogo();
  } catch (error) {
    console.error("Error al guardar la edición:", error);
  }
}

async function activar(row) {
  try {
    await useSedes.activateSede(row._id);
    listarSedes();
  } catch (error) {
    console.error("Error al activar la sede:", error);
  }
}

async function desactivar(row) {
  try {
    await useSedes.deactivateSede(row._id);
    listarSedes();
  } catch (error) {
    console.error("Error al desactivar la sede:", error);
  }
}

function cerrarDialogo() {
  isDialogOpen.value = false;
}

onMounted(() => {
  listarSedes();
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


