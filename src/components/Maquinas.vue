<template>
  <div>
      <div class="q-pa-md">
        <q-table title="Maquinas" :rows="rows" :columns="columns" row-key="name" > 
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
import {useMaquinasStore} from "../stores/Maquinas.js"

const useMaquinas= useMaquinasStore()

const rows = ref([])
const columns = ref([
{name:"codigo", label:"Codigo", field:"codigo", align: "center"},
{name:"descripcion", label:"Descripcion", field:"descripcion", align: "center"},
{name:"fechaIngreso", label:"Fecha de Ingreso", field:"fechaIngreso", align: "center"},
{name:"fechaUltmantenimiento", label:"Ultimo Mantenimiento", field:"fechaUltmantenimiento", align: "center"},
{name:"opciones", label:"Opciones", field:"opciones", align: "center"},
])

async function listarMaquinas(){
  const r = await useMaquinas.getMaquinas()
  console.log(r.data);
  rows.value = r.data.maquina;
}

onMounted(()=>{
  listarMaquinas()
})
</script>