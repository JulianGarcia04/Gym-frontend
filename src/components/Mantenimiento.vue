<template>
  <div class="contenedor">
    <div class="busqueda">
      <q-input
        class="input"
        v-model="filtroDescripcion"
        label="Buscar por Descripción"
        @input="filtrarMantenimiento"
      />
    </div>
    <div class="boton_agregar">
      <q-btn
        class="boton_agregar"
        color="primary"
        @click="abrirDialogoNuevoMantenimiento"
        :loading="useMantenimiento.loading"
      >
        <q-icon name="add" /> Nuevo Mantenimiento
        <template v-slot:loading>
          <q-spinner color="white" size="1em" />
        </template>
      </q-btn>
    </div>
    <div class="q-pa-md">
      <q-table
        title="Mantenimientos"
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
            <q-btn @click="editar(props.row)"> 🖋 </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
    <q-dialog v-model="isDialogOpen">
      <q-card class="formulario">
        <q-card-section>
          <div class="text-h6">
            {{
              esNuevoMantenimiento
                ? "Agregar Mantenimiento"
                : "Editar Mantenimiento"
            }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="guardarEdicion">
            <div class="campo-formulario">
              <label for="maquina">Máquina</label>
        <q-select standout v-model="form.idMaquina" :options="organizarMaquinas" option-value="valor" option-label="label" label="Máquina" style="margin-bottom: 20px"
      />
            </div>
            <div class="campo-formulario">
              <q-input
                v-model="form.descripcion"
                label="Descripcion"
                required
              />
            </div>
            <div class="campo-formulario">
              <q-input
                v-model="form.responsable"
                label="responsable"
                required
              />
            </div>
            <div class="campo-formulario">
              <q-input v-model="form.valor" label="Valor" required />
            </div>
            <div class="opciones">
              <q-card-actions align="right">
              <q-btn
                flat
                class="cancelar"
                label="Cancelar"
                @click="cerrarDialogo"
              />
              <q-btn type="submit" label="Guardar" color="positive">
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
import { useMantenimientoStore } from "../stores/Mantenimientos";
import { useMaquinasStore } from "../stores/Maquinas";
import { useQuasar } from 'quasar'



const $q = useQuasar();
const formatNumber = (number) => {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const useMantenimiento = useMantenimientoStore();
const MantenimientosId = ref("");
const filtroDescripcion = ref("");
const useMaquina = useMaquinasStore();
const maquinas = ref([]);

const rows = ref([]);
const columns = ref([
  {
    name: "idMaquina",
    label: "Maquina",
    field: (row) => row.idMaquina.descripcion,
    align: "center",
  },
  {
    name: "fecha",
    label: "Fecha",
    field: (row) => row.fecha.split("T")[0],
    align: "center",
  },
  {
    name: "descripcion",
    label: "Descripcion",
    field: "descripcion",
    align: "center",
  },
  {
    name: "responsable",
    label: "Responsable",
    field: "responsable",
    align: "center",
  },
  {
    name: "valor",
    label: "Valor",
    field: (row) => formatNumber(row.valor),
    align: "center",
  },
  { name: "editar", label: "Editar", field: "editar", align: "center" },
]);

const isDialogOpen = ref(false);
const esNuevoMantenimiento = ref(false);
const form = ref({
  _id: "",
  idMaquina: "",
  descripcion: "",
  responsable: "",
  valor: "",
});

async function listarMantenimiento(MantenimientoId = null) {
  try {
    let r;
    if (MantenimientoId) {
      console.log("llegue aca");

      r = await useMantenimiento.getMantenimientoID(MantenimientoId);
      if (r && r.data && r.data.mantenimiento) {
        rows.value = [r.data.mantenimiento];
      } else {
        console.error("Mantenimiento no encontrado");
      }
    } else {
      r = await useMantenimiento.getMantenimiento();
      if (r && r.data) {
        rows.value = r.data.mantenimiento;
        console.log(rows.value);
      } else {
        console.error("Error fetching Mantenimiento:", r);
      }
    }
  } catch (error) {
    console.error("Error fetching Mantenimiento:", error);
  }
}

async function editar(row) {
  await listarMaquina();
  form.value = {
    ...row,
idMaquina: organizarMaquinas.value.find(plan => plan.valor === row.idMaquina._id) || null,
  };
  esNuevoMantenimiento.value = false;
  isDialogOpen.value = true;
}

async function abrirDialogoNuevoMantenimiento() {
  await useMaquina.getMaquinas();
  maquinas.value = useMaquina.maquinas;
  console.log(useMaquina.getMaquinas);
  form.value = {
  _id: "",
    idMaquina: "",
    descripcion: "",
    responsable: "",
    valor: "",
  };
  esNuevoMantenimiento.value = true;
  isDialogOpen.value = true;
}

async function guardarEdicion() {
  try {
    const isValid = await validar();
    if (!isValid) return;

    const formData = { ...form.value };
    formData.idMaquina = formData.idMaquina.valor;

    if (esNuevoMantenimiento.value) {
      await useMantenimiento.addMantenimiento(formData);
    } else {
      await useMantenimiento.updateMantenimiento(formData._id, formData);
    }
    listarMantenimiento();
    listarMaquina();
    cerrarDialogo();
    mostrarMensajeExito("Mantenimiento guardado exitosamente");

  } catch (error) {
    console.error("Error al guardar la edición:", error);
  }
}

async function validar() {
  let verificado = true;

  if (!form.value.idMaquina || (typeof form.value.idMaquina === 'object' && Object.keys(form.value.idMaquina).length === 0)) {
    mostrarMensajeError("La máquina está vacia");
    verificado = false;
  }
  if (form.value.descripcion === "") {
    mostrarMensajeError("la descripcion está vacía");
    verificado = false;
  }
  if (form.value.responsable === "") {
    mostrarMensajeError("el responsable está vacío");
    verificado = false;
  }
  if (!form.value.valor || !/^\d+$/.test(form.value.valor)) {
    mostrarMensajeError('El valor debe ser un número');
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



function cerrarDialogo() {
  isDialogOpen.value = false;
}

async function buscarMantenimiento() {
  if (MantenimientosId.value.trim() !== "") {
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

const filtrados = computed(() => {
  if (filtroDescripcion.value === "") {
    return rows.value;
  }
  return rows.value.filter((row) =>
    row.descripcion
      .toLowerCase()
      .includes(filtroDescripcion.value.toLowerCase())
  );
});

onMounted(async () => {
   listarMantenimiento();
await listarMaquina();
});

let maquinaTodo = ref([]);
let nombreCodigo = ref([]);

const organizarMaquinas = computed(() => {
  return maquinaTodo.value.map((element) => ({
    label: `${element.codigo} - ${element.descripcion}`,
    valor: `${element._id}`,
    nombre: `${element.nombre}`,
  }));
});

async function listarMaquina() {
  try {
    const res = await useMaquina.getMaquinas();
    console.log('Respuesta completa de getMaquinas:', res);
    
    if (res.data && res.data.maquina) {  // Cambiado de 'activados' a 'maquina'
      console.log('Todas las máquinas:', res.data.maquina);
      
      maquinaTodo.value = res.data.maquina.filter(maquina => maquina.estado === 1 || maquina.estado === 'activo');
      console.log('Máquinas activas después del filtro:', maquinaTodo.value);
    } else {
      console.error('La respuesta no contiene máquinas');
      maquinaTodo.value = [];
    }
  } catch (error) {
    console.error("Error al listar maquinas:", error);
    maquinaTodo.value = [];
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

</style>