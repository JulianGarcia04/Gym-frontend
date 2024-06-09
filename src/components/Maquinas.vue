<template>
  <div class="contenedor">
    <div class="busqueda">
      <q-input class="input" v-model="maquinasId" label="Buscar por ID" />
      <q-btn class="boton_buscar" color="primary" @click="buscarMaquina"
        >Buscar</q-btn
      >
      <div class="listar-ai">
<button class="activar" color="primary" @click="listarActivos()">Activos</button>
<button class="inactivar" color="primary" @click="listarInactivos()">Inactivos</button>
<button class="todos" color="primary" @click="listarMaquinas()">Todos</button>
      </div>
    </div>
    <div class="boton_agregar">
      <q-btn
        class="boton_agregar"
        color="primary"
        @click="abrirDialogoNuevaMaquina"
      >
        <q-icon name="add" /> Nueva Máquina
      </q-btn>
    </div>
    <div class="q-pa-md">
      <q-table
        title="Maquinas"
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
            {{ esNuevaMaquina ? "Agregar Maquina" : "Editar Maquina" }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="guardarEdicion">
            <q-input v-model="form.idSede" label="Sede" required />
            <q-input v-model="form.descripcion" label="Descripción" required />
            <q-input v-model="form.fechaUltmantenimiento" label="Último Mantenimiento" required />

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
import { useMaquinasStore } from "../stores/Maquinas";

const useMaquinas = useMaquinasStore();
const maquinasId = ref("");

const rows = ref([])
const columns = ref([
{name:"sede", label: "Sede", field: (row) => row.idSede.nombre, align: "center"},
{name:"descripcion", label:"Descripción", field:"descripcion", align: "center"},
{name:"fechaIngreso", label:"Fecha de Ingreso", field:"fechaIngreso", align: "center"},
{name:"fechaUltmantenimiento", label:"Ultimo Mantenimiento", field:"fechaUltmantenimiento", align: "center"},
{name:"estado", label: "Estado", field: "estado", align: "center" },
{name:"editar", label: "Editar", field: "Editar", align: "center" },
{name:"opciones", label:"Opciones", field:"Opciones", align: "center"},
])

const isDialogOpen = ref(false);
const esNuevaMaquina = ref(false);
const form = ref({
  idSede: null,
  descripcion: "",
  fechaUltmantenimiento: "",
  estado: 1,

});

async function listarMaquinas(MaquinaId = null) {
  try {
    let r;
    if (MaquinaId) {
      r = await useMaquinas.getMaquinasID(MaquinaId);
      if (r && r.data && r.data.maquina) {
        rows.value = [r.data.maquina]; 
      } else {
        console.error('Maquina no encontrada');
      }
    } else {
      r = await useMaquinas.getMaquinas();
      if (r && r.data) {
        rows.value = r.data.maquina;
      } else {
        console.error('Error fetching Maquina:', r);
      }
    }
  } catch (error) {
    console.error('Error fetching Maquina:', error);
  }
}


const listarActivos = async () => {
  try {
    const res = await useMaquinas.listarActivos();
    rows.value = res.data.activados;
    console.log(res.data.activados);

  } catch (error) {
    console.error("Error fetching usuarios:", error);
  }
}
const listarInactivos = async () => {
  try {
    const res = await useMaquinas.listarInactivos();
    rows.value = res.data.desactivados;
    console.log(res.data.desactivados);
  } catch (error) {
    console.error("Error fetching usuarios:", error);
  }
}
function editar(row) {
  form.value = { ...row };
  esNuevaMaquina.value = false;
  isDialogOpen.value = true;
}

function abrirDialogoNuevaMaquina() {
  form.value = {
    codigo: null,
    descripcion: "",
    fechaIngreso: "",
    fechaUltmantenimiento: "",
  };
  esNuevaMaquina.value = true;
  isDialogOpen.value = true;
}

async function guardarEdicion() {
  console.log(form.value);
  try {
    if (esNuevaMaquina.value) {
      const response = await useMaquinas.addMaquina(form.value);
      console.log('Respuesta del servidor:', response);
    } else {
      const response = await useMaquinas.updateMaquina(form.value._id, form.value);
      console.log('Respuesta del servidor:', response);
    }
    listarMaquinas();
    cerrarDialogo();
  } catch (error) {
    console.error("Error al guardar la edición:", error.response ? error.response.data : error);
  }
}

async function activar(row) {
  try {
    await useMaquinas.activateMaquina(row._id);
    listarMaquinas();
  } catch (error) {
    console.error("Error al activar la Maquina:", error);
  }
}

async function desactivar(row) {
  try {
    await useMaquinas.deactivateMaquina(row._id);
    listarMaquinas();
  } catch (error) {
    console.error("Error al desactivar la Maquina:", error);
  }
}

function cerrarDialogo() {
  isDialogOpen.value = false;
}

async function buscarMaquina() {
  if (maquinasId.value.trim() !== '') {
    try {
      const id = maquinasId.value.trim();
      const r = await useClientes.getMaquinasID(id);
      if (r && r.data && r.data.cliente) {
        const maquinaEncontrada = r.data.cliente;
        form.value = { ...maquinaEncontrada };
        esNuevaMaquina.value = false;
        isDialogOpen.value = true;
      } else {
        console.error('máquina no encontrada');
      }
    } catch (error) {
      console.error('Error al buscar la máquina:', error);
    }
  } else {
    console.error('Por favor ingrese un ID de máquina válido');
  }
}


onMounted(() => {
  listarMaquinas();
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