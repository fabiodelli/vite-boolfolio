<script>
import axios from 'axios';
import AppCta from '../components/AppCta.vue';

export default {
  name: 'SingleProjectView',
  components: {
    AppCta,
  },
  data() {
    return {
      project: null,
      loading: true,
      error: null,
      base_url: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
    };
  },
  methods: {
    getImageFromPath(path) {
      return this.base_url + 'img/' + path;
    },
    goBack() {
      this.$router.push({ name: 'projects' });
    },
  },
  mounted() {
    const url = this.base_url + 'api/projects/' + this.$route.params.slug;

    axios
      .get(url)
      .then((response) => {
        if (response.data.success) {
          this.project = response.data.result;
        } else {
          this.error = 'Progetto non trovato';
        }
      })
      .catch((err) => {
        this.error = 'Errore nel caricamento del progetto';
      })
      .finally(() => {
        this.loading = false;
      });
  },
};
</script>

<template>
  <div class="bg-transparent">
    <div class="container-xxl py-5 min-vh-100">

      <!-- HEADER / TITLE + BACK -->
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h1 class="page-title mb-0">
          {{ project ? (($i18n.locale === 'en' && project.title_en) ? project.title_en : (project.title || 'N/A')) : 'N/A' }}
        </h1>

        <router-link :to="{ name: 'projects' }" class="btn-ghost">
          &larr; {{ $t('single_project.back') }}
        </router-link>
      </div>

      <!-- LOADING -->
      <div v-if="loading" class="text-muted text-center">
        {{ $t('single_project.loading') }}
      </div>

      <!-- ERROR -->
      <div v-else-if="error" class="alert alert-danger">
        {{ error }}
      </div>

      <!-- CONTENUTO PROGETTO -->
      <div v-else-if="project" class="card project-card p-4">
        <div class="row g-4 align-items-start flex-column flex-lg-row">

          <!-- IMMAGINE GRANDE -->
          <div class="col-lg-7">
            <div class="project-image-wrap">
              <img
                v-if="project.full_image"
                class="img-fluid project-image"
                :src="getImageFromPath(project.full_image)"
                :alt="project.title"
              />
              <div v-else class="project-image placeholder d-flex align-items-center justify-content-center">
                N/A
              </div>
            </div>
          </div>

          <!-- META + TESTO -->
          <div class="col-lg-5 d-flex flex-column gap-3">

            <!-- TYPE + TECHNOLOGIES -->
            <div class="d-flex flex-column gap-2">
              <div>
                <span class="label">{{ $t('single_project.type_label') }}</span>
                <span class="type-pill">
                  {{ project.type ? project.type.type : 'N/A' }}
                </span>
              </div>

              <div>
                <span class="label">{{ $t('single_project.tech_label') }}</span>
                <div v-if="project.technologies && project.technologies.length" class="d-flex flex-wrap gap-2 mt-1">
                  <span
                    v-for="technology in project.technologies"
                    :key="technology.id"
                    class="tech-logo-pill"
                  >
                    <img
                      v-if="technology.image"
                      :src="technology.image.startsWith('http') ? technology.image : base_url + 'storage/' + technology.image"
                      :alt="technology.name"
                      height="26"
                    />
                    <span v-else>{{ technology.name }}</span>
                  </span>
                </div>
                <span v-else class="text-muted">N/A</span>
              </div>
            </div>

            <!-- CONTENT -->
            <div>
              <span class="label">{{ $t('single_project.description_label') }}</span>
              <p class="project-content mt-1">
                {{ ($i18n.locale === 'en' && project.content_en) ? project.content_en : (project.content || 'N/A') }}
              </p>
            </div>

            <!-- LINK GITHUB -->
            <div class="mt-auto">
              <span class="label d-block mb-1">Github</span>
              <a
                v-if="project.git"
                class="btn-solid"
                :href="project.git"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ $t('single_project.github') }}
              </a>
              <span v-else class="text-muted">Non disponibile</span>
            </div>

          </div>
        </div>
      </div>

      <!-- Se per qualche motivo project è null senza error (edge case) -->
      <div v-else class="text-muted">
        {{ $t('single_project.no_data') }}
      </div>

      <!-- CTA -->
      <AppCta />

    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-title {
  font-weight: 800;
  text-transform: uppercase;
  margin-bottom: 1rem;
  color: var(--tech-text-main);
  text-shadow: 0 0 20px rgba(56, 189, 248, 0.4);
}

/* card singolo progetto: Tech Style */
.project-card {
  background: var(--tech-bg-glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--tech-border);
  border-radius: 25px;
  box-shadow: var(--tech-shadow);
  color: var(--tech-text-main);
}

/* wrapper immagine grande */
.project-image-wrap {
  width: 100%;
  overflow: hidden;
}

/* immagine grande in stile Projects */
.project-image {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 25px;
  border: 1px solid var(--tech-border);
  box-shadow: var(--tech-shadow);
  object-fit: cover;
}

/* placeholder se manca l’immagine */
.project-image.placeholder {
  min-height: 220px;
  background: rgba(255, 255, 255, 0.05);
  color: var(--tech-text-muted);
}

/* label piccole */
.label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 700;
  color: var(--tech-text-muted);
}

/* pill del type */
.type-pill {
  display: inline-block;
  margin-left: 0.4rem;
  padding: 0.2rem 0.8rem;
  border-radius: 999px;
  border: 1px solid var(--tech-cyan);
  background: rgba(56, 189, 248, 0.1);
  color: var(--tech-cyan);
  font-size: 0.85rem;
  text-transform: uppercase;
  box-shadow: 0 0 10px rgba(56, 189, 248, 0.2);
}

/* pill per tech con logo */
.tech-logo-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  border: 1px solid var(--tech-cyan);
  background: rgba(56, 189, 248, 0.1);
  min-height: 32px;
  color: var(--tech-cyan);
  box-shadow: 0 0 10px rgba(56, 189, 248, 0.2);
}

/* testo descrizione */
.project-content {
  word-wrap: break-word;
  max-width: 100%;
  color: var(--tech-text-main);
  line-height: 1.6;
}

/* bottone ghost (torna ai progetti) */
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

/* bottone solido (Github) */
.btn-solid {
  display: inline-block;
  background: var(--tech-cyan);
  color: #fff;
  border: 1px solid var(--tech-cyan);
  border-radius: 25px;
  padding: 0.35rem 0.9rem;
  box-shadow: 0 0 10px rgba(56, 189, 248, 0.3);
  text-transform: uppercase;
  font-size: 0.8rem;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 600;
}

.btn-solid:hover {
  transform: translateY(-2px);
  box-shadow: 0 0 20px rgba(56, 189, 248, 0.6);
  background: #fff;
  color: var(--tech-cyan);
}

/* responsive */
@media (max-width: 768px) {
  .project-card {
    padding: 1.5rem !important;
  }

  .page-title {
    font-size: 1.5rem;
  }
}
</style>

