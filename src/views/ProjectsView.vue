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
  <div class="container mt-5 h-100">
    <h1>Projects</h1>

    <!-- RESET -->
    <div class="mb-2">
      <button class="btn btn-outline-secondary btn-sm" @click="resetFilters()">Reset Filters</button>
    </div>

    <!-- FILTRI PER TIPO -->
    <div class="mb-3">
      <strong>Filter by Type:</strong>
      <button
        v-for="type in types"
        :key="type"
        @click="filterByType(type)"
        :class="[
          'btn',
          selectedType === type ? 'btn-primary' : 'btn-outline-primary',
          'm-1'
        ]"
      >
        {{ type }}
      </button>
    </div>

    <!-- FILTRI PER TECNOLOGIA -->
    <div class="mb-3">
      <strong>Filter by Technology:</strong>
      <button
        v-for="tech in technologies"
        :key="tech"
        @click="filterByTechnology(tech)"
        :class="[
          'btn',
          selectedTechnology === tech ? 'btn-success' : 'btn-outline-success',
          'm-1'
        ]"
      >
        {{ tech }}
      </button>
    </div>

    <!-- ELENCO PROGETTI (USO filteredProjects) -->
    <div v-if="loading === false" class="row">
      <div
        class="p-2"
        v-for="(project, index) in filteredProjects"
        :key="project.id"
      >
        <router-link
          class="text-decoration-none"
          :to="{ name: 'single-project', params: { slug: project.slug } }"
        >
          <div class="card h-100">
            <div class="row g-0 align-items-center">
              <!-- Immagine a sinistra (indici pari) -->
              <div v-if="index % 2 === 0" class="row g-0 align-items-center">
                <div class="col-md-6 text-center">
                  <img
                    :src="getImageFromPath(project.cover_image)"
                    class="img-fluid rounded"
                    :alt="project.title"
                  />
                </div>
                <div class="col-md-6 d-flex flex-column align-items-center">
                  <p class="m-3" style="word-wrap: break-word; max-width: 100%">
                    {{ project.content || "N/A" }}
                  </p>
                  <div>
                    <strong class="d-inline mt-5">Type:</strong>
                    <span
                      class="bg-primary rounded-5 p-1 ps-2 pe-2 ms-2 text-white"
                    >
                      {{ project.type ? project.type.type : "N/A" }}
                    </span>

                    <br /><br />

                    <strong class="d-inline mt-5">Technology:</strong>
                    <span
                      class="d-inline-flex flex-wrap gap-3 m-2"
                      v-if="project.technologies"
                    >
                      <span
                        v-for="technology in project.technologies"
                        :key="technology.id"
                        class="d-inline"
                      >
                        <img
                          class="d-inline"
                          height="40"
                          :src="technology.logo"
                          :alt="technology.name"
                        />
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <!-- Immagine a destra (indici dispari) -->
              <div v-else class="row g-0 align-items-center flex-row-reverse">
                <div class="col-md-6 text-center">
                  <img
                    :src="getImageFromPath(project.cover_image)"
                    class="img-fluid rounded"
                    :alt="project.title"
                  />
                </div>
                <div class="col-md-6 d-flex flex-column align-items-center">
                  <p class="m-3" style="word-wrap: break-word; max-width: 100%">
                    {{ project.content || "N/A" }}
                  </p>
                  <div>
                    <strong class="d-inline mt-5">Type:</strong>
                    <span
                      class="bg-primary rounded-5 p-1 ps-2 pe-2 ms-2 text-white"
                    >
                      {{ project.type ? project.type.type : "N/A" }}
                    </span>

                    <br /><br />

                    <strong class="d-inline mt-5">Technology:</strong>
                    <span
                      class="d-inline-flex flex-wrap gap-3 m-2"
                      v-if="project.technologies"
                    >
                      <span
                        v-for="technology in project.technologies"
                        :key="technology.id"
                        class="d-inline"
                      >
                        <img
                          class="d-inline"
                          height="40"
                          :src="technology.logo"
                          :alt="technology.name"
                        />
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
