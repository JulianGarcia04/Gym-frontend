<template>
  <div class="contenedor">
    <div class="busqueda">
      <q-input
        class="input"
        v-model="filtroDocumento"
        label="Buscar por Documento"
        @input="filtrarClientes"
      />

      <q-btn-dropdown color="primary" icon="visibility" label="Ver" style="margin-left: 16px;">
        <q-list>
          <q-item clickable v-ripple @click="listar('todos')">
            <q-item-section>Listar Todos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listar('activos')">
            <q-item-section>Listar Activos</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="listar('inactivos')">
            <q-item-section>Listar Inactivos</q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>

<q-btn-dropdown color="primary" icon="visibility" label="Ver Planes" style="margin-left: 16px;">
      <q-list>
        <q-item clickable v-ripple @click="planSeleccionado = plan._id; buscarClientesporPlan()" v-for="plan in planesTodo" :key="plan.id">
          <q-item-section>{{ plan.descripcion }}</q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>


    </div>
    <div class="boton_agregar">
      <q-btn
        class="boton_agregar"
        color="primary"
        @click="abrirDialogoNuevoCliente"
        :loading="useClientes.loading"
      >
        <q-icon name="add" /> Nuevo Cliente
        <template v-slot:loading>
          <q-spinner color="white" size="1em" />
        </template>
      </q-btn>
    </div>



    <div class="q-pa-md">
      <q-table
        title="Cliente"
        :rows="filtrados"
        :columns="columns"
        row-key="name"
        style="width: 100%"
      >
      

      <template v-slot:body-cell-observaciones="props">
        <q-td :props="props">
          
          <div @click="observacionesf(props.row)">
          <span class="truncated-text" >
            {{ props.row.observaciones }}
            <q-tooltip anchor="bottom middle" self="top middle" :content="props.row.observaciones" transition-show="scale" transition-hide="scale">
              <span class="truncated-text">{{ props.row.observaciones }}</span>
            </q-tooltip>
          </span>
        </div>

          <div v-if="observacioncliente !== null" class="mostrarobservacions">
            <div class="obserdiv">
              <div class="obscerrar">
              <q-btn color="primary" @click="observacioncliente = null" class="obscerrar">X</q-btn>
            </div>
                  <div class="text-container">
                    <p>{{observacioncliente.observaciones}}</p>
                  </div>
            </div></div>
        </q-td>
      </template>

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

        <template v-slot:body-cell-idPlan="props">
          <q-td :props="props">
            <p>{{ getPlanCodigo(props.row.idPlan) }}</p>
          </q-td>
        </template>

        <template v-slot:body-cell-editar="props">
          <q-td :props="props">
            <q-btn @click="editar(props.row)">🖋️</q-btn>
          </q-td>
        </template>

        <template v-slot:body-cell-seguimiento="props">
          <q-td :props="props">
            <q-btn class="segui" @click="openSeguimientoModal(props.row)">
              🔍
              <q-tooltip v-model="showing">mira el seguimiento</q-tooltip>
            </q-btn>
          </q-td>
        </template>

        <template v-slot:body-cell-opciones="props">
          <q-td :props="props">
            <q-btn
              v-if="props.row.estado === 1"
              @click="desactivar(props.row)"
              :loading="useClientes.loading"
            >
              ❌
              <template v-slot:loading>
                <q-spinner color="white" size="1em" />
              </template>
            </q-btn>

            <q-btn
              v-else
              @click="activar(props.row)"
              :loading="useClientes.loading"
            >
              ✅
              <template v-slot:loading>
                <q-spinner color="white" size="1em" />
              </template>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </div>

 

    <q-dialog v-model="isDialogOpen">
      <q-card class="formulario">
        <q-card-section>
          <div class="text-h6">
            {{ esNuevoCliente ? "Agregar Cliente" : "Editar Cliente" }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-form @submit.prevent="guardarEdicion">
            <div class="campo-formulario">
              <q-input v-model="form.nombre" label="Nombre" required />
            </div>
            <div class="campo-formulario">
              <q-input v-model="form.documento" label="Documento" required />
            </div>
            <div class="campo-formulario">
              <q-input v-model="form.direccion" label="Direccion" required />
            </div>
            <div class="campo-formulario">
              <q-input v-model="form.observaciones" label="Observaciones" required />
            </div>
            <div class="campo-formulario">
              <q-input
                type="date"
                v-model="form.fechaNacimiento"
                label="Fecha de Nacimiento"
                required
              />
            </div>
            <div class="campo-formulario">
              <q-input v-model="form.telefono" label="Telefono" required />
            </div>
            <div class="campo-formulario">
              <label for="plan">Plan</label>
              <q-select
                standout
                v-model="form.idPlan"
                :options="organizarPlanes"
                option-value="valor"
                option-label="label"
                label="Plan"
                style=" margin-bottom: 20px"
              />
            </div>
            <div class="campo-formulario">
              <q-input v-model="form.foto" label="foto" required />
            </div>
<div class="opciones">
            <q-card-actions align="right">
              <q-btn
              class="cancelar"
                flat
                label="Cancelar"
                @click="cerrarDialogo"
              />
              <q-btn
                type="submit"
                label="Guardar"
                color="positive"
                :loading="useClientes.loading"
              >
                <template v-slot:loading>
                  <q-spinner color="white" size="1em" />
                </template>
              </q-btn>
            </q-card-actions>
          </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
<q-dialog v-model="seguimientoModalOpen" full-width persistent>
  <q-card >
    <q-card-section >
      <div class="text-h6">{{ selectedCliente?.nombre }}</div>
    </q-card-section>
    <q-card-section>
      <div class="nivel_imc">
        <q-btn class="nivel_imc_bnt" @click="mostarimc">ver foto cliente</q-btn>
        <div v-if="nivelimc">
          <q-btn color="red" @click="cerrarfoto" class="fotocerrar">X</q-btn>
          <img  :src="selectedCliente?.foto" :alt="fotocliente"/>
        </div>
      </div>
    </q-card-section>
    <q-scroll-area class="full-width" style="height: 70vh;">
      <q-card-section class="modal">
        <q-table
          v-if="!mostrarFormulario"
          flat
          bordered
          :rows="selectedCliente?.seguimiento || []"
          :columns="seguimientoColumns"
          row-key="fecha"
        >
          <template v-slot:body-cell-fecha="props">
            <q-td :props="props">{{ formatDate(props.row.fecha) }}</q-td>
          </template>
                  <template v-slot:body-cell-imc="props">
            <q-td :props="props" :style="{ backgroundColor: getIMCStyle(props.row.imc).backgroundColor }">
              <p class="option-button">{{ props.row.imc }}</p>
              <span>{{ getIMCStyle(props.row.imc).label }}</span>
            </q-td>
          </template>
                  <template v-slot:body-cell-edita="props">
            <q-td :props="props">
              <div class="photo-container">
                <q-btn
                  class="segui-modal-cerrar"
                  @click="editarsegui(props.row)"
                  style="margin-left: auto; margin-right: auto; display: block;"
                >
                  ✏️
                </q-btn>
              </div>
            </q-td>
          </template>
        </q-table>
        
        <div class="mostrar_seguimiento" v-if="mostrarFormulario">
          <h4 class="text-h6">Nuevo Seguimiento</h4>
          <div class="segui-modal-contenedor">
            <label for="">Peso
              <input class="inputsegui" type="number" placeholder="Peso" v-model.number="nuevoSeguimiento.peso" />
            </label>
            <label for="">Brazo
              <input class="inputsegui" type="number" placeholder="Brazo" v-model.number="nuevoSeguimiento.brazo" />
            </label>
            <label for="">Altura
              <input class="inputsegui" type="number" placeholder="Altura (cm)" v-model.number="nuevoSeguimiento.altura" />
            </label>
            <label for="">Edad
              <input class="inputsegui" type="number" placeholder="Edad" v-model.number="nuevoSeguimiento.edad" />
            </label>
            <!-- <div class="botones_seguimiento">
              <q-btn class="agregaedita" @click="guardarSeguimiento">
              Guardar Seguimiento
            </q-btn>
            <q-btn color="primary" @click="toggleFormulario" class="segui-modal-cerrar">
              Cancelar
            </q-btn>
            </div> -->
  
  <div class="botones_seguimiento">
    <button v-if="botoneditar" class="agregaedita" @click="editaseguimiento" :loading="useClientes.loading" style="margin-left: auto; margin-right: auto; display: block;">
      Editar
    </button>
    <button v-else class="agregaedita" @click="guardarSeguimiento" :loading="useClientes.loading" style="margin-left: auto; margin-right: auto; display: block;">
      Agregar Seguimiento
    </button>
    <!-- <q-btn @click="toggleFormulario" class="segui-modal-cerrar" style="margin-left: auto; margin-right: auto; display: block;">
      Cancelar
    </q-btn> -->
  </div>
  
  
  
          </div>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="row justify-between">
          <apexchart
            v-for="{options, series} in chartOptions"
            :key="options.chart.id"
            width="500"
            type="line"
            :options="options"
            :series="series"
          >
          </apexchart>
        </div>
      </q-card-section>
    </q-scroll-area>
    <q-card-actions align="center">
      <q-btn class="cerrar_seguimiento" flat label="Cerrar" @click="closeModal" />
      <q-btn class="agregar_seguimiento" v-if="!mostrarFormulario" @click="toggleFormulario">Agregar Seguimiento</q-btn>
    </q-card-actions>
  </q-card>
</q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useClientesStore } from "../stores/Clientes";
import { usePlanesStore } from "../stores/Planes";
import { useQuasar, date } from 'quasar'


