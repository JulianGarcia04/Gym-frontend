<template>
  <div>
      <div class="q-pa-md">
        <q-table title="Sedes" :rows="rows" :columns="columns" row-key="name" > 
          <template v-slot:body-cell-opciones="props">
            <q-td :props="props">
              <q-btn @click="editar()">
                🖋️
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
      
  </div>

</template>

<script setup>
import { ref, onMounted } from "vue"
import {useSedesStore} from "../stores/Sedes"

const useSedes= useSedesStore()

const rows = ref([])
const columns = ref([
{name:"nombre", label:"Nombre", field:"nombre", align: "center"},
{name:"ciudad", label:"Ciudad", field:"ciudad", align: "center"},
{name:"direccion", label:"Dirección", field:"direccion", align: "center"},
{name:"telefono", label:"Teléfono", field:"telefono", align: "center"},
{name:"horario", label:"Horario", field:"horario", align: "center"},
  {name:"opciones", label:"Opciones", field:"opciones", align: "center"},
])

async function listarSedes(){
  const r = await useSedes.getSedes()
  console.log(r.data);
  rows.value = r.data.sede;
}

onMounted(()=>{
  listarSedes()
})
</script>