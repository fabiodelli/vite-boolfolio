<script>
import Jumbo from './components/Jumbo.vue';
import AppHeader from './components/AppHeader.vue';
import axios from 'axios';

export default {
    components: {
        AppHeader,
        Jumbo
    },
}
</script>

<template>

    <app-header></app-header>
    <jumbo></jumbo>  
    <router-view></router-view>

</template>

<style lang="scss">
@use './styles/general.scss';
</style>
