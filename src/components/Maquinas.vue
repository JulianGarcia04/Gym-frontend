<template>
  <div class="contenedor">
    <div class="busqueda">
      <q-input
        class="input"
        v-model="filtroDescripcion"
        label="Buscar por Descripción"
        @input="filtrarMaquinas"
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
        @click="abrirDialogoNuevaMaquina"
        :loading="useMaquinas.loading"
      >
        <q-icon name="add" /> Nueva Máquina
        <template v-slot:loading>
          <q-spinner color="white" size="1em" />
        </template>
      </q-btn>
    </div>
    <div class="q-pa-md">
      <q-table
        title="Maquinas"
        :rows="filtrados"
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
            <q-btn v-if="props.row.estado == 1" @click="desactivar(props.row)" :loading="useMaquinas.loading"
              >❌
              <template v-slot:loading>
                <q-spinner color="white" size="1em" />
              </template></q-btn
            >

            <q-btn v-else @click="activar(props.row)"  :loading="useMaquinas.loading">✅
              <template v-slot:loading>
                <q-spinner color="white" size="1em" />
              </template>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

    <q-dialog v-model="isDialogOpen">
      <q-card class="formulario">
        <q-card-section>
          <div class="text-h6">
            {{ esNuevaMaquina ? "Agregar Maquina" : "Editar Maquina" }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="guardarEdicion">
            <div class="campo-formulario">
              <label for="sede">Sede</label>
<q-select
      standout
      v-model="form.idSede"
      :options="organizarSedes"
      option-value="valor"
      option-label="label"
      label="Sede"
      style=" margin-bottom: 20px"
    />
            </div>
            <div class="campo-formulario">
              <q-input
                v-model="form.descripcion"
                label="Descripción"
                required
              />
            </div>
            <div class="campo-formulario">
              <q-input
                type="Date"
                v-model="form.fechaUltmantenimiento"
                label="Último Mantenimiento"
                required
              />
            </div>
            <div class="opciones">
            <q-card-actions align="right">
              <q-btn
              class="cancelar"
                flat
                label="Cancelar"
                @click="cerrarDialogo"
              />
              <q-btn type="submit" label="Guardar" color="positive"  :loading="useMaquinas.loading" >
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
import { ref, onMounted, computed } from "vue";
import { useMaquinasStore } from "../stores/Maquinas";
import { useSedesStore } from "../stores/Sedes.js";
import { useQuasar } from 'quasar'



const $q = useQuasar();
const useMaquinas = useMaquinasStore();
const maquinasId = ref("");
const filtroDescripcion = ref("");
const useSede = useSedesStore();
const sedes = ref([]);
let maquinas = ref([]);


function listar(tipo) {
  if (tipo === 'activos') {
    listarActivos();
  } else if (tipo === 'inactivos') {
    listarInactivos();
  } else {
    listarMaquinas();
  }
}
const rows = ref([]);
const columns = ref([
  {
    name: "sede",
    label: "Sede",
    field: (row) => row.idSede.nombre,
    align: "center",
  },
  {
    name: "descripcion",
    label: "Descripción",
    field: "descripcion",
    align: "center",
  },
  {
    name: "fechaIngreso",
    label: "Fecha de Ingreso",
    field: (row) => row.fechaIngreso.split("T")[0],
    align: "center",
  },
  {
    name: "fechaUltmantenimiento",
    label: "Ultimo Mantenimiento",
    field: (row) => row.fechaUltmantenimiento.split("T")[0],
    align: "center",
  },
    {name:"codigo", sortable:true, label:"Código de la máquina", field:"codigo", align:"center",},
  { name: "estado", label: "Estado", field: "estado", align: "center" },
  { name: "editar", label: "Editar", field: "Editar", align: "center" },
  { name: "opciones", label: "Opciones", field: "Opciones", align: "center" },
]);

const isDialogOpen = ref(false);
const esNuevaMaquina = ref(false);
const form = ref({
  _id: "",
  idSede: "",
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
        console.error("Maquina no encontrada");
      }
    } else {
      r = await useMaquinas.getMaquinas();
      maquinas.value = r.data.maquina;
      console.log(maquinas.value);
      if (r && r.data) {
        rows.value = r.data.maquina;
      } else {
        console.error("Error fetching Maquina:", r);
      }
    }
  } catch (error) {
    console.error("Error fetching Maquina:", error);
  }
}

