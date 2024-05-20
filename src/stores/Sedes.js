import {defineStore} from "pinia"
import axios from "axios"
import {ref} from "vue"

export const useSedesStore = defineStore("sedes", ()=>{

    
    const getSedes = async()=>{
        try {
            const res = await axios.get("http://localhost:4000/api/sedes/listar")
            return res
        } catch (error) {
            return error
        }
    }

    return{ getSedes}
})