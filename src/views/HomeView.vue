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
            max_text_length : 150, 
            no_text:'N/A'       
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
        getImagePath(path) {
            return path;
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
            else{
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
    
</template>


<style lang="scss" scoped></style>