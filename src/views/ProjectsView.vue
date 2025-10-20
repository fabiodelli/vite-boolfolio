<script>
import axios from "axios";

export default {
  name: "home",
  data() {
    return {
      base_url: "http://127.0.0.1:8000/",
      projects_API: "api/projects",
      loading: true,
      projects: null,
      error: null,
      max_text_length: 150,
      no_text: "N/A",

      // FILTRI
      selectedType: null,
      selectedTechnology: null,
      types: [],
      technologies: [],
    };
  },
  computed: {
    // ------------------------------------------------
    // computed property che restituisce i progetti filtrati
    // confronto case-insensitive e trim per sicurezza
    // ------------------------------------------------
    filteredProjects() {
      if (!this.projects || !this.projects.data) return [];

      const selType = this.selectedType ? String(this.selectedType).trim().toLowerCase() : null;
      const selTech = this.selectedTechnology ? String(this.selectedTechnology).trim().toLowerCase() : null;

      return this.projects.data.filter((project) => {
        // TYPE: project.type è un oggetto, usiamo project.type.type
        let projectType = project.type && project.type.type ? String(project.type.type).trim().toLowerCase() : null;
        const typeMatch = selType ? projectType === selType : true;

        // TECHNOLOGIES: array di oggetti con name
        const techNames = Array.isArray(project.technologies)
          ? project.technologies.map(t => (t.name ? String(t.name).trim().toLowerCase() : null)).filter(Boolean)
          : [];
        const techMatch = selTech ? techNames.includes(selTech) : true;

        return typeMatch && techMatch;
      });
    }
  },
  methods: {
    getProjects(url) {
      axios
        .get(url)
        .then((response) => {
          this.projects = response.data.results;

          // estrai tipi -> prendi p.type.type
          this.types = [
            ...new Set(
              this.projects.data
                .map((p) => (p.type && p.type.type ? String(p.type.type).trim() : null))
                .filter(Boolean)
            ),
          ];

          // estrai tecnologie -> p.technologies[].name
          const techs = this.projects.data.flatMap((p) =>
            p.technologies ? p.technologies.map((t) => (t.name ? String(t.name).trim() : null)) : []
          );
          this.technologies = [...new Set(techs.filter(Boolean))];

          this.loading = false;
        })
        .catch((error) => {
          console.log(error);
          this.error = error.message;
        });
    },

    getImageFromPath(path) {
      return this.base_url + "img/" + path;
    },

    truncateText(text) {
      if (text && text.length > this.max_text_length) {
        return text.slice(0, this.max_text_length) + "...";
      } else {
        return this.no_text;
      }
    },

    // FILTRI
    filterByType(type) {
      this.selectedType = this.selectedType === type ? null : type;
    },

    filterByTechnology(tech) {
      this.selectedTechnology = this.selectedTechnology === tech ? null : tech;
    },

    resetFilters() {
      this.selectedType = null;
      this.selectedTechnology = null;
    },
  },

  mounted() {
    const url = this.base_url + this.projects_API;
    this.getProjects(url);
  },
};
</script>

<template>
  <div class="p-5">
    <div class=" text-center">
      <h1>PROJECTS</h1>

      <!-- RESET -->
      <div class="mb-2">
        <button @click="resetFilters()" :class="selectedType === null ? 'filter_button_selected' : 'filter_button'">
          ALL PROJECTS
        </button>
      </div>

      <!-- FILTRI PER TIPO -->
      <div class="mb-3">

        <button v-for="type in types" :key="type" @click="filterByType(type)" :class="[

          selectedType === type ? 'filter_button_selected' : 'filter_button',

        ]">
          {{ type }}
        </button>
      </div>

      <!-- FILTRI PER TECNOLOGIA -->
      <div class="mb-3">

        <button v-for="tech in technologies" :key="tech" @click="filterByTechnology(tech)" :class="[

          selectedTechnology === tech ? 'filter_button_selected' : 'filter_button',

        ]">
          {{ tech }}
        </button>
      </div>
    </div>

    <!-- ELENCO PROGETTI (USO filteredProjects) -->
    <div v-if="loading === false" class="row">
      <div class="p-2" v-for="(project, index) in filteredProjects" :key="project.id">
        <router-link class="text-decoration-none" :to="{ name: 'single-project', params: { slug: project.slug } }">
          <div class="card h-100">
            <div class="row g-0 align-items-center ">
              <!-- Immagine a sinistra (indici pari) -->
              <div v-if="index % 2 === 0" class="row g-0 align-items-center">
                <div class="col-md-7">
                  <img :src="getImageFromPath(project.cover_image)" class="img-fluid progect_img"
                    :alt="project.title" />
                </div>
                <div class="col-md-5 d-flex flex-column p-3">
                <h3>{{ project.title || "N/A" }}</h3>
                  <p class="">
                    {{ project.content || "N/A" }}
                  </p>
                  <div class="">

                    <span class="btn bg-dark text-white rounded-5 text-uppercase">
                      {{ project.type ? project.type.type : "N/A" }}
                    </span>

                    <br /><br />


                    <span class="d-inline-flex flex-wrap gap-3 m-2" v-if="project.technologies">
                      <span v-for="technology in project.technologies" :key="technology.id" class="d-inline">
                        <img class="d-inline" height="35" :src="technology.logo" :alt="technology.name" />
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Immagine a destra (indici dispari) -->
              <div v-else class="row g-0 align-items-center flex-row-reverse">
                <div class="col-md-7">
                  <img :src="getImageFromPath(project.cover_image)" class="img-fluid progect_img"
                    :alt="project.title" />
                </div>
                <div class="col-md-5 d-flex flex-column p-3">
                <h3>{{ project.title || "N/A" }}</h3>
                  <p class="m">
                    {{ project.content || "N/A" }}
                  </p>
                  <div class="">
                    
                    <span class="btn bg-dark text-white rounded-5 text-uppercase">
                      {{ project.type ? project.type.type : "N/A" }}
                    </span>

                    <br /><br />

                    
                    <span class="d-inline-flex flex-wrap gap-3 m-2" v-if="project.technologies">
                      <span v-for="technology in project.technologies" :key="technology.id" class="d-inline">
                        <img class="d-inline" height="35" :src="technology.logo" :alt="technology.name" />
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </router-link>
      </div>

      <!-- Messaggio se nessun progetto dopo il filtro -->
      <div v-if="filteredProjects.length === 0" class="p-3">
        <p>Nessun progetto corrisponde ai filtri selezionati.</p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
