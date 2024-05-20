<template>
  <div>
      <div class="q-pa-md">
        <q-table title="Pagos" :rows="rows" :columns="columns" row-key="name" > 
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
import {usePagosStore} from "../stores/Pagos"

const usePagos= usePagosStore()

const rows = ref([])
const columns = ref([
{name:"plan", label:"Plan", field:"plan", align: "center"},
{name:"valor", label:"Valor", field:"valor", align: "center"},
{name:"fecha", label:"Fecha", field:"fecha", align: "center"},
{name:"opciones", label:"Opciones", field:"opciones", align: "center"},
])

async function listarPagos(){
  const r = await usePagos.getPagos()
  console.log(r.data);
  rows.value = r.data.pago;
}

onMounted(()=>{
  listarPagos()
})
</script>