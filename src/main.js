import { createApp } from 'vue'
import{createPinia} from "pinia"
import piniaPluginPersistedstate from "pinia-plugin-persistedstate"
import './style.css'

import '@quasar/extras/material-icons/material-icons.css'

import 'quasar/src/css/index.sass'

import { Quasar } from 'quasar'
import App from './App.vue'

import{ router} from "./routes/route.js"

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)

app.use(Quasar, {
  plugins: {}, 
})
app.use(router)
app.use(pinia)
app.mount('#app')
