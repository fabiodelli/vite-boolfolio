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
            error: null,
            max_text_length: 150,
            no_text: 'N/A',

        }
    },
    methods: {
        getProjects(url) {
            axios
                .get(url)
                .then(response => {
                    this.projects = response.data.results
                    console.log(this.projects);
                    this.loading = false
                })
                .catch(error => {
                    console.log(error);
                    this.error = error.message
                })
        },
        getImageFromPath(path) {
            console.log(this.base_url + 'img/' + path);
            return this.base_url + 'img/' + path;
        },
        prevPage(path) {
            console.log(path);
            this.getProjects(path);
        },
        nextPage(path) {
            //console.log(path);
            this.getProjects(path);
        },
        truncateText(text) {
            if (text && text.length > this.max_text_length) {
                //console.log(text.slice(0, 30));
                //console.log(text.substring(0, 30));
                return text.slice(0, this.max_text_length) + '...';
            }
            else {
                return this.no_text
            }
            //console.log(text);
            return text
        }

    },
    mounted() {
        const url = this.base_url + this.projects_API
        this.getProjects(url)
    }
}

</script>
<template>
    <div class="container mt-5">
        <h1>Projects</h1>

        <div v-if="loading === false" class="row">
            <div class="col-6  p-2" v-for="project in projects.data">
                <router-link class="text-decoration-none"
                    :to="{ name: 'single-project', params: { 'slug': project.slug } }">

                    <div class="card mb-3 h-100 p-3 ">
                        <div class="row g-0">

                            <div class="col mb-3">
                                <img :src="getImageFromPath(project.cover_image)" class="img-fluid" :alt="project.title">
                            </div>

                        </div>
                    </div>
                </router-link>

            </div>
        </div>
        <nav aria-label="Page navigation" class="py-4 text-center">
            <ul class="pagination">
                <li class="page-item">
                    <button class="page-link" aria-label="Previous" v-if="projects && projects.prev_page_url"
                        @click="prevPage(projects.prev_page_url)">
                        <span aria-hidden="true">&laquo;</span>
                    </button>
                </li>
                <li class="page-item">
                    <button class="page-link" aria-label="Next" v-if="projects && projects.next_page_url"
                        @click="nextPage(projects.next_page_url)">
                        <span aria-hidden="true">&raquo;</span>
                    </button>

                </li>
            </ul>
        </nav>
    </div>
</template>


<style lang="scss" scoped></style>