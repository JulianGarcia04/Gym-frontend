<!-- <template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" color="white" style="font-size: 25px;" @click="toggleLeftDrawer" />
        <q-toolbar-title class="title" style="font-size: 55px; font-family: 'Times New Roman'; font-weight: bold; text-align: center;">
          TitanFit Gym
        </q-toolbar-title>
        <div class="q-ml-auto">
          <div class="logout-icon" @click="logout">
            <i class="fa fa-sign-out" aria-hidden="true"></i>
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" overlay behavior="mobile" bordered>
      <div class="drawer-menu">
        <router-link v-for="link in filteredLinks" :key="link.to" :to="link.to" class="drawer-link">
          <span class="icon">{{ link.icon }}</span>{{ link.label }}
        </router-link>
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

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUsuariosStore } from '../stores/Usuarios';

const leftDrawerOpen = ref(false);
const router = useRouter();
const { role } = useUsuariosStore();

const links = [
  { to: '/', label: 'Cerrar sesión', icon: '🏠', roles: ['Administrador', 'Recepcionista', 'Entrenador'] },
  { to: '/Home', label: 'Home', icon: '🏠', roles: ['Administrador', 'Recepcionista', 'Entrenador'] },
  { to: '/Usuarios', label: 'Usuarios', icon: '👤', roles: ['Administrador'] },
  { to: '/Clientes', label: 'Clientes', icon: '👥', roles: ['Administrador', 'Recepcionista', 'Entrenador'] },
  { to: '/Sedes', label: 'Sedes', icon: '🏢', roles: ['Administrador'] },
  { to: '/Planes', label: 'Planes', icon: '📝', roles: ['Administrador'] },
  { to: '/Inventario', label: 'Inventario', icon: '📦', roles: ['Administrador'] },
  { to: '/Maquinas', label: 'Máquinas', icon: '⚙️', roles: ['Administrador'] },
  { to: '/Mantenimiento', label: 'Mantenimientos', icon: '🔧', roles: ['Administrador', 'Recepcionista'] },
  { to: '/Ingresos', label: 'Ingresos', icon: '💰', roles: ['Administrador'] },
  { to: '/Pagos', label: 'Pagos', icon: '💳', roles: ['Administrador', 'Recepcionista'] },
  { to: '/Ventas', label: 'Ventas', icon: '🛒', roles: ['Administrador', 'Recepcionista'] }
];

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const hasRole = (roles) => roles.includes(role);

const filteredLinks = computed(() => links.filter(link => hasRole(link.roles)));

const logout = () => {
  localStorage.removeItem('token');
  router.push('/');
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
  font-size: 30px;  /* Reduce el tamaño del texto */
  margin-bottom: 5px;
  text-decoration: none;
  padding: 10px 20px;  /* Añade un poco de padding */
}

.icon {
  margin-right: 10px;  /* Ajusta la distancia entre el icono y el texto */
  font-size: 40px;
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

.logout-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 40px; /* Tamaño del icono */
  height: 100%; /* Ajuste de altura para centrar verticalmente */
}
</style> -->



<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" class="iconos" color="white" @click="toggleLeftDrawer" />
        <q-toolbar-title class="title" style=" font-family: 'Times New Roman'; font-weight: bold; text-align: center;">
          TitanFit Gym
        </q-toolbar-title>
        <div class="q-ml-auto">
          <div class="logout-icon" @click="logout">
            <i class="fas fa-door-open" aria-hidden="true"></i>
          </div>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" overlay behavior="mobile" bordered :width="300">
      <div class="drawer-menu">
        <router-link v-for="link in filteredLinks" :key="link.to" :to="link.to" class="drawer-link">
          <span class="icon">{{ link.icon }}</span>{{ link.label }}
        </router-link>
        <!-- <div class="drawer-link logout-link" @click="logout">
          <span class="iconos"><i class="fas fa-door-open" aria-hidden="true"></i></span> Cerrar sesión
        </div> -->
      </div>
    </q-drawer>

    <q-page-container>
      <router-view></router-view>
    </q-page-container>

    <q-footer style="background-color: #BD9727; color: white; text-align: center; font-family: 'Times New Roman';">
      <q-toolbar>
        <q-toolbar-title>
          <div class="piepagina">© Derechos de autor 2024 - Todos los derechos reservados.</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUsuariosStore } from '../stores/Usuarios';

const leftDrawerOpen = ref(false);
const router = useRouter();
const { role } = useUsuariosStore();
const useUsuarios = useUsuariosStore();

const links = [
  { to: '/Home', label: 'Home', icon: '🏠', roles: ['Administrador', 'Recepcionista', 'Instructor'] },
  { to: '/Usuarios', label: 'Usuarios', icon: '👤', roles: ['Administrador'] },
  { to: '/Clientes', label: 'Clientes', icon: '👥', roles: ['Administrador', 'Recepcionista', 'Instructor'] },
  { to: '/Sedes', label: 'Sedes', icon: '🏢', roles: ['Administrador'] },
  { to: '/Planes', label: 'Planes', icon: '📝', roles: ['Administrador'] },
  { to: '/Inventario', label: 'Inventario', icon: '📦', roles: ['Administrador'] },
  { to: '/Maquinas', label: 'Máquinas', icon: '⚙️', roles: ['Administrador'] },
  { to: '/Mantenimiento', label: 'Mantenimientos', icon: '🔧', roles: ['Administrador', 'Recepcionista'] },
  { to: '/Ingresos', label: 'Ingresos', icon: '💰', roles: ['Administrador'] },
  { to: '/Pagos', label: 'Pagos', icon: '💳', roles: ['Administrador', 'Recepcionista'] },
  { to: '/Ventas', label: 'Ventas', icon: '🛒', roles: ['Administrador', 'Recepcionista'] }
];

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const hasRole = (roles) => roles.includes(role);

const filteredLinks = computed(() => links.filter(link => hasRole(link.roles)));

const logout = () => {
 useUsuarios.logout()
 console.log("cerrando");
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
  font-size: 30px;  /* Reduce el tamaño del texto */
  margin-bottom: 5px;
  text-decoration: none;
  padding: 10px 20px;  
  cursor: pointer;
}

.icon {
  margin-right: 10px; 
  font-size: 40px;
  font-family: 'Times New Roman';
}

.drawer-link:hover {
  color: #eee;
}

.logout-link {
  color: white;
  font-size: 25px;
}

.title {
  font-size: 55px;
  font-weight: bold;
}

q-toolbar-title {
  background-color: goldenrod;
}
.iconos{
  font-size: 25px;
}
.logout-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 30px; 
  height: 100%; 
}
@media (max-width: 540px) {
.title{
  font-size: 30px;
}
.piepagina{
  font-size: 11px;
}
}
@media (max-width: 340px) {
.title{
  font-size: 15px;
}
.piepagina{
  font-size: 7px;
}
}
</style>
