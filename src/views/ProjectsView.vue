<script>
import axios from "axios";
import AppCta from "../components/AppCta.vue";

export default {
  name: "ProjectsView",
  components: {
    AppCta,
  },
  data() {
    return {
      base_url: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000",
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
  <div class="bg-transparent">
    <div class="container-xxl py-5">

      <!-- TITOLO + FILTRI -->
      <div class="text-center mb-4">
        <h1 class="page-title">{{ $t('projects.title') }}</h1>

        <!-- FILTRI COMPATTI (Dropdown) -->
        <div class="d-flex justify-content-center align-items-center flex-wrap gap-3 mb-4">
          
          <!-- Filter by Type -->
          <select v-model="selectedType" class="filter-select">
            <option :value="null">{{ $t('projects.all_types') }}</option>
            <option v-for="type in types" :key="type" :value="type">
              {{ type }}
            </option>
          </select>

          <!-- Filter by Technology -->
          <select v-model="selectedTechnology" class="filter-select">
            <option :value="null">{{ $t('projects.all_techs') }}</option>
            <option v-for="tech in technologies" :key="tech" :value="tech">
              {{ tech }}
            </option>
          </select>

          <!-- Reset Button -->
          <button @click="resetFilters()" class="btn-ghost" style="min-width: auto; padding: 0.5rem 1rem;">
            {{ $t('projects.reset') }}
          </button>

        </div>
      </div>

      <!-- LOADING / ERROR -->
      <div v-if="loading" class="text-muted text-center">
        {{ $t('projects.loading') }}
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
                    {{ ($i18n.locale === 'en' && project.title_en) ? project.title_en : (project.title || 'N/A') }}
                  </h3>

                  <p class="project-excerpt mb-3">
                    {{ truncateText(($i18n.locale === 'en' && project.content_en) ? project.content_en : project.content) }}
                  </p>

                  <div class="mb-3">
                    <!-- TYPE -->
                    <span class="label d-block mb-1">{{ $t('projects.type_label') }}</span>
                    <span class="type-pill">
                      {{ project.type ? project.type.type : 'N/A' }}
                    </span>
                  </div>

                  <!-- TECHNOLOGIES -->
                  <div class="mb-3">
                    <span class="label d-block mb-1">{{ $t('projects.tech_label') }}</span>
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
                          v-if="technology.image"
                          class="d-inline-block"
                          height="26"
                          :src="technology.image.startsWith('http') ? technology.image : base_url + 'storage/' + technology.image"
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
                      {{ $t('projects.view_details') }}
                    </span>
                  </div>
                </div>
              </div>
            </article>
          </router-link>
        </div>

        <!-- Nessun progetto dopo filtri -->
        <div v-if="filteredProjects.length === 0" class="p-3 text-center">
          <p>{{ $t('projects.no_results') }}</p>
        </div>
      </div>
      </div>
      
      <!-- CTA -->
      <AppCta />
    </div>
</template>

<style lang="scss" scoped>
/* bottone ghost (reset) */
.btn-ghost {
  background: var(--tech-cyan);
  border: 1px solid var(--tech-cyan);
  color: #000;
  border-radius: 25px;
  padding: 0.35rem 0.9rem;
  box-shadow: 0 0 10px rgba(56, 189, 248, 0.3);
  text-transform: uppercase;
  font-size: 0.8rem;
  display: inline-block;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-ghost:hover {
  transform: translateY(-2px);
  background: #fff;
  border-color: var(--tech-cyan);
  color: var(--tech-cyan);
  box-shadow: 0 0 20px rgba(56, 189, 248, 0.6);
}
</style>