const planSeleccionado=ref()
const $q = useQuasar();
const useClientes = useClientesStore();
const usePlan = usePlanesStore();

const rows = ref([]);
const filtroDocumento = ref("");
const isDialogOpen = ref(false);
const esNuevoCliente = ref(false);
const form = ref({
  idPlan: null,
  nombre: "",
  documento: "",
  direccion: "",
  observaciones: "",
  fechaNacimiento: "",
  telefono: "",
  estado: 1,
  foto: "",
});

let planesTodo = ref([]);

const chartOptions = computed(() => {
  return [
    {
      options: {
        chart: {
          id: "weight-chart",
        },
        title: {
          text: 'Peso',
          align: 'left'
        },
        xaxis: {
          categories: selectedCliente.value?.seguimiento.map((seg) => {
            console.log(seg.fecha)
            return date.formatDate(new Date(seg.fecha), 'DD MMM YYYY')
          })
        },
      },
      series: [
        {
          name: 'series-1',
          data: selectedCliente.value?.seguimiento.map((seg) => {
            return seg.peso
          })
        }
      ]
    },
    {
      options: {
        chart: {
          id: "arm-chart",
        },
        title: {
          text: 'Brazo',
          align: 'left'
        },
        xaxis: {
          categories: selectedCliente.value?.seguimiento.map((seg) => {
            return date.formatDate(new Date(seg.fecha), 'DD MMM YYYY')
          })
        },
      },
      series: [
        {
          name: 'series-1',
          data: selectedCliente.value?.seguimiento.map((seg) => {
            return seg.brazo
          })
        }
      ]
    }
  ]
})

