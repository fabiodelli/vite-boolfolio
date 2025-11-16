<script>
import axios from "axios";

export default {
  name: "ProjectsView",
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
    // progetti filtrati per tipo/tecnologia
    filteredProjects() {
      if (!this.projects || !this.projects.data) return [];

      const selType = this.selectedType
        ? String(this.selectedType).trim().toLowerCase()
        : null;
      const selTech = this.selectedTechnology
        ? String(this.selectedTechnology).trim().toLowerCase()
        : null;

      return this.projects.data.filter((project) => {
        // TYPE
        const projectType =
          project.type && project.type.type
            ? String(project.type.type).trim().toLowerCase()
            : null;
        const typeMatch = selType ? projectType === selType : true;

        // TECHNOLOGIES
        const techNames = Array.isArray(project.technologies)
          ? project.technologies
              .map((t) =>
                t.name ? String(t.name).trim().toLowerCase() : null
              )
              .filter(Boolean)
          : [];
        const techMatch = selTech ? techNames.includes(selTech) : true;

        return typeMatch && techMatch;
      });
    },
  },
  methods: {
    getProjects(url) {
      this.loading = true;
      this.error = null;

      axios
        .get(url)
        .then((response) => {
          this.projects = response.data.results;

          // TIPI
          this.types = [
            ...new Set(
              this.projects.data
                .map((p) =>
                  p.type && p.type.type
                    ? String(p.type.type).trim()
                    : null
                )
                .filter(Boolean)
            ),
          ];

          // TECNOLOGIE
          const techs = this.projects.data.flatMap((p) =>
            p.technologies
              ? p.technologies.map((t) =>
                  t.name ? String(t.name).trim() : null
                )
              : []
          );
          this.technologies = [...new Set(techs.filter(Boolean))];
        })
        .catch((error) => {
          console.log(error);
          this.error = error.message || "Errore nel caricamento dei progetti";
        })
        .finally(() => {
          this.loading = false;
        });
    },

    getImageFromPath(path) {
      return this.base_url + "img/" + path;
    },

    truncateText(text) {
      if (text && text.length > this.max_text_length) {
        return text.slice(0, this.max_text_length) + "...";
      } else if (text) {
        return text;
      }
      return this.no_text;
    },

    // FILTRI
    filterByType(type) {
      this.selectedType = this.selectedType === type ? null : type;
    },

    filterByTechnology(tech) {
      this.selectedTechnology =
        this.selectedTechnology === tech ? null : tech;
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
  <div class="bg-white">
    <div class="container-xxl py-5">

      <!-- TITOLO + FILTRI -->
      <div class="text-center mb-4">
        <h1 class="page-title">PROJECTS</h1>

        <!-- RESET -->
        <div class="mb-2">
          <button
            @click="resetFilters()"
            :class="selectedType === null && selectedTechnology === null
              ? 'filter_button_selected'
              : 'filter_button'"
          >
            All projects
          </button>
        </div>

        <!-- FILTRI PER TIPO -->
        <div class="mb-2">
          <button
            v-for="type in types"
            :key="type"
            @click="filterByType(type)"
            :class="selectedType === type ? 'filter_button_selected' : 'filter_button'"
          >
            {{ type }}
          </button>
        </div>

        <!-- FILTRI PER TECNOLOGIA -->
        <div class="mb-3">
          <button
            v-for="tech in technologies"
            :key="tech"
            @click="filterByTechnology(tech)"
            :class="selectedTechnology === tech ? 'filter_button_selected' : 'filter_button'"
          >
            {{ tech }}
          </button>
        </div>
      </div>

      <!-- LOADING / ERROR -->
      <div v-if="loading" class="text-muted text-center">
        Caricamento progetti…
      </div>

      <div v-else-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <!-- ELENCO PROGETTI -->
      <div v-else class="row gy-4">
        <div
          class="col-12"
          v-for="(project, index) in filteredProjects"
          :key="project.id"
        >
          <router-link
            class="text-decoration-none text-reset"
            :to="{ name: 'single-project', params: { slug: project.slug } }"
          >
            <article class="card project-card">
              <div
                class="row g-0 align-items-center"
                :class="index % 2 !== 0 ? 'flex-row-reverse' : ''"
              >
                <!-- IMMAGINE -->
                <div class="col-md-7">
                  <div class="project-image-wrap">
                    <img
                      :src="getImageFromPath(project.cover_image)"
                      class="img-fluid project-image"
                      :alt="project.title"
                    />
                  </div>
                </div>

                <!-- TESTO / META -->
                <div class="col-md-5 d-flex flex-column p-3 p-md-4">
                  <h3 class="project-title">
                    {{ project.title || 'N/A' }}
                  </h3>

                  <p class="project-excerpt mb-3">
                    {{ truncateText(project.content) }}
                  </p>

                  <div class="mb-3">
                    <!-- TYPE -->
                    <span class="label d-block mb-1">Type</span>
                    <span class="type-pill">
                      {{ project.type ? project.type.type : 'N/A' }}
                    </span>
                  </div>

                  <!-- TECHNOLOGIES -->
                  <div class="mb-3">
                    <span class="label d-block mb-1">Technologies</span>
                    <div
                      v-if="project.technologies && project.technologies.length"
                      class="d-flex flex-wrap gap-2 mt-1"
                    >
                      <span
                        v-for="technology in project.technologies"
                        :key="technology.id"
                        class="tech-logo-pill"
                      >
                        <img
                          v-if="technology.logo"
                          class="d-inline-block"
                          height="26"
                          :src="technology.logo"
                          :alt="technology.name"
                        />
                        <span v-else>{{ technology.name }}</span>
                      </span>
                    </div>
                    <span v-else class="text-muted">N/A</span>
                  </div>

                  <!-- CTA -->
                  <div class="mt-auto">
                    <span class="btn-ghost small-cta">
                      View details
                    </span>
                  </div>
                </div>
              </div>
            </article>
          </router-link>
        </div>

        <!-- Nessun progetto dopo filtri -->
        <div v-if="filteredProjects.length === 0" class="p-3 text-center">
          <p>Nessun progetto corrisponde ai filtri selezionati.</p>
        </div>
      </div>
    </div>
  </div>
</template>


