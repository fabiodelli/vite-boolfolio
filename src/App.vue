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
    // FORCE DARK MODE on mobile
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
      this.darkMode = true;
      localStorage.setItem('darkMode', 'true');
    } else {
      // Desktop: use saved preference or default to light
      this.darkMode = false;
      localStorage.setItem('darkMode', 'false');
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

    <!-- SCROLL TO TOP -->
    <AppScrollToTop />
  </div>
</template>

<style lang="scss">
@use './styles/general.scss';
</style>