const columns = ref([
  { name: "nombre", label: "Nombre", field: "nombre", align: "center" },
  { name: "documento", label: "Documento", field: "documento", align: "center" },
  { name: "direccion", label: "Direccion", field: "direccion", align: "center" },
  { name: "fechaNacimiento", label: "Fecha de Nacimiento", field: (row) => row.fechaNacimiento.split("T")[0], align: "center" },
  { name: "observaciones", label: "Observaciones del Cliente", field: "observaciones", align: "center" },
  { name: "telefono", label: "Telefono", field: "telefono", align: "center" },
  { name: "estado", label: "Estado", field: "estado", align: "center" },
  { name: "idPlan", label: "Plan", field: "idPlan", align: "center" },
  { name: "foto", label: "Foto", field: "foto", align: "center" },
  { name: "seguimiento", label: "Seguimiento", field: "seguimiento", align: "center" },
  { name: "editar", label: "Editar", field: "editar", align: "center" },
  { name: "opciones", label: "Opciones", field: "opciones", align: "center" },
]);

const getPlanCodigo = (id) => {
const plan = planesTodo.value.find(plan => plan._id === id._id);
  return plan ? `${plan.codigo} - ${plan.descripcion}` : 'Plan no encontrado';
};


const organizarPlanes = computed(() => {
  return planesTodo.value.map((element) => ({
    label: `${element.codigo} - ${element.descripcion}`,
    valor: `${element._id}`,
    nombre: `${element.nombre}`,
  }));
});

async function listarPlanes() {
  try {
    const res = await usePlan.getPlanes();
    console.log('Planes Response:', res);
    
    if (res.data && res.data.plan) {
      console.log('Todos los planes:', res.data.plan);
      
      // Filtramos los planes con estado 1 (que asumimos que significa 'activo')
      planesTodo.value = res.data.plan.filter(plan => plan.estado === 1);
      console.log('Planes Activos:', planesTodo.value);
      
      if (planesTodo.value.length === 0) {
        console.warn('No se encontraron planes activos');
      }
    } else {
      console.error('La respuesta de la API no contiene los planes.');
    }
  } catch (error) {
    console.error("Error al listar planes:", error);
  }
}


