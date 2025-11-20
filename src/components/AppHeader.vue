<script>
export default {
  name: "AppHeader",

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
      <div class="brand d-none d-md-block">
        FABIO
      </div>
      
      <div class="nav-links d-none d-md-flex">
        <router-link
          class="nav-link filter_button"
          :to="{ name: 'home' }"
          exact-active-class="active_link"
        >
          Home
        </router-link>

        <router-link
          class="nav-link filter_button"
          :to="{ name: 'projects' }"
          exact-active-class="active_link"
        >
          Projects
        </router-link>

        <router-link
          class="nav-link filter_button"
          :to="{ name: 'contacts' }"
          exact-active-class="active_link"
        >
          Contacts
        </router-link>
      </div>

      <!-- AZIONI: TEMA + BURGER -->
      <div class="nav-actions">
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
          Home
        </router-link>

        <router-link
          class="mobile-link filter_button"
          :to="{ name: 'projects' }"
          exact-active-class="active_link"
          @click="closeMenu"
        >
          Projects
        </router-link>

        <router-link
          class="mobile-link filter_button"
          :to="{ name: 'contacts' }"
          exact-active-class="active_link"
          @click="closeMenu"
        >
          Contacts
        </router-link>
      </div>
    </transition>
  </header>
</template>
