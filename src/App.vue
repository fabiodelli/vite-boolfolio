<script>
import Jumbo from './components/Jumbo.vue';
import AppHeader from './components/AppHeader.vue';
import axios from 'axios';

export default {
    components: {
        AppHeader,
        Jumbo
    },
    data() {
        return {
            base_url: 'http://127.0.0.1:8000/',
            projects_API: 'api/projects',
            loading: true,
            projects: null,
            error: null
        }
    },
    methods: {
        getProjects(url) {
            axios
                .get(url)
                .then(response => {
                    console.log(response);
                    this.projects = response.data.name
                    this.loading = false
                })
                .catch(error => {
                    console.log(error);
                    this.error = error.message
                })
        },
        getImagePath(path) {
            return path;
        }
    },
    mounted() {
        const url = this.base_url + this.projects_API
        this.getProjects(url)
    }
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
