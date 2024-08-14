import { createRouter, createWebHashHistory } from "vue-router";

import { useUsuariosStore } from '../stores/Usuarios';

import Login from "../components/login.vue";
import Ingresos from "../components/Ingresos.vue";
import Clientes from "../components/Clientes.vue";
import Inventario from "../components/Inventario.vue";
import ProvidersPage from "../components/proveedores/IndexPage.vue"
import Mantenimiento from "../components/Mantenimiento.vue";
import Maquinas from "../components/Maquinas.vue";
import Pagos from "../components/Pagos.vue";
import Planes from "../components/Planes.vue";
import Sedes from "../components/Sedes.vue";
import Usuarios from "../components/Usuarios.vue";
import Ventas from "../components/Ventas.vue";
import Home from "../components/Home.vue"
import Menu from "../components/Menu.vue"
import Recuperarpass from "../components/Recuperarpass.vue";



const routes = [
  { path: "/", component: Login },
  { path: "/Recuperarpass", component: Recuperarpass},  {
    path: "/Menu", component: Menu, meta: { requiresAuth: true }, children: [
      { path: "/home", component: Home, meta: { requiresAuth: true } },
      { path: "/ingresos", component: Ingresos, meta: { requiresAuth: true } },
      { path: "/clientes", component: Clientes, meta: { requiresAuth: true } },
      { path: "/inventario", component: Inventario, meta: { requiresAuth: true } },
      { path: "/proveedores", component: ProvidersPage, meta: { requiresAuth: true } },
      { path: "/mantenimiento", component: Mantenimiento, meta: { requiresAuth: true } },
      { path: "/maquinas", component: Maquinas, meta: { requiresAuth: true } },
      { path: "/pagos", component: Pagos, meta: { requiresAuth: true } },
      { path: "/planes", component: Planes, meta: { requiresAuth: true } },
      { path: "/sedes", component: Sedes, meta: { requiresAuth: true } },
      { path: "/usuarios", component: Usuarios, meta: { requiresAuth: true } },
      { path: "/ventas", component: Ventas, meta: { requiresAuth: true } },
    ]
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const useUsuarios=useUsuariosStore()
  const userRole = useUsuarios.role;

  if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    next('/');
  } else {
    next();
  }
});

export default router;

