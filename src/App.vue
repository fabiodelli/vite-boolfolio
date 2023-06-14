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
        getImagePath(path){
           return this.base_url + 'storage/' + path;
        }
    },
    mounted() {
        const url = this.base_url + this.projects_API
        this.getProjects(url)
    }
}
</script>

<template>
    <div class="p-5 mb-4 bg-light rounded-3">
        <div class="container-fluid py-5">
            <h1 class="display-5 fw-bold">My projects</h1>
            <p class="col-md-8 fs-4">Using a series of utilities, you can create this jumbotron, just like the one in
                previous versions of Bootstrap. Check out the examples below for how you can remix and restyle it to your
                liking.</p>
        </div>
    </div>
    <section class="projects">
        <div class="container">
            <div class="row">
                <div class="col" v-for="project in projects">
                    <div class="card">
                        <img :src="getImagePath(project.cover_image)" alt="{{ project.title }}" class="card-img-top">
                        <div class="card-body">
                            <h3>{{ project.title }}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<style lang="scss">
@use './styles/general.scss';
</style>
