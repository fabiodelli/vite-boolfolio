<script>
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import axios from 'axios';

export default {
    components: {
        AppHeader,
        AppFooter
    },
}
</script>

<template>
    <div class="bg">
        <div class="overlay">
            <app-header></app-header>
            <router-view></router-view>
            <app-footer></app-footer>          
        </div>
    </div>
</template>

<style lang="scss">
@use './styles/general.scss';
</style>
