<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
        GYMNASIO
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      overlay
      behavior="mobile"
      bordered
    >
      <div class="drawer-menu">
        <router-link to="/" class="drawer-link">Login</router-link>
        <router-link to="/Usuarios" class="drawer-link">Usuarios</router-link>
        <router-link to="/Clientes" class="drawer-link">Clientes</router-link>
        <router-link to="/Sedes" class="drawer-link">Sedes</router-link>
        <router-link to="/Planes" class="drawer-link">Planes</router-link>
        <router-link to="/Inventario" class="drawer-link">Inventario</router-link>
        <router-link to="/Maquinas" class="drawer-link">Maquinas</router-link>
        <router-link to="/Mantenimiento" class="drawer-link">Mantenimientos</router-link>
        <router-link to="/Ingresos" class="drawer-link">Ingresos</router-link>
        <router-link to="/Pagos" class="drawer-link">Pagos</router-link>
        <router-link to="/Ventas" class="drawer-link">Ventas</router-link>
      </div>
    </q-drawer>
    <q-page-container>
      <router-view></router-view>
    </q-page-container>
    <q-footer elevated class="bg-grey-8 text-white">
      <q-toolbar>
        <q-toolbar-title>
          <div>© Copyright 2024 - Todos los derechos reservados.</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const leftDrawerOpen = ref(false);

    return {
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
};
</script>

<style scoped>
.drawer-menu {
  padding: 20px;
  background-color: yellow;
  height: 100vh;
}

.drawer-link {
  display: block;
  color: #333;
  font-size: 25px;
  margin-bottom: 10px;
}

.drawer-link:hover {
  color: #007bff;

}

</style>
