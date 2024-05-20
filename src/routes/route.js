import Login from "../components/login.vue";
import Ingresos from "../components/Ingresos.vue";
import Clientes from "../components/Clientes.vue";
import Inventario from "../components/Inventario.vue";
import Mantenimiento from "../components/Mantenimiento.vue";
import Maquinas from "../components/Maquinas.vue";
import Pagos from "../components/Pagos.vue";
import Planes from "../components/Planes.vue";
import Sedes from "../components/Sedes.vue";
import Usuarios from "../components/Usuarios.vue";
import Ventas from "../components/Ventas.vue";

import { createRouter, createWebHashHistory } from "vue-router";

// Rutas definidas
const routes = [
  { path: "/", component: Login },
  { path: "/Ingresos", component: Ingresos, meta: { requiresAuth: true } },
  { path: "/Clientes", component: Clientes, meta: { requiresAuth: true } },
  { path: "/Inventario", component: Inventario, meta: { requiresAuth: true } },
  { path: "/Mantenimiento", component: Mantenimiento, meta: { requiresAuth: true } },
  { path: "/Maquinas", component: Maquinas, meta: { requiresAuth: true } },
  { path: "/Pagos", component: Pagos, meta: { requiresAuth: true } },
  { path: "/Planes", component: Planes, meta: { requiresAuth: true } },
  { path: "/Sedes", component: Sedes, meta: { requiresAuth: true } },
  { path: "/Usuarios", component: Usuarios, meta: { requiresAuth: true } },
  { path: "/Ventas", component: Ventas, meta: { requiresAuth: true } },
];

export const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

// // Verificación de autenticación
// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requiresAuth)) {
//     const token = localStorage.getItem('token');
//     if (!token) {
//       next({ path: '/' }); // Redirigir al login si no está autenticado
//     } else {
//       next(); // Permitir el acceso si está autenticado
//     }
//   } else {
//     next(); // Permitir el acceso si no requiere autenticación
//   }
// });