const obtenerClienteReciente = () => {
  return localStorage.getItem('clienteRecienteId');
}

async function listarClientes() {
  try {
    const res = await useClientes.getClientes();
    if (res && res.data && res.data.cliente) {
      const clienteRecienteId = obtenerClienteReciente();
      rows.value = res.data.cliente.map(cliente => ({
        ...cliente,
        idPlan: cliente.idPlan,
      })).sort((a, b) => {
        if (a._id === clienteRecienteId) return -1;
        if (b._id === clienteRecienteId) return 1;
        return new Date(b.fechaNacimiento) - new Date(a.fechaNacimiento);
      });
    } else {
      console.error("Datos inesperados del servidor:", res);
    }
  } catch (error) {
    console.error("Error al listar clientes:", error);
  }
}


async function validar() {
  let verificado = true;

  if (form.value.nombre === "") {
    mostrarMensajeError("El nombre está vacío");
    verificado = false;
  }
  if (form.value.documento === "") {
    mostrarMensajeError("El tipo de documento está vacío");
    verificado = false;
  }
  if (!form.value.idPlan || (typeof form.value.idPlan === 'object' && Object.keys(form.value.idPlan).length === 0)) {
    mostrarMensajeError("El plan está vacío");
    verificado = false;
  }
  if (form.value.direccion === "") {
    mostrarMensajeError("La dirección está vacía");
    verificado = false;
  }
  if (form.value.fechaNacimiento === "") {
    mostrarMensajeError("La fecha de nacimiento está vacía");
    verificado = false;
  } else {
    let fechaNacimientoDate = new Date(form.value.fechaNacimiento);
    let fechaActual = new Date();
    let edad = fechaActual.getFullYear() - fechaNacimientoDate.getFullYear();
    if (fechaActual.getMonth() < fechaNacimientoDate.getMonth() || (fechaActual.getMonth() === fechaNacimientoDate.getMonth() && fechaActual.getDate() < fechaNacimientoDate.getDate())) {
      edad--;
    }
    if (edad < 12) {
      mostrarMensajeError("Debes tener al menos 12 años");
      verificado = false;
    }
  }
  if (form.value.telefono === "" || isNaN(form.value.telefono) || form.value.telefono < 0 || form.value.telefono.length < 10) {
    mostrarMensajeError("El teléfono debe ser un número válido y tener al menos 10 caracteres");
    verificado = false;
  }
    if (form.value.foto === "") {
    mostrarMensajeError("Debe ingresar un enlace para la foto");
    verificado = false;
  }
      if (form.value.observaciones === "") {
    mostrarMensajeError("Debe ingresar un enlace para la foto");
    verificado = false;
  }
  return verificado;
}

function mostrarMensajeError(mensaje) {
    $q.notify({
        type: "negative",
        message: mensaje,
        position: "bottom-right",
    });
}

function mostrarMensajeExito(mensaje) {
    $q.notify({
        type: "positive",
        message: mensaje,
        position: "bottom-right",
    });
}




async function listar(tipo) {
  switch (tipo) {
    case 'activos':
      listarActivos();
      break;
    case 'inactivos':
      listarInactivos();
      break;
    default:
      listarClientes();
      break;
  }
}

const listarActivos = async () => {
  try {
    const res = await useClientes.listarActivos();
    rows.value = res.data.activados;
  } catch (error) {
    console.error("Error fetching clientes:", error);
  }
};

const listarInactivos = async () => {
  try {
    const res = await useClientes.listarInactivos();
    rows.value = res.data.desactivados;
  } catch (error) {
    console.error("Error fetching clientes:", error);
  }
};

async function editar(row) {
  await listarPlanes();
  form.value = {
    ...row,
    fechaNacimiento: row.fechaNacimiento.split("T")[0],
    idPlan: organizarPlanes.value.find(plan => plan.valor === row.idPlan._id) || null,
  };
  esNuevoCliente.value = false;
  isDialogOpen.value = true;
}

async function abrirDialogoNuevoCliente() {
  await listarPlanes();
  form.value = {
    nombre: "",
    documento: "",
    direccion: "",
    observaciones: "",
    fechaNacimiento: "",
    telefono: "",
    estado: 1,
    foto: "",
    idPlan: null,
  };
  esNuevoCliente.value = true;
  isDialogOpen.value = true;
}


async function guardarEdicion() {
  try {
    const isValid = await validar();
    
    if (!isValid) {
      return;
    }

    const formData = { ...form.value };
    formData.idPlan = formData.idPlan.valor;

    if (esNuevoCliente.value) {
      console.log("Adding new client:", formData);
      const response = await useClientes.addCliente(formData);
      console.log("Add client response:", response);
    } else {
      const { _id, ...updateData } = formData;
      console.log("Updating client:", _id, updateData);
      const response = await useClientes.updateCliente(_id, updateData);
      console.log("Update client response:", response);
    }

    await listarClientes();
    await listarPlanes();
    cerrarDialogo();
    mostrarMensajeExito("Cliente guardado exitosamente");
  } catch (error) {
    console.error("Error al guardar la edición:", error);
    mostrarMensajeError("Error al guardar el cliente: " + error.message);
  }
}

async function activar(row) {
  try {
    await useClientes.activateCliente(row._id);
    listarClientes();
  } catch (error) {
    console.error("Error al activar el Cliente:", error);
  }
}

async function desactivar(row) {
  try {
    await useClientes.desactivateCliente(row._id);
    listarClientes();
  } catch (error) {
    console.error("Error al desactivar el clientes:", error);
  }
}

function cerrarDialogo() {
  isDialogOpen.value = false;
}

const filtrados = computed(() => {
  if (filtroDocumento.value === "") {
    return rows.value;
  }
  return rows.value.filter((row) =>
    row.documento.toLowerCase().includes(filtroDocumento.value.toLowerCase())
  );
});

function filtrarClientes() {
}

async function seguimiento(seguimiento) {
  console.log(seguimiento.seguimiento);
}

onMounted(() => {
  listarClientes();
  listarPlanes();
});

   const formatDate = (dateStr) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
      return new Date(dateStr).toLocaleDateString(undefined, options);
    };

 const segui = ref(false);
    const currentClientId = ref(null);
    const seguimientoModalOpen = ref(false);
    const selectedCliente = ref(null);
    const clienteSeleccionado = ref(null);
    const nivelimc = ref(false);
    const mostrarFormulario = ref(false);
    
    const nuevoSeguimiento = ref({
      peso: null,
      brazo: null,
      altura: null,
      edad: null
    });

    const seguimientoColumns = ref([
  { name: "edita", label: "Editar", field: "edita", align: "center" },
      { name: 'peso', label: 'Peso', field: 'peso', align: 'center' },
      { name: 'imc', label: 'IMC', field: 'imc', align: 'center' },
      { name: 'brazo', label: 'Brazo', field: 'brazo', align: 'center' },
      { name: 'altura', label: 'Altura', field: 'altura', align: 'center' },
      { name: 'edad', label: 'Edad', field: 'edad', align: 'center' },
      { name: 'fecha', label: 'Fecha', field: 'fecha', align: 'center' }
    ]);

    const toggleSegui = () => {
      segui.value = !segui.value;
      seguimientoModalOpen.value = false;
    };

    const closeModal = () => {
      seguimientoModalOpen.value = false;
      segui.value = false; 
      mostrarFormulario.value = false;
    };

    const openSeguimientoModal = (cliente) => {
      console.log("Cliente seleccionado:", cliente);
      selectedCliente.value = cliente;
      seguimientoModalOpen.value = true;
      segui.value = true; 
    };

    const toggleFormulario = () => {
      mostrarFormulario.value = !mostrarFormulario.value;
      if (!mostrarFormulario.value) {
        nuevoSeguimiento.value = {
          peso: null,
          brazo: null,
          altura: null,
          edad: null
        };
      }
    };

    const guardarSeguimiento = async () => {
      if (await validarseguii()) {
        const todoz = {
          seguimiento: [...(selectedCliente.value.seguimiento || []), nuevoSeguimiento.value]
        };
        console.log("Datos a enviar:", JSON.stringify(todoz, null, 2));

        try {
          let seguiz = await useClientes.putClienteSeguimiento(selectedCliente.value._id, todoz);
 
          if (seguiz && seguiz.status === 200) {
            mostrarMensajeExito("Seguimiento agregado exitosamente");
            await listarClientes();
            await listarPlanes();
            closeModal();
          }
          //  else {
          //   mostrarMensajeError("No se pudo agregar el seguimiento");
          // }
        } catch (error) {
          console.error("Error al actualizar seguimiento:", error);
          mostrarMensajeError("Error interno del servidor");
        }
      }
    };

