<script>
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import ParticleBackground from './components/ParticleBackground.vue';

export default {
  components: {
    AppHeader,
    AppFooter,
    ParticleBackground,
  },
  data() {
    return {
      darkMode: false,
    };
  },
  created() {
    // leggo preferenza salvata
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      this.darkMode = saved === 'true';
    }
    this.applyTheme();
  },
  methods: {
    toggleTheme() {
      this.darkMode = !this.darkMode;
      localStorage.setItem('darkMode', this.darkMode);
      this.applyTheme();
    },
    applyTheme() {
      // aggiungo / tolgo la classe sul body
      document.body.classList.toggle('dark-theme', this.darkMode);
    },
  },
};
</script>

<template>
  <div class="bg">
    <ParticleBackground :darkMode="darkMode" />
    <!-- <img src="../public/img/nuvoletta.png" alt="" class="nuvoletta" /> -->

    <!-- HEADER: passo stato + evento per il toggle -->
    <app-header
      class="app-header"
      :dark-mode="darkMode"
      @toggle-theme="toggleTheme"
    />

    <!-- CONTENUTO PRINCIPALE -->
    <main class="main-content">
      <router-view />
    </main>

    <!-- FOOTER -->
    <app-footer class="app-footer" />
  </div>
</template>

<style lang="scss">
@use './styles/general.scss';
</style>
