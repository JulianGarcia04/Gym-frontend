<template>
  <div>
      <div class="q-pa-md">
        <q-table title="Clientes" :rows="rows" :columns="columns" row-key="name" > 
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
import {useClientesStore} from "../stores/Clientes"

const useClientes= useClientesStore()

const rows = ref([])
const columns = ref([
{name:"nombre", label:"Nombre", field:"nombre", align: "center"},
{name:"documento", label:"Documento", field:"documento", align: "center"},
{name:"direccion", label:"Dirección", field:"direccion", align: "center"},
{name:"telefono", label:"Teléfono", field:"telefono", align: "center"},
{name:"fechaNacimiento", label:"Fecha de Nacimiento", field:"fechaNacimiento", align: "center"},
{name:"FechaIngreso", label:"Fecha de ingreso", field:"FechaIngreso", align: "center"},
{name:"FechaVencimiento", label:"Fecha de vencimiento", field:"FechaVencimiento", align: "center"},
{name:"foto", label:"Foto", field:"foto", align: "center"},
])

async function listarClientes(){
  const r = await useClientes.getClientes()
  console.log(r.data);
  rows.value = r.data.cliente;
}

onMounted(()=>{
  listarClientes()
})
</script>