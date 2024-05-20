import {defineStore} from "pinia"
import axios from "axios"
import {ref} from "vue"

export const usePlanesStore = defineStore("planes", ()=>{

    
    const getPlanes = async()=>{
        try {
            const res = await axios.get("http://localhost:4000/api/planes/listar")
            return res
        } catch (error) {
            return error
        }
    }

    return{ getPlanes}
})