const validarseguii = async () => {
  let verificado = true;
  const seguimiento = nuevoSeguimiento.value;

  if (isNaN(seguimiento.peso) || seguimiento.peso <= 0) {
    mostrarMensajeError("El peso debe ser un número válido");
    verificado = false;
  }
  if (isNaN(seguimiento.brazo) || seguimiento.brazo <= 0) {
    mostrarMensajeError("El brazo debe ser un número válido");
    verificado = false;
  }
  if (isNaN(seguimiento.altura) || seguimiento.altura <= 0) {
    mostrarMensajeError("La altura debe ser un número válido");
    verificado = false;
  }
  if (isNaN(seguimiento.edad) || seguimiento.edad <= 0) {
    mostrarMensajeError("La edad debe ser un número válido");
    verificado = false;
  }

  if (verificado) {
    mostrarMensajeExito("El Seguimiento se validó correctamente");
  }

  return verificado;
};
    const mostarimc = () => {
      nivelimc.value = !nivelimc.value;
    };

    const cerrarfoto = () => {
      nivelimc.value = false;
    };


async function buscarClientesporPlan() {

  try {
    const res = await useClientes.listarClientesporPlan(planSeleccionado.value);
    rows.value = res.data.clientes.map(cliente => ({
      ...cliente,
      idPlan: cliente.idPlan, 
    }));
    console.log(res);
    console.log(planSeleccionado.value,"sjdbfkjsdbf")
  } catch (error) {
    console.error("Error al buscar clientes por plan:", error);
    
  }
};


let observacioncliente=ref(null)

const observacionesf = (ob) => {
    console.log(ob,"el hppp onbbbb")
    observacioncliente.value = ob
    }

const getIMCStyle = (imc) => {
  if (imc < 18.5) {
    return { backgroundColor: '#3876d3', label: 'Bajo peso' };
  } else if (imc >= 18.5 && imc < 24.9) {
    return { backgroundColor: '#38db32', label: 'Normal' };
  } else if (imc >= 25 && imc < 29.9) {
    return { backgroundColor: 'orange', label: 'Sobrepeso' };
  } else if (imc >= 30) {
    return { backgroundColor: 'red', label: 'Obesidad' };
  }
  return { backgroundColor: 'white', label: '' };
};

let botoneditar=ref(false)
let infor = ref("");

const editarsegui = (inf) => {
  console.log("Datos antes de editar:", JSON.stringify(inf, null, 2));
  infor.value = inf;
  botoneditar.value = true;
  nuevoSeguimiento.value = { ...inf };
  mostrarFormulario.value = true;
};

const editaseguimiento = async () => {
  if (await validarseguii()) {
    const seguimientoData = {
      peso: parseFloat(nuevoSeguimiento.value.peso),
      brazo: parseFloat(nuevoSeguimiento.value.brazo),
      altura: parseFloat(nuevoSeguimiento.value.altura),
      edad: parseInt(nuevoSeguimiento.value.edad, 10)
    };

    if (isNaN(seguimientoData.peso) || isNaN(seguimientoData.altura) || seguimientoData.peso <= 0 || seguimientoData.altura <= 0) {
      mostrarMensajeError("El peso y la altura deben ser números válidos y mayores que cero.");
      return;
    }

    console.log("Datos de seguimiento para enviar:", JSON.stringify(seguimientoData, null, 2));

    try {
      const response = await useClientes.putEditaSeguimiento(selectedCliente.value._id, infor.value._id, seguimientoData);
      console.log("Respuesta del servidor:", JSON.stringify(response, null, 2));
      mostrarMensajeExito("Seguimiento editado exitosamente");
      await listarClientes();  // Asegúrate de esperar la lista de clientes
      await listarPlanes();    // Asegúrate de esperar la lista de planes
      closeModal();
    } catch (error) {
      console.error("Error al actualizar el seguimiento:", error.response?.data || error.message);
      mostrarMensajeError("No se pudo editar el seguimiento");
    }
  }
};


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
  color: #716a0e;
  font-family: Georgia;
  font-weight: bold;
  text-align: center;
}

