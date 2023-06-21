<script>
import axios from 'axios';
export default {
  name: 'SingleProjectView',
  components: {
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
      return this.base_url + 'img/' + path;
    },
  },
  mounted() {

    const url = this.base_url + 'api/projects/' + this.$route.params.slug;
    console.log(this.$route.params.slug);
    axios
      .get(url)
      .then(response => {

        if (response.data.success) {
          this.project = response.data.result
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

    <h1>
      {{ project && project.title ? project.title : N / A }}
    </h1>

    <div class="row">

      <div class="col-6">
        <div v-if="project && project.cover_image">
          <img class="img-fluid" :src="getImageFromPath(project.cover_image)" alt="">
        </div>
        <P v-else>N/A</P>
      </div>

      <div class="col-6">
        
        <strong>Content:</strong>

        <p>{{ project && project.content ? project.content : N / A }}</p>

        <div>
          <strong>Type:</strong>

          <div v-if="project && project.type" class="bg-primary rounded-5 p-1 ps-2 pe-2 text-white">

            {{ project.type.type }}

          </div>

          <span v-else>N/A</span>

          <br>

          <strong>Technology: </strong>

          <span class="d-flex gap-3 m-2" v-if="project && project.technologies">

            <div v-for="technology in project.technologies">
              <img height="70" :src="technology.logo" alt="">
            </div>

          </span>

          <span v-else>N/A</span>

        </div>

      </div>

    </div>

  </div>
</template>
