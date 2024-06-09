<template>
  <div class="contenedor">
    <div class="boton_agregar">
      <q-btn class="boton_agregar" color="primary" @click="abrirDialogoNuevoIngreso">
        <q-icon name="add" /> Nuevo Ingreso
      </q-btn>
    </div>

      <div class="q-pa-md">
        <q-table title="Ingresos" :rows="rows" :columns="columns" row-key="name" > 
          <template v-slot:body-cell-opciones="props">
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
          <div class="text-h6">{{ esNuevoIngreso ? 'Agregar Ingreso' : 'Editar Ingreso' }}</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="guardarEdicion">
            <q-input v-model="form.idCliente" label="Id Cliente" required />
            <q-input v-model="form.idSede" label="Id Sede" required />
           
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
import {useIngresosStore} from "../stores/Ingresos"

const useIngresos= useIngresosStore()

const rows = ref([])
const columns = ref([
{name:"fecha", label:"Fecha", field:"fecha", align: "center"},
{name:"idCliente", label:"idCliente", field:"idCliente", align: "center"},
{name:"idSede", label:"idSede", field:"idSede", align: "center"},
{name:"opciones", label:"Opciones", field:"opciones", align: "center"},
])

const isDialogOpen = ref(false);
const esNuevoIngreso = ref(false);
const form = ref({
  idCliente: "",
  idSede: "",
  });

async function listarIngresos(){
  const r = await useIngresos.getIngresos()
  console.log(r.data.ingreso);
  rows.value = r.data.ingreso;
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


onMounted(()=>{
  listarIngresos()
})
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
  margin-top: 35px;
}
</style>
