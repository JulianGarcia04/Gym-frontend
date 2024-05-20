<template>
  <div>
      <div class="q-pa-md">
        <q-table title="Ingresos" :rows="rows" :columns="columns" row-key="name" > 
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
import {useIngresosStore} from "../stores/Ingresos"

const useIngresos= useIngresosStore()

const rows = ref([])
const columns = ref([
{name:"fecha", label:"Fecha", field:"fecha", align: "center"},
{name:"idCliente", label:"idCliente", field:"idCliente", align: "center"},
{name:"idSede", label:"idSede", field:"idSede", align: "center"},
{name:"opciones", label:"Opciones", field:"opciones", align: "center"},
])

async function listarIngresos(){
  const r = await useIngresos.getIngresos()
  console.log(r.data);
  rows.value = r.data.ingreso;
}

onMounted(()=>{
  listarIngresos()
})
</script>