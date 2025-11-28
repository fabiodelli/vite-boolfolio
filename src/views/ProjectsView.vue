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
      selectedTechnologies: [], // Changed to array for multi-select
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
      
      // Normalize selected technologies
      const selTechs = this.selectedTechnologies.map(t => String(t).trim().toLowerCase());

      return this.projects.data.filter((project) => {
        // TYPE
        const projectType =
          project.type && project.type.type
            ? String(project.type.type).trim().toLowerCase()
            : null;
        const typeMatch = selType ? projectType === selType : true;

        // TECHNOLOGIES (Multi-select: project must have ALL selected techs? Or ANY? Usually AND for refinement, OR for broad search. Let's do AND for now as it's more common for filtering specific stacks, or OR if user wants to see projects with EITHER Vue OR Laravel. Let's stick to "AND" (must contain all selected) or "OR" (must contain at least one). 
        // User asked for "possibilità di selezionare più tecnologie". Usually this implies "Show me projects that use Vue AND Laravel". 
        // However, if I select "Vue" and "React", I might want to see projects with either. 
        // Let's implement "OR" logic (at least one match) which is often more intuitive for "tag" filtering, OR "AND" if they want to find a specific stack. 
        // Let's go with "AND" (must have all selected) because it narrows down results. Wait, if I select Vue and Laravel, I want projects that use BOTH.
        // Actually, let's do "AND" logic: Project must contain ALL selected technologies.
        
        const projectTechs = Array.isArray(project.technologies)
          ? project.technologies
              .map((t) =>
                t.name ? String(t.name).trim().toLowerCase() : null
              )
              .filter(Boolean)
          : [];
        
        // Check if project has ALL selected technologies
        const techMatch = selTechs.length === 0 || selTechs.every(sel => projectTechs.includes(sel));

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

    // Removed single filterByTechnology

    resetTechFilter() {
      this.selectedTechnologies = [];
    },

    resetFilters() {
      this.selectedType = null;
      this.selectedTechnologies = [];
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
        <div class="row g-3 justify-content-center mb-4">
          
          <!-- Filter by Type -->
          <div class="col-12 col-md-4 col-lg-3">
            <select v-model="selectedType" class="filter-select w-100">
              <option :value="null">{{ $t('projects.all_types') }}</option>
              <option v-for="type in types" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
          </div>

          <!-- Filter by Technology (Multi-select simulation) -->
          <div class="col-12 col-md-4 col-lg-3">
            <div class="dropdown w-100">
              <button class="filter-select w-100 text-start d-flex justify-content-between align-items-center" type="button" id="techDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                <span class="text-truncate">
                  {{ selectedTechnologies.length ? selectedTechnologies.join(', ') : $t('projects.all_techs') }}
                </span>
                <i class="fa-solid fa-chevron-down ms-2"></i>
              </button>
              <ul class="dropdown-menu w-100 p-2" aria-labelledby="techDropdown" style="max-height: 300px; overflow-y: auto;">
                <li>
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" id="all-techs" :checked="selectedTechnologies.length === 0" @change="resetTechFilter">
                    <label class="form-check-label w-100 stretched-link" for="all-techs">
                      {{ $t('projects.all_techs') }}
                    </label>
                  </div>
                </li>
                <li><hr class="dropdown-divider"></li>
                <li v-for="tech in technologies" :key="tech">
                  <div class="form-check">
                    <input class="form-check-input" type="checkbox" :value="tech" :id="'tech-'+tech" v-model="selectedTechnologies">
                    <label class="form-check-label w-100 stretched-link" :for="'tech-'+tech">
                      {{ tech }}
                    </label>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <!-- Reset Button -->
          <div class="col-12 col-md-auto d-flex align-items-center">
             <button @click="resetFilters()" class="btn-ghost w-100" style="padding: 0.5rem 1rem;">
              {{ $t('projects.reset') }}
            </button>
          </div>

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
