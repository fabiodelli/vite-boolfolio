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
};
</script>

<template>
    <header>
        <nav class="nav">
            <router-link class="nav-link filter_button" :to="{ name: 'home' }" exact-active-class="active_link">
                Home
            </router-link>

            <router-link class="nav-link filter_button" :to="{ name: 'projects' }" exact-active-class="active_link">
                Projects
            </router-link>

            <router-link class="nav-link filter_button" :to="{ name: 'contacts' }" exact-active-class="active_link">
                Contacts
            </router-link>
        </nav>

        <button
        class="theme-toggle-btn filter_button"
        @click="$emit('toggle-theme')"
      >
        <i v-if="darkMode" class="fa-solid fa-sun"></i>
        <i v-else class="fa-solid fa-moon"></i>
      </button>
    </header>
</template>
