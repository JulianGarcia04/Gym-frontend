import { createApp } from 'vue'
import {createPinia} from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import { Quasar, Notify} from 'quasar'
import router from "./routes/route.js"
// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
// Import Quasar css
import 'quasar/src/css/index.sass'
import axios from "axios";
import Swal from 'sweetalert2';
import VueApexCharts from "vue3-apexcharts";

import { useIntervalStore } from './stores/interval.js';

axios.defaults.baseURL = "http://localhost:4000/";
// axios.defaults.baseURL = "https://proyectogym-i9i3.onrender.com/";


let requestsPending = 0;

// axios.interceptors.request.use((request) => {
//   if (request.url !== "api/interval/listar") {
//     requestsPending++;
//     if (requestsPending == 1) {
//       Swal.fire({
//         // title: 'Espere, por que si recarga, se peta esta weva...',
//         didOpen: () => {
//           Swal.showLoading();
//         },
//         allowOutsideClick: false,
//         allowEscapekey: false,
//         allowEnterkey: false,
//       });
//     }
//   }
//   return request;
// });

axios.interceptors.response.use(
  function (response) {
    if (response.config.url !== "api/interval/listar") {
      requestsPending--;
      if (requestsPending == 0) {
        Swal.close();
      }
    }
    return response;
  },
  function (error) {
    if (error.config.url !== "api/interval/listar") {
      requestsPending--;
      if (requestsPending == 0) {
        Swal.close();
      }
    }

    if (error.response.status == 401) {
      router.push('/');
    }

    return Promise.reject(error);
  }
);

const pinia = createPinia();
pinia.use(piniaPluginPersistedstate);

const myApp = createApp(App);

myApp.use(Quasar, {
  plugins: { Notify },
  config: {
    notify: {
      position: 'top',
      timeout: 2500,
      textColor: 'white',
      actions: [{ icon: 'close', color: 'white' }],
      color: "red"
    },
  },
});

myApp.use(VueApexCharts)

myApp.use(router);
myApp.use(pinia);
myApp.mount('#app');

const intervalStore = useIntervalStore();
intervalStore.startInterval();
