<script>
export default {
    name: 'AppHeader'
}
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
    </header>
</template>
