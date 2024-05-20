import {defineStore} from "pinia"
import axios from "axios"
import {ref} from "vue"

export const useInventarioStore = defineStore("inventario", ()=>{

    
    const getInventario = async()=>{
        try {
            const res = await axios.get("http://localhost:4000/api/inventario/listar")
            return res
        } catch (error) {
            return error
        }
    }

    return{ getInventario}
})