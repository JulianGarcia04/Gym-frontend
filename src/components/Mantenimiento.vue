<template>
  <div class="contenedor">
    <div class="busqueda">
      <q-input class="input" v-model="MantenimientosId" label="Buscar por ID" />
      <q-btn class="boton_buscar" color="primary" @click="buscarMantenimiento"
        >Buscar</q-btn
      >
        <q-btn class="todos" color="primary" @click="listarMantenimiento()"
        >Todos</q-btn
      >
    </div>
    <div class="boton_agregar">
      <q-btn
        class="boton_agregar"
        color="primary"
        @click="abrirDialogoNuevoMantenimiento"
      >
        <q-icon name="add" /> Nuevo Mantenimiento
      </q-btn>
    </div>
    <div class="q-pa-md">
      <q-table
        title="Mantenimientos"
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
            <q-btn @click="editar(props.row)"> 🖋 </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog v-model="isDialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">
            {{ esNuevoMantenimiento ? "Agregar Mantenimiento" : "Editar Mantenimiento" }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="guardarEdicion">
            <q-input v-model="form.idMaquina" label="Maquina" required />
            <q-input v-model="form.descripcion" label="Descripcion" required />
            <q-input v-model="form.responsable" label="responsable" required />
            <q-input v-model="form.valor" label="Valor" required />

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
import { useMantenimientoStore } from "../stores/Mantenimientos";

const useMantenimiento = useMantenimientoStore();
const MantenimientosId = ref("");

const rows = ref([])
const columns = ref([
  { name: "idMaquina", label: "Maquina", field: (row)=>row.idMaquina.descripcion, align: "center" },
  { name: "fecha", label: "Fecha", field: "fecha", align: "center" },
  { name: "descripcion", label: "Descripcion", field: "descripcion", align: "center" },
  { name: "responsable", label: "Responsable", field: "responsable", align: "center" },
  { name: "valor", label: "Valor", field: "valor", align: "center" },
  { name: "editar", label: "Editar", field: "editar", align: "center" },
])

const isDialogOpen = ref(false);
const esNuevoMantenimiento = ref(false);
const form = ref({
  idMaquina: null,
  descripcion: "",
  responsable: "",
  valor: "",
});

async function listarMantenimiento(MantenimientoId = null) {
  try {
    let r;
    if (MantenimientoId) {
            console.log("llegue aca")

      r = await useMantenimiento.getMantenimientoID(MantenimientoId);
      if (r && r.data && r.data.mantenimiento) {
        rows.value = [r.data.mantenimiento]; 
      } else {
        console.error('Mantenimiento no encontrado');
      }
    } else {
      r = await useMantenimiento.getMantenimiento();
      if (r && r.data) {
        rows.value = r.data.mantenimiento;
        console.log(rows.value);
      } else {
        console.error('Error fetching Mantenimiento:', r);
      }
    }
  } catch (error) {
    console.error('Error fetching Mantenimiento:', error);
  }
}

function editar(row) {
  form.value = { ...row };
  esNuevoMantenimiento.value = false;
  isDialogOpen.value = true;
}

function abrirDialogoNuevoMantenimiento() {
  form.value = {
  idMaquina: null,
  descripcion: "",
  responsable: "",
  valor: "",
  };
  esNuevoMantenimiento.value = true;
  isDialogOpen.value = true;
}

async function guardarEdicion() {
  try {
    if (esNuevoMantenimiento.value) {
      await useMantenimiento.addMantenimiento(form.value);
    } else {
      await useMantenimiento.updateMantenimiento(form.value._id, form.value);
    }
    listarMantenimiento();
    cerrarDialogo();
  } catch (error) {
    console.error("Error al guardar la edición:", error);
  }
}


function cerrarDialogo() {
  isDialogOpen.value = false;
}

async function buscarMantenimiento() {
  if (MantenimientosId.value.trim() !== '') {
    try {
      const id = MantenimientosId.value.trim();
      const r = await useMantenimiento.getMantenimientoID(id);
      if (r && r.data && r.data.mantenimiento) {
        rows.value = [r.data.mantenimiento];
      } else {
        console.error("Mantenimiento no encontrado");
        rows.value = [];
      }
    } catch (error) {
      console.error("Error al buscar el Mantenimiento:", error);
      rows.value = [];
    }
  } else {
    console.error("Por favor ingrese un ID de Mantenimiento válido");
  }
}


onMounted(() => {
  listarMantenimiento();
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