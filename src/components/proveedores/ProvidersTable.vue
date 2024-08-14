<template>
    <q-table :columns="providersColumns" :rows="providers" row-key="NIT" >
      <template v-slot:body-cell-edit="props">
        <q-td :props="props">
          <q-btn @click="openEditDialog(props.row)"> 🖋️ </q-btn>
        </q-td>
      </template>
      <template v-slot:body-cell-delete="props">
        <q-td :props="props">
          <q-btn @click="handlerOnClickDeleteProvider(props.row)" icon="delete"/>
        </q-td>
      </template>
    </q-table>
</template>
<script setup>
import { watchEffect, ref, watch, defineProps, defineEmits, computed } from 'vue';
import { date, useQuasar } from 'quasar'
import axios from 'axios'

import { ProviderSchema } from '../../schemas/providers';

import ProviderHandlerDialog from './ProviderHandlerDialog.vue';

/*
    name: z.string(),
    NIT: z.string(),
    createdDate: z.preprocess(toDate, z.date()),
    phone: z.string().optional(),
    isActive: z.boolean().default(true),
*/

const $q = useQuasar()

const $emit = defineEmits(['updated'])

const props = defineProps({
    itemId: {
      type: String,
    },
    editable: {
      type: Boolean
    },
    delete: {
      type: Boolean
    },
    refresh: {
      type: Boolean
    }
})

const providers = ref([])

const providersColumns = computed(() => {
  const base = [
    {
      name: 'name',
      required: true,
      label: 'Name',
      align: 'left',
      field: row => row.name,
      format: val => `${val}`,
      sortable: true
    },
    {
      name: 'NIT',
      required: true,
      label: 'NIT',
      align: 'left',
      field: row => row.NIT,
      sortable: true
    },
    {
      name: 'createdDate',
      required: true,
      label: 'Created Date',
      align: 'left',
      field: row => row.createdDate,
      format: val => date.formatDate(val, 'YYYY/MM/DD'),
      sortable: true
    },
    {
      name: 'phone',
      required: false,
      label: 'Phone',
      align: 'left',
      field: row => row.phone || 'N/A',
      sortable: true
    },
    {
      name: 'isActive',
      required: true,
      label: 'Active',
      align: 'left',
      field: row => row.isActive,
      format: val => val ? 'Yes' : 'No',
      sortable: true
    }
  ]

  return [
    ...base,
    props.editable ? { name: "edit", label: "Editar", field: "edit", align: "center" } : undefined,
    props.delete ? { name: "delete", label: "Eliminar", field: "delete", align: "center" } : undefined,
  ].filter((column) => {
    return !!column
  })
})

const getProviderByItem = async () => {
  const providersRequest = await axios.get(`api/items/${props.itemId}/providers`)

  if (!Array.isArray(providersRequest.data)) {
      throw new Error('The response from providers must be array')
  }

  providers.value = providersRequest.data
      .filter((val) => {

          const isProvider = ProviderSchema.safeParse(val)

          if (!isProvider.success) {
              console.error('Zod error ', isProvider.error)
              return false
          }

          return isProvider.success
      })
      .map((val) => {
          return ProviderSchema.parse(val)
      })
}

const getAllProviders = async () => {
  try {   
    const providersRequest = await axios.get(`api/providers`)

    if (!Array.isArray(providersRequest.data)) {
        throw new Error('The response from providers must be array')
    }
 
    providers.value = providersRequest.data
      .filter((val) => {
          const isProvider = ProviderSchema.safeParse(val)

          if (!isProvider.success) {
              console.error('Zod error ', isProvider.error)
              return false
          }

          return isProvider.success
      })
      .map((val) => {
          return ProviderSchema.parse(val)
      })

  } catch (error) {
    console.error(error)
  }
}

const openEditDialog = (provider) => {
  $q.dialog({
    component: ProviderHandlerDialog,
    componentProps: {
      provider
    }
  })
  .onOk(() => {
    getAllProviders()
  })
}

const handlerOnClickDeleteProvider = (provider) => {
  $q.dialog({
    message: 'Seguro quieres eliminar este proveedor?',
    cancel: 'Cancelar',
    ok: 'Eliminar'
  })
  .onOk(async () => {
    try {
      $q.loading.show()
      
      const { inventoryItems, _id } = provider
  
      for (const inventoryItem of inventoryItems) {
        const payload = {
            itemId: inventoryItem, 
            providerId: _id
        }
  
        await axios.delete('api/relationships', {
            params: payload
        })
        .catch(() => {
          console.error(error)

          $q.notify({
            message: 'El proceso de desvicular el proveedor con los items del inventario falló',
            color: 'negative'
          })
        })
      }
  
      await axios.delete(`api/providers/${_id}`)

      await getAllProviders()

    } catch (error) {
      console.error(error)

      $q.notify({
        message: 'No se pudo eliminar el proveedor',
        color: 'negative'
      })
    } finally {
      $q.loading.hide()
    }
  })
}

watchEffect(async () => {
  if (props.itemId) {
    await getProviderByItem();
    return
  }

  await getAllProviders()
})

watch(() => props.refresh, async (newRefresh) => {
  if (!newRefresh) {
    return
  }

  await getAllProviders()

  $emit('updated')
})

</script>