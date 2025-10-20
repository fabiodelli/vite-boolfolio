<script>
export default {
    name: 'AppHeader'
}
</script>
<template>
    <header>
        <nav class="nav" >
            <router-link class="nav-link active filter_button" :to="{ 'name': 'home' }" aria-current="page">Home </router-link>
            <router-link class="nav-link text-black filter_button" :to="{ 'name': 'projects' }" aria-current="page">Projects </router-link>
            <router-link class="nav-link text-black filter_button" :to="{ 'name': 'about' }" aria-current="page">About </router-link>
            <router-link class="nav-link text-black filter_button" :to="{ 'name': 'contacts' }" aria-current="page">Contacts </router-link>
        </nav>
    </header>
</template>


<style lang="sass" scoped>

</style>