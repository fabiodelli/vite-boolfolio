<script>
import axios from 'axios'
import HelloWorld from './components/HelloWorld.vue'

export default {
    components: {
        HelloWorld,
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
    <nav class="nav justify-content-center  ">
        <a class="nav-link active" href="/" aria-current="page">Home </a>
        <a class="nav-link" href="/about">About</a>
        <a class="nav-link" href="/contacts">Contacts</a>
    </nav>
    <router-view></router-view>
</template>

<style lang="scss">
@use './styles/general.scss';
</style>
