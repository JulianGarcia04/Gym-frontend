<template>
    <div class="bodyy">
      <div class="contenedor-padre">
        <div class="contenedor-blanco">
          <div class="imagenes">
            <div class="1"><img src="../imagenes/1.jpg" alt="Imagen 1" /></div>
            <div class="2"><img src="../imagenes/2.jpg" alt="Imagen 2" /></div>
          </div>
        </div>
      </div>
      <div class="introduccion">
        <div class="imagen_i">
          <img src="../imagenes/4.jpg" alt="La imagen no pudo cargar" />
        </div>
        <div class="int">
          <div class="tit_introduccion">
            <h1 class="tit_text">Acerca de Nosotros</h1>
          </div>
          <div class="text">
            <p class="textt">
              En TitanFit Gym, estamos comprometidos a ayudarte a alcanzar tus
              metas de fitness y bienestar. Nuestro gimnasio ofrece una amplia
              gama de instalaciones de vanguardia, programas de entrenamiento
              personalizado y clases dirigidas por instructores expertos para
              ayudarte a alcanzar tus objetivos de salud y estado físico. En
              nuestro gimnasio, creemos en la importancia de un enfoque integral
              para la salud y el bienestar. Ya sea que estés buscando aumentar tu
              fuerza, mejorar tu resistencia cardiovascular, perder peso o
              simplemente mantenerte activo, tenemos todo lo que necesitas para
              tener éxito en tu viaje fitness.
            </p>
          </div>
        </div>
      </div>
      <div class="entrenadores">
        <div class="tit_entrenadores">
          <h1 class="tit_text">Nuestros entrenadores</h1>
        </div>
        <div class="fotos">
          <div class="img"><img src="../imagenes/ent1.jpg" alt="Imagen 1" /></div>
          <div class="img"><img src="../imagenes/ent2.jpg" alt="Imagen 2" /></div>
          <div class="img"><img src="../imagenes/ent3.jpg" alt="Imagen 2" /></div>
          <div class="img"><img src="../imagenes/ent4.jpg" alt="Imagen 2" /></div>
  
        </div>
      </div>
    </div>
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
  .contenedor-padre {
    display: flex;
    height: 100vh;
    flex-direction: row;
    justify-content: center;
  }
  
  .contenedor-blanco {
    background-color: rgb(0, 0, 0);
    display: flex;
    height: auto;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    width: 100%; 
  }
  .imagenes {
    display: grid;
    grid-template-columns: repeat(2, 1Fr);
  }
  .imagenes img {
    height: 700px;
    width: 100%;
  }
  
  .imagen_i img {
    height: 500px;
    border-radius: 10px;
  }
  
  
  .introduccion {
    width: 100%;
    height: auto;
    background-color: rgba(53, 50, 50, 0.849);
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .int {
    width: 100%;
    height: auto;
    background-color: rgba(53, 50, 50, 0.849);
    justify-content: center;
    align-items: center;
    margin-left: 30px;
    margin-right: 30px;
    padding: 40px;
    border-radius: 10px;
  }
  .imagen_i {
    margin-left: 30px;
    margin-top: 30px;
  }
  
  .tit_text {
    color: rgba(175, 149, 83, 0.795);
    font-size: 50px;
    -webkit-text-stroke: 1px rgb(255, 255, 255);
    font-size: 50px;
    display: flex;
    justify-content: center;
    text-align: center;
  }
  
  .textt {
    color: white;
    font-size: 25px;
    text-align: center;
  }
  
  .entrenadores{
    width: 100%;
    height: auto;
    background-color: rgba(22, 21, 21, 0.849);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .fotos{
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    margin-bottom: 40px;
  }
  
  .fotos img {
    max-width: 100%;
    height: 500px;
    border-radius: 10px;
  }
  
  </style>