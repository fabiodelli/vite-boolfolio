<script>
export default {
    name: 'AppHeader'
}
</script>
<template>
    <header>
        <nav class="nav" >
            <router-link class="nav-link active" :to="{ 'name': 'home' }" aria-current="page">Home </router-link>
            <router-link class="nav-link " :to="{ 'name': 'about' }" aria-current="page">About </router-link>
            <router-link class="nav-link " :to="{ 'name': 'contacts' }" aria-current="page">Contacts </router-link>
        </nav>
    </header>
</template>


<style lang="sass" scoped>

</style>