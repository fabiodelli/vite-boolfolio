<script>
import AppHeader from './components/AppHeader.vue';
import axios from 'axios';

export default {
    components: {
        AppHeader
    },
}
</script>

<template>
    <div class="bg">
        <app-header></app-header>
        <router-view></router-view>
    </div>
</template>

<style lang="scss">
@use './styles/general.scss';
</style>
