<script>

import Jumbo from "../components/Jumbo.vue";
import axios from 'axios';
export default {
  name: 'SingleProjectView',
  components: {
    Jumbo
  },
  data() {
    return {
      project: null,
      loading: true,
      base_url: 'http://127.0.0.1:8000/',

    }
  },
  methods: {
    getImageFromPath(path) {
      //console.log(this.base_url + 'storage/' + path);
      return path;
    },
  },
  mounted() {

    const url = this.base_url + 'api/projects/' + this.$route.params.slug;
    console.log(this.$route.params.slug);
    axios
      .get(url)
      .then(response => {
        
        if (response.data.success) {
          this.project = response.data.results
          console.log(this.project);
        } else {
          // redirect to a 404 page
        }
      })
      .catch(error => {
        console.log(error);
      })



  }
}
</script>

<template>
    <div class="container">
      <div class="content">
        <p v-if="project.content">
          {{ project.content }}
        </p>
        <div v-else>N/A</div>
      </div>
      <div>
        <div>
          <strong>Author: </strong>{{ project.title }}
        </div>
        <div>
          <strong>Technology: </strong>
          <span v-if="project.technologies">
            <span v-for="technology in project.technologies">
              <img :src="technology.logo" alt="">
            </span>
          </span>
          <span v-else>
            N/A
          </span>
        </div>
        <div>
          <strong>Tags: </strong>
          <ul v-if="project.type && project.type.lenght > 0">
            <li v-for="tag in project.tags" :key="type.id">
              {{ type.type }}
            </li>
          </ul>
          <span v-else>N/A</span>
        </div>
      </div>
    </div>
</template>