const listarActivos = async () => {
  try {
    const res = await useMaquinas.listarActivos();
    rows.value = res.data.activadas;
    console.log(res.data.activaas);
  } catch (error) {
    console.error("Error fetching usuarios:", error);
  }
};
const listarInactivos = async () => {
  try {
    const res = await useMaquinas.listarInactivos();
    rows.value = res.data.desactivadas;
    console.log(res.data.desactivadas);
  } catch (error) {
    console.error("Error fetching usuarios:", error);
  }
};

async function editar(row) {
  await listarSedes();
  form.value = {
    ...row,
    idSede: organizarSedes.value.find(plan => plan.valor === row.idSede._id) || null,
  };
  form.value.fechaUltmantenimiento = row.fechaUltmantenimiento.split("T")[0]
  esNuevaMaquina.value = false;
  isDialogOpen.value = true;
}

async function abrirDialogoNuevaMaquina() {
await listarSedes();
  form.value = {
  _id: "",
    descripcion: "",
    fechaIngreso: "",
    fechaUltmantenimiento: "",
  };
  esNuevaMaquina.value = true;
  isDialogOpen.value = true;
}

async function guardarEdicion() {
    try {
    const isValid = await validar();
    
    if (!isValid) {
      return;
    }

    const formData = { ...form.value };
    formData.idSede = formData.idSede.valor;

    if (esNuevaMaquina.value) {
      await useMaquinas.addMaquina(formData);
    } else {
      await useMaquinas.updateMaquina(formData._id, formData);
    }
    listarMaquinas();
    listarSedes();
    cerrarDialogo();
    mostrarMensajeExito("Máquina guardada exitosamente");
  } catch (error) {
    console.error("Error al guardar la edición:", error);
  }
}

async function validar() {
  let verificado = true;
  if (!form.value.idSede || (typeof form.value.idSede === 'object' && Object.keys(form.value.idSede).length === 0)) {
    mostrarMensajeError("La sede está vacío");
    verificado = false;
  }
  if (form.value.descripcion === "") {
    mostrarMensajeError("la descripción está vacía");
    verificado = false;
  }
  return verificado;
}

function mostrarMensajeError(mensaje) {
    $q.notify({
        type: "negative",
        message: mensaje,
        position: "bottom-right",
    });
}

function mostrarMensajeExito(mensaje) {
    $q.notify({
        type: "positive",
        message: mensaje,
        position: "bottom-right",
    });
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
  try {
    let buscarId = maquinas.value[maquinasId.value - 1];
    let id = buscarId._id;
    let r = await useMaquinas.getMaquinasID(id);
    rows.value = [r.data.maquina];
  } catch (error) {
    console.error("Error al buscar la máquina:", error);
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

function filtrarMaquinas() {
}
onMounted(async () => {
   listarMaquinas();
await listarSedes();
});


let sedesTodo = ref([]);
let nombreCodigo = ref([]);

    const organizarSedes = computed(() => {
      return sedesTodo.value.map((element) => ({
        label: element.nombre,
        valor: element._id,
        nombre: element.nombre,
      }));
    });


    // async function listarSedes() {
    //   try {
    //     const res = await useSede.getSedes();
    //     console.log(res.data);
    //     sedesTodo.value = res.data.sede;
    //   } catch (error) {
    //     console.error("Error al listar sedes:", error);
    //   }
    // }
async function listarSedes() {
  try {
    const res = await useSede.listaractivos();
    console.log('Sedes Response:', res); // Verifica la estructura completa de la respuesta

    if (res.data && res.data.activadas) {
      console.log('Sedes Activas:', res.data.activadas); // Verifica las sedes activas
      sedesTodo.value = res.data.activadas;
    } else {
      console.error('La respuesta de la API no contiene las sedes.');
    }
  } catch (error) {
    console.error("Error al listar sedes:", error);
  }
}

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
  font-size: 1.5rem;
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
  background-color: #bd9727;
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
.maquina{
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