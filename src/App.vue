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
        <router-link class="nav-link active" :to="{'name':'home'}" aria-current="page">Home </router-link>
        <router-link class="nav-link " :to="{'name':'about'}" aria-current="page">About </router-link>
        <router-link class="nav-link " :to="{'name':'contacts'}" aria-current="page">Contacts </router-link>
        
    </nav>
    <router-view></router-view>
</template>

<style lang="scss">
@use './styles/general.scss';
</style>
