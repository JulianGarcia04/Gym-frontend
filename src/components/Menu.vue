<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" color="white" style="font-size: 25px;" @click="toggleLeftDrawer" />

        <q-toolbar-title class="title" style="font-size: 55px; font-family: 'Times New Roman'; font-weight: bold; text-align: center;">
          TitanFit Gym
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
        <router-link to="/Home" class="drawer-link">🏠<span class="icon">Home</span></router-link>
        <router-link to="/Usuarios" class="drawer-link">👤<span class="icon">Usuarios</span></router-link>
        <router-link to="/Clientes" class="drawer-link">👥<span class="icon">Clientes</span></router-link>
        <router-link to="/Sedes" class="drawer-link">🏢<span class="icon">Sedes</span></router-link>
        <router-link to="/Planes" class="drawer-link">📝<span class="icon">Planes</span></router-link>
        <router-link to="/Inventario" class="drawer-link">📦<span class="icon">Inventario</span></router-link>
        <router-link to="/Maquinas" class="drawer-link">⚙️<span class="icon">Máquinas</span></router-link>
        <router-link to="/Mantenimiento" class="drawer-link">🔧<span class="icon">Mantenimientos</span></router-link>
        <router-link to="/Ingresos" class="drawer-link">💰<span class="icon">Ingresos</span></router-link>
        <router-link to="/Pagos" class="drawer-link">💳<span class="icon">Pagos</span></router-link>
        <router-link to="/Ventas" class="drawer-link">🛒<span class="icon">Ventas</span></router-link>
      </div>
    </q-drawer>
    <q-page-container>
      <router-view></router-view>
    </q-page-container>
    <q-footer style="background-color: #BD9727; color: white; text-align: center; font-family: 'Times New Roman';">
      <q-toolbar>
        <q-toolbar-title>
          <div>© Derechos de autor 2024 - Todos los derechos reservados.</div>
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
  padding: 20px 0;
  background-color: #977233;
  height: auto;
  display: flex;
  flex-direction: column;

}

.drawer-link {
  display: flex;
  align-items: center;
  color: white;
  font-size: 48px;
  margin-bottom: 5px;
  text-decoration: none;
  color: black;
}

.icon {
  margin-left: 10px;
  font-size: 30px;
  font-family: 'Times New Roman';
}

.drawer-link:hover {
  color: #eee;
}

.title {
  font-size: 32px;
  font-weight: bold;
}

q-toolbar-title {
  background-color: goldenrod;
}
</style>
