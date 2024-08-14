<template>
    <q-dialog ref="dialogRef" >
        <q-card class="formulario">
            <q-card-section>
                <div class="text-h6">
                    {{ !form._id ? "Agregar proveedor" : "Editar proveedor" }}
                </div>
            </q-card-section>

            <q-card-section>
                <q-form @submit="handlerOnSubmit">
                    <div class="campo-formulario">
                        <q-input v-model="form.name" label="Nombre" required />
                    </div>
                    <div class="campo-formulario">
                        <q-input v-model="form.NIT" label="NIT" required />
                    </div>
                    <div class="campo-formulario">
                        <q-input 
                            v-model="form.phone" 
                            label="Teléfono" 
                            :rules="[(val) => !Number.isNaN(Number(val)) && val.length === 10 || 'Número de telefono invalido']" 
                            required 
                        />
                    </div>
                    <div>
                        <q-select v-model="selectedItems" label="Items" :options="itemsOptions" emit-value map-options multiple/>
                    </div>
                    <div class="row items-center justify-between q-my-sm">
                        <span>Estado</span>
                        <q-toggle v-model="form.isActive" color="positive"></q-toggle>
                    </div>
                    <div class="opciones">
                        <q-card-actions align="right">
                            <q-btn
                                class="cancelar"
                                flat
                                label="Cancelar"
                                @click="onDialogCancel"
                            />
                            <q-btn type="submit" label="Guardar" color="positive" :loading="loading">
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
</template>
<script setup>
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { ref, defineProps, defineEmits, watch, computed } from 'vue'
import { difference } from 'lodash'
import axios from 'axios'

import { WriteProviderSchema, ProviderSchema } from '../../schemas/providers'
import { useInventarioStore } from '../../stores/Inventario'

const { dialogRef, onDialogCancel, onDialogOK } = useDialogPluginComponent()

const $q = useQuasar()

const inventoryStore = useInventarioStore()

defineEmits([...useDialogPluginComponent.emits])

const props = defineProps({
    provider: {
        type: Object,
        default: () => {}
    }
})

const selectedItems = ref([...(props.provider?.inventoryItems ?? [])])

const deselectedItems = ref([])

const form = ref({
    name: '',
    NIT: '',
    phone: '',
    isActive: true,
    ...props.provider
})

const itemsOptions = computed(() => {
    return inventoryStore.inventario.map((item) => {
        return {
            label: item.descripcion,
            value: item._id
        }
    })
})
 
const updateProvider = async (providerID, data) => {
    await axios.put(`api/providers/${providerID}`, data)

    for (const itemID of selectedItems.value) {

        if (props.provider?.inventoryItems.includes(itemID)) {
            continue;
        }

        const payload = {
            itemId: itemID, 
            providerId: providerID
        }

        await axios.post('api/relationships', payload)
    }

    for (const deselectedItem of deselectedItems.value) {
        const payload = {
            itemId: deselectedItem, 
            providerId: providerID
        }

        await axios.delete('api/relationships', {
            params: payload
        })
    }
}

const handlerOnSubmit = async () => {
    try {
        $q.loading.show()

        const provider = WriteProviderSchema.parse(form.value)

        if (provider._id) {

            await updateProvider(provider._id, provider)
            
            $q.notify({
                message: 'Los datos del proveedor se actualizaron correctamente',
                color: 'positive'
            })

            onDialogOK()

            return
        }

        const r = await axios.post('api/providers', provider)

        const newProvider = ProviderSchema.parse(r.data)

        for (const itemID of selectedItems.value) {

            const payload = {
                itemId: itemID, 
                providerId: newProvider._id
            }

            await axios.post('api/relationships', payload)
        }


        $q.notify({
            message: 'El proveedor se creó correctamente',
            color: 'positive'
        })

    } catch (error) {
        console.error(error);
        $q.notify({
            message: 'Error de escritura',
            color: 'negative'
        })
    } finally {
        $q.loading.hide()
        onDialogOK()
    }
}

watch(selectedItems, (newVal, oldVal) => {
    deselectedItems.value = difference(oldVal, newVal)
}, {
    deep: true,
})

</script>
<style>

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
</style>