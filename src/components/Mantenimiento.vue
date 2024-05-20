<template>
  <div>
      <div class="q-pa-md">
        <q-table title="Mantenimientos" :rows="rows" :columns="columns" row-key="name" > 
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
import {useMantenimientosStore} from "../stores/Mantenimientos"

const useMantenimientos= useMantenimientosStore()

const rows = ref([])
const columns = ref([
  { name: 'descripcion', label: 'Descripcion', field: 'descripcion', align: 'center' },
  { name: 'fecha', label: 'Fecha', field: 'fecha', align: 'center' },
  { name: 'responsable', label: 'Responsable', field: 'responsable', align: 'center' },
  { name: 'valor', label: 'valor', field: 'valor', align: 'center' },
  { name: 'opciones', label: 'Opciones', align: 'center' }
]);

async function listarMantenimientos(){
  const r = await useMantenimientos.getMantenimientos()
  console.log(r.data);
  rows.value = r.data.mantenimiento;
}

onMounted(()=>{
  listarMantenimientos()
})
</script>
