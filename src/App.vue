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
           return  path;
        }
    },
    mounted() {
        const url = this.base_url + this.projects_API
        this.getProjects(url)
    }
}
</script>

<template>
    <div>
    <nav>
      <router-link to="/">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/contacts">Contacts</router-link>
    </nav>
    <router-view></router-view>
  </div>
    <section class="projects">
        <div class="container">
            <div class="row">
                <div class="col" v-for="project in projects">
                    <div class="card h-100">
                        <img class="card-img-top" :src="getImagePath(project.cover_image)" alt="{{ project.title }}" >
                        <div class="card-body">
                            <h3>
                                {{ project.title }}
                            </h3>
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
