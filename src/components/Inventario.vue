<template>
  <div>
      <div class="q-pa-md">
        <q-table title="Inventario" :rows="rows" :columns="columns" row-key="name" > 
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
import {useInventarioStore} from "../stores/Inventario"

const useInventario= useInventarioStore()

const rows = ref([])
const columns = ref([
{name:"codigo", label:"Codigo", field:"codigo", align: "center"},
{name:"descripcion", label:"Descripcion", field:"descripcion", align: "center"},
{name:"cantidad", label:"Cantidad", field:"cantidad", align: "center"},
{name:"valor", label:"Valor", field:"valor", align: "center"},
{name:"opciones", label:"Opciones", field:"opciones", align: "center"},
])

async function listarInventario(){
  const r = await useInventario.getInventario()
  console.log(r.data);
  rows.value = r.data.inventario;
}

onMounted(()=>{
  listarInventario()
})
</script>