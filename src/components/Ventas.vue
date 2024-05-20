<template>
  <div>
      <div class="q-pa-md">
        <q-table title="Ventas" :rows="rows" :columns="columns" row-key="name" > 
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
import {useVentasStore} from "../stores/Ventas"

const useVentas= useVentasStore()

const rows = ref([])
const columns = ref([
{name:"fecha", label:"Fecha", field:"fecha", align: "center"},
{name:"codigo", label:"Codigo", field:"codigo", align: "center"},
{name:"cantidad", label:"Cantidad  ", field:"cantidad", align: "center"},
{name:"valorUnitario", label:"valor Unitario", field:"valorUnitario", align: "center"},
{name:"total", label:"Total", field:"total", align: "center"},
{name:"opciones", label:"Opciones", field:"opciones", align: "center"},
])

async function listarVentas(){
  const r = await useVentas.getVentas()
  console.log(r.data);
  rows.value = r.data.venta;
}

onMounted(()=>{
  listarVentas()
})
</script>