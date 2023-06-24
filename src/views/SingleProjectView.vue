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
      {{ project && project.title ? project.title : N/A }}
    </h1>

    <div class="row">

      <div class="col-9">
        <div v-if="project && project.cover_image">
          <img class="img-fluid" :src="getImageFromPath(project.cover_image)" alt="">
        </div>
        <P v-else>N/A</P>
      </div>

      <div class="col-3">

        <strong>Content:</strong>

        <p style="word-wrap: break-word; max-width: 100%;">{{ project && project.content ? project.content : N/A }}</p>

        <div>
          <strong class="mb-5">Type:</strong>

          <span  class="bg-primary rounded-5 p-1 ps-2 pe-2 ms-2 text-white w-25 ">

            {{project && project.type ? project.type.type : N/A }}

          </span>

          <br><br>

          <strong class="d-inline mt-5">Technology:</strong>

          <span class="d-inline-flex flex-wrap gap-3 m-2" v-if="project && project.technologies">
            
            <span v-for="technology in project.technologies" class="d-inline">             
              <img class="d-inline" height="40" :src="technology.logo" alt="">           
            </span>
          
          </span>

          <span v-else>N/A</span>

        </div>

      </div>

    </div>

  </div>
</template>
