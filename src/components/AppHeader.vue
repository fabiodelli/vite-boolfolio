<script>
import AppLogo from './AppLogo.vue';

export default {
  name: "AppHeader",
  components: {
    AppLogo,
  },

  props: {
    darkMode: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["toggle-theme"],

  data() {
    return {
      mobileOpen: false,
    };
  },

  methods: {
    toggleMenu() {
      this.mobileOpen = !this.mobileOpen;
    },
    closeMenu() {
      this.mobileOpen = false;
    },
  },
};
</script>

<template>
  <header class="header-wrapper">
    <nav class="nav header-nav">

      <!-- LINK DESKTOP -->

      <!-- BRAND opzionale (desktop) -->
      <!-- BRAND (Logo FD) -->
      <div class="brand">
        <AppLogo />
      </div>
      
      <div class="nav-links d-none d-md-flex">
        <router-link
          class="nav-link filter_button"
          :to="{ name: 'home' }"
          exact-active-class="active_link"
        >
          {{ $t('header.home') }}
        </router-link>

        <router-link
          class="nav-link filter_button"
          :to="{ name: 'projects' }"
          exact-active-class="active_link"
        >
          {{ $t('header.projects') }}
        </router-link>

        <router-link
          class="nav-link filter_button"
          :to="{ name: 'contacts' }"
          exact-active-class="active_link"
        >
          {{ $t('header.contacts') }}
        </router-link>
      </div>

      <!-- AZIONI: TEMA + LANG + BURGER -->
      <div class="nav-actions">
        
        <!-- LANGUAGE SWITCHER -->
        <button 
          class="lang-btn filter_button" 
          @click="$i18n.locale = $i18n.locale === 'it' ? 'en' : 'it'"
        >
          {{ $i18n.locale === 'it' ? 'IT' : 'EN' }}
        </button>

        <!-- TOGGLE TEMA -->
        <button
          type="button"
          class="theme-toggle-btn filter_button"
          @click="$emit('toggle-theme')"
        >
          <i v-if="darkMode" class="fa-solid fa-sun"></i>
          <i v-else class="fa-solid fa-moon"></i>
        </button>

        <!-- HAMBURGER SOLO MOBILE -->
        <button
          type="button"
          class="burger-btn d-inline-flex d-md-none filter_button"
          @click="toggleMenu"
        >
          <i
            class="fa-solid"
            :class="mobileOpen ? 'fa-xmark' : 'fa-bars'"
          ></i>
        </button>
      </div>
    </nav>

    <!-- MENU MOBILE A TENDINA -->
    <transition name="slide-down">
      <div
        v-if="mobileOpen"
        class="mobile-menu d-md-none"
      >
        <router-link
          class="mobile-link filter_button"
          :to="{ name: 'home' }"
          exact-active-class="active_link"
          @click="closeMenu"
        >
          {{ $t('header.home') }}
        </router-link>

        <router-link
          class="mobile-link filter_button"
          :to="{ name: 'projects' }"
          exact-active-class="active_link"
          @click="closeMenu"
        >
          {{ $t('header.projects') }}
        </router-link>

        <router-link
          class="mobile-link filter_button"
          :to="{ name: 'contacts' }"
          exact-active-class="active_link"
          @click="closeMenu"
        >
          {{ $t('header.contacts') }}
        </router-link>
      </div>
    </transition>
  </header>
</template>
