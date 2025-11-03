<script>
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import axios from 'axios';

export default {
    components: {
        AppHeader,
        AppFooter
    },
}
</script>

<template>
  <div class="bg">
    <img src="../public/img/nuvoletta.png" alt="" class="nuvoletta" />

    <!-- HEADER SEMPRE SOPRA -->
    <app-header class="app-header" />

    <!-- CONTENUTO PRINCIPALE -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- FOOTER SEMPRE IN FONDO -->
    <app-footer class="app-footer" />
  </div>
</template>

   

<style lang="scss">
@use './styles/general.scss';
</style>
