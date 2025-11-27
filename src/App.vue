<script>
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import ParticleBackground from './components/ParticleBackground.vue';
import AppScrollToTop from './components/AppScrollToTop.vue';

export default {
  components: {
    AppHeader,
    AppFooter,
    ParticleBackground,
    AppScrollToTop,
  },
  data() {
    return {
      darkMode: false,
    };
  },
  created() {
    // Use saved preference or default to light mode
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      this.darkMode = saved === 'true';
    } else {
      this.darkMode = false;
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
      // aggiungo / tolgo la classe su html (documentElement) per gestire anche l'overscroll
      document.documentElement.classList.toggle('dark-theme', this.darkMode);
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
      <router-view :darkMode="darkMode" />
    </main>

    <!-- FOOTER -->
    <app-footer class="app-footer" />

    <!-- SCROLL TO TOP -->
    <AppScrollToTop />
  </div>
</template>

<style lang="scss">
@use './styles/general.scss';
</style>
