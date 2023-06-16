<script>
import axios from 'axios';

export default {
    name: 'home',
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
                    this.projects = response.data.results
                    this.loading = false
                    console.log(this.projects);
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
    <div class="container">
        <h1>Home page</h1>

        <div class="row">
            <div class="col-6  p-2" v-for="project in projects">

                <div class="card mb-3 h-100 p-3 " >
                    <div class="row g-0">
                        <div class="col-md-6">
                            <img :src="getImagePath(project.cover_image)" class="img-fluid rounded-start" alt="{{ project.title }}">
                        </div>
                        <div class="col-md-6">
                            <div class="card-body">
                                <h5 class="card-title">{{ project.title }}</h5>
                                <p class="card-text">{{ project.content }}</p>
                            </div>
                        </div>
                        <strong>Type:{{ project.type }}</strong>
                        
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>


<style lang="scss" scoped></style>