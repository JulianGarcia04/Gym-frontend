
<template>
  <div class="contenedor">
    <div class="busqueda">
      <q-input class="input" v-model="InventariosId" label="Buscar por ID" />
      <q-btn class="boton_buscar" color="primary" @click="buscarInventario"
        >Buscar</q-btn
      >
        <q-btn class="todos" color="primary" @click="listarInventario()"
        >Todos</q-btn
      >
    </div>
    <div class="boton_agregar">
      <q-btn
        class="boton_agregar"
        color="primary"
        @click="abrirDialogoNuevoInventario"
      >
        <q-icon name="add" /> Nuevo inventario
      </q-btn>
    </div>
    <div class="q-pa-md">
      <q-table
        title="Inventario"
        :rows="rows"
        :columns="columns"
        row-key="name"
        style="width: 100%"
      >
        <template v-slot:body-cell-estado="props">
          <q-td :props="props">
            <q-chip
              :color="props.row.estado === 1 ? 'green' : 'red'"
              text-color="white"
            >
              {{ props.row.estado === 1 ? "Activo" : "Inactivo" }}
            </q-chip>
          </q-td>
        </template>
        <template v-slot:body-cell-editar="props">
          <q-td :props="props">
            <q-btn @click="editar(props.row)"> 🖋️ </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>



    <q-dialog v-model="isDialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-h6">
            {{ esNuevoInventario ? "Agregar Producto" : "Editar Producto" }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="guardarEdicion">
            <q-input v-model="form.codigo" label="Código" required />
            <q-input v-model="form.descripcion" label="Descripción" required />
            <q-input v-model="form.cantidad" label="Cantidad" required />
            <q-input v-model="form.valor" label="Valor" required />

            <q-card-actions align="right">
              <q-btn
                flat
                label="Cancelar"
                color="negative"
                @click="cerrarDialogo"
              />
              <q-btn type="submit" label="Guardar" color="positive" />
            </q-card-actions>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useInventarioStore } from "../stores/Inventario";

const useInventario = useInventarioStore();
const InventariosId = ref("");

const rows = ref([])
const columns = ref([
  { name: "codigo", label: "Codigo", field: "codigo", align: "center" },
  { name: "descripcion", label: "Descripcion", field: "descripcion", align: "center" },
  { name: "cantidad", label: "Cantidad", field: "cantidad", align: "center" },
  { name: "valor", label: "Valor", field: "valor", align: "center" },
  { name: "editar", label: "Editar", field: "editar", align: "center" },
])

const isDialogOpen = ref(false);
const esNuevoInventario = ref(false);
const form = ref({
  id: null,
  descripcion: "",
  cantidad: "",
  valor: "",
});

async function listarInventario(InventarioId = null) {
  try {
    let r;
    if (InventarioId) {
      r = await useInventario.getInventariosID(InventarioId);
      if (r && r.data && r.data.inventario) {
        rows.value = [r.data.inventario]; 
      } else {
        console.error('Producto no encontrado');
      }
    } else {
      r = await useInventario.getInventario();
      if (r && r.data) {
        rows.value = r.data.inventario;
      } else {
        console.error('Error fetching Producto:', r);
      }
    }
  } catch (error) {
    console.error('Error fetching Producto:', error);
  }
}

function editar(row) {
  form.value = { ...row };
  esNuevoInventario.value = false;
  isDialogOpen.value = true;
}

function abrirDialogoNuevoInventario() {
  form.value = {
    id: null,
    codigo: "",
    descripcion: "",
    cantidad: "",
    valor: "",
  };
  esNuevoInventario.value = true;
  isDialogOpen.value = true;
}

async function guardarEdicion() {
  try {
    if (esNuevoInventario.value) {
      await useInventario.addInventario(form.value);
    } else {
      await useInventario.updateInventario(form.value._id, form.value);
    }
    listarInventario();
    cerrarDialogo();
  } catch (error) {
    console.error("Error al guardar la edición:", error);
  }
}


function cerrarDialogo() {
  isDialogOpen.value = false;
}

async function buscarInventario() {
  if (InventariosId.value.trim() !== '') {
    try {
      const id = InventariosId.value.trim();
      const r = await useInventario.getInventariosID(id);
      if (r && r.data && r.data.inventario) {
        rows.value = [r.data.inventario];
      } else {
        console.error("Producto no encontrado");
        rows.value = [];
      }
    } catch (error) {
      console.error("Error al buscar el producto:", error);
      rows.value = [];
    }
  } else {
    console.error("Por favor ingrese un ID de producto válido");
  }
}


onMounted(() => {
  listarInventario();
});
</script>

<style scoped>
.contenedor {
  font-family: Arial, sans-serif;
  background: linear-gradient(to bottom, #303030, #6e6e6e, #a8a8a8);
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.q-pa-md {
  padding: 50px;
}

.text-h6 {
  font-size: 2rem;
}

.q-table__bottom-row {
  font-size: 3.rem;
}

.q-btn {
  cursor: pointer;
}

.boton_agregar {
  align-items: center;
  text-align: center;
  display: flex;
  justify-content: center;
  margin-top: 15px;
  font-size: 18px;
  border-radius: 10px;
  font-family: "Times New Roman";
  font-weight: bold;
}

.busqueda {
  margin-top: 25px;

  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.input {
  background-color: white;
  color: black;
  border-radius: 10px;
  margin-right: 20px;
  width: 15%;
  padding: 0px 20px;
  font-family: "Times New Roman";
}

.boton_buscar {
  align-items: center;
  text-align: center;
  display: flex;
  justify-content: center;
  font-size: 18px;
  border-radius: 10px;
  font-family: "Times New Roman";
  font-weight: bold;
}

.todos {
  margin-left: 10px;  
  align-items: center;
  text-align: center;
  display: flex;
  justify-content: center;
  font-size: 18px;
  border-radius: 10px;
  font-family: "Times New Roman";
  font-weight: bold;
}
</style>



