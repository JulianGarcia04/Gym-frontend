<template>
  <div>
    <div class="q-pa-md">
      <q-table title="Usuarios" :rows="rows" :columns="columns" row-key="name">
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
import { ref, onMounted } from "vue";
import { useUsuariosStore } from "../stores/Usuarios";

const useUsuarios = useUsuariosStore();

const rows = ref([]);
const columns = ref([
  { name: "nombre", label: "Nombre", field: "nombre", align: "center" },
  { name: "telefono", label: "Telefono", field: "telefono", align: "center" },
  { name: "rol", label: "Rol", field: "rol", align: "center" },
  { name: "email", label: "Email", field: "email", align: "center" },
  { name: "password", label: "Contraseña", field: "password", align: "center" },
  {name:"opciones", label:"Opciones", field:"opciones", align: "center"},
]);

async function listarUsuarios() {
  const r = await useUsuarios.getUsuarios();
  if (r && r.data) {
    console.log(r.data);
    rows.value = r.data.usuario; // Asegúrate de que esto coincida con la estructura de datos devuelta por tu API
  } else {
    console.error("Error fetching usuarios:", r);
  }
}

onMounted(() => {
  listarUsuarios();
});
</script>