.q-table__bottom-row {
  font-size: 1.5rem;
  /* Tamaño de fuente personalizado para la tabla */
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

.listar-ai {
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  margin-left: 20px;
  gap: 10px;
}

.activar {
  align-items: center;
  text-align: center;
  display: flex;
  justify-content: center;
  font-size: 20px;
  border-radius: 10px;
  font-family: "Times New Roman";
  background-color: green;
  color: white;
  padding: 10px 20px;
  border: 1px solid white;
}

.inactivar {
  align-items: center;
  text-align: center;
  display: flex;
  justify-content: center;
  font-size: 20px;
  border-radius: 10px;
  font-family: "Times New Roman";
  background-color: red;
  color: white;
  padding: 10px 20px;
  border: 1px solid white;
}

.todos {
  align-items: center;
  text-align: center;
  display: flex;
  justify-content: center;
  font-size: 20px;
  border-radius: 10px;
  font-family: "Times New Roman";
  background-color: #bd9727;
  color: white;
  padding: 10px 20px;
  border: 1px solid white;
}

.formulario {
  width: 80%; /* Ancho del formulario */
  margin: 40px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  text-align: center; /* Centrar el contenido */;
}

.campo-formulario {
  margin-bottom: 20px;
}

.campo-formulario label {
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
  color: #716a0e;
  font-size: 18px; /* Tamaño de la letra */
  font-family: Arial, sans-serif; /* Fuente */
    font-family: Georgia;

}

.campo-formulario.q-input,
.campo-formulario.q-select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #fff; /* Fondo blanco */
}

.campo-formulario.q-input:focus,
.campo-formulario.q-select:focus {
  border-color: #aaa;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

.q-card-actions {
  padding: 20px;
  background-color: #f9f9f9;
  border-top: 1px solid #ddd;
  text-align: center; /* Centrar los botones */
}

.q-btn {
  margin: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
}

.q-btn[type="submit"] {
  background-color: #4CAF50;
  color: #fff;
}

.q-btn[type="submit"]:hover {
  background-color: #3e8e41;
}

.cancelar{
  background-color: red;
  color: white;
}

.opciones{
  display: flex;
  justify-content: center;
}

.q-btn.flat {
  background-color: #fff;
  color: #333;
  border: 1px solid #ddd;
}

.q-btn.flat:hover {
  background-color: #f9f9f9;
}
.cliente{
  background-color: white;
  color: black;
  border-radius: 10px;
  margin-right: 20px;
  width: auto;
  padding: 10px 20px;
  font-family: "Times New Roman";
  font-size: 18px;
}
.spinner {
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 4px solid #ffffff;
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -10px;
  margin-left: -10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}


.segui-modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  padding: 20px;
  width: 80%;
}

.fotocerrar {
  width:10%;
  height: 10px;
  background-color: rgb(214, 55, 55);
  margin-top: 2%;}

.fotoimc {
  width:90%;
  height:40%
  }

.inputsegui{
  width:30%;
  height:30px;
  margin:5px;
  border: 2px solid rgb(134, 125, 125);
}

.mostrarobservacions{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
   /* background-color: rgba(0, 0, 0, 0.5);  */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.obscerrar{
 display: flex;
justify-content: right;
}
.obserdiv{
  position:relative;
  background-color: rgb(241, 241, 241);
  border-radius: 1vmax;
}
.text-container {
  width: 100%;
  max-width: 500px; 
  padding: 10px;
  white-space: normal; 
  word-break: break-word; 

}

.cerrar_seguimiento{
  background-color: red;
  color: white;
 
}
.agregar_seguimiento{
  background-color: green;
  color: white;
}

.mostrar_seguimiento{
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.nivel_imc{
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;

}
.nivel_imc_bnt{
  background-image: linear-gradient(to bottom, 
  #a89404, /* Dorado claro */
  #dcc93fb6, /* Dorado medio */
  #c6b44e, /* Dorado oscuro */
  #edeecc /* Blanco */);
}

.foto_cliente{
  display: flex;
  justify-content: center;
  /* background-color: red; */
  text-align: center;
  align-content: center;
}
.botones_seguimiento{
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
}
.agregaedita{
  margin-top: 15px;
  background-color: green;
  color: white;
  border-radius: 10px;
  padding: 5px 30px;
  font-size: 20px;
  font-family: 'Times New Roman';
  font-weight: bold;


}
@media (max-width: 700px) {

.busqueda{
  display: flex;
  flex-direction: column;
}
}

</style>