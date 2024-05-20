<template>
  <div>
      <div class="q-pa-md">
        <q-table title="Planes" :rows="rows" :columns="columns" row-key="name" > 
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
import {usePlanesStore} from "../stores/Planes"

const usePlanes= usePlanesStore()

const rows = ref([])
const columns = ref([
{name:"descripcion", label:"Descripcion", field:"descripcion", align: "center"},
{name:"dias", label:"Dias", field:"dias", align: "center"},
{name:"valor", label:"Valor", field:"valor", align: "center"},
{name:"total", label:"Total", field:"total", align: "center"},
{name:"opciones", label:"Opciones", field:"opciones", align: "center"},
])

async function listarPlanes(){
  const r = await usePlanes.getPlanes()
  console.log(r.data);
  rows.value = r.data.plan;
}

onMounted(()=>{
  listarPlanes()
})
</script>