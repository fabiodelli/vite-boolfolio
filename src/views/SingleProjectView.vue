<script>
import axios from 'axios';

export default {
  name: 'SingleProjectView',
  data() {
    return {
      project: null,
      loading: true,
      error: null,
      base_url: 'http://127.0.0.1:8000/',
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
        console.log(err);
        this.error = 'Errore nel caricamento del progetto';
      })
      .finally(() => {
        this.loading = false;
      });
  },
};
</script>

<template>
  <div class="bg-white">
    <div class="container-xxl py-5 min-vh-100">

      <!-- HEADER / TITLE + BACK -->
      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h1 class="page-title mb-0">
          {{ project && project.title ? project.title : 'N/A' }}
        </h1>

        <button class="btn-ghost" @click="goBack">
          ← Torna ai progetti
        </button>
      </div>

      <!-- LOADING / ERROR -->
      <div v-if="loading" class="text-muted">
        Caricamento progetto…
      </div>

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
                <span class="label">Type</span>
                <span class="type-pill">
                  {{ project.type ? project.type.type : 'N/A' }}
                </span>
              </div>

              <div>
                <span class="label">Technologies</span>
                <div v-if="project.technologies && project.technologies.length" class="d-flex flex-wrap gap-2 mt-1">
                  <span
                    v-for="technology in project.technologies"
                    :key="technology.id"
                    class="tech-logo-pill"
                  >
                    <img
                      v-if="technology.logo"
                      :src="technology.logo"
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
              <span class="label">Descrizione</span>
              <p class="project-content mt-1">
                {{ project.content ? project.content : 'N/A' }}
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
                Vai al repository
              </a>
              <span v-else class="text-muted">Non disponibile</span>
            </div>

          </div>
        </div>
      </div>

      <!-- Se per qualche motivo project è null senza error (edge case) -->
      <div v-else class="text-muted">
        Nessun dato disponibile per questo progetto.
      </div>

    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-title {
  font-weight: 800;
  text-transform: uppercase;
  margin-bottom: 1rem;
}

/* card singolo progetto: stesso stile generale del sito */
.project-card {
  background: #eaf5ff;
  border: 3px solid #000;
  border-radius: 25px;
  box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);
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
  border: 3px solid black;
  box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);
  object-fit: cover;
}


/* placeholder se manca l’immagine */
.project-image.placeholder {
  min-height: 220px;
}

/* label piccole (Type, Technologies, Description, Github) */
.label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  font-weight: 700;
}

/* pill del type */
.type-pill {
  display: inline-block;
  margin-left: 0.4rem;
  padding: 0.2rem 0.8rem;
  border-radius: 999px;
  border: 2px solid #000;
  background: #000;
  color: #fff;
  font-size: 0.85rem;
  text-transform: uppercase;
}

/* pill per tech con logo */
.tech-logo-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  border: 2px solid #000;
  background: #fff;
  min-height: 32px;
}

/* testo descrizione */
.project-content {
  word-wrap: break-word;
  max-width: 100%;
}

/* bottone ghost (torna ai progetti) in stile portfolio */
.btn-ghost {
  background: #fff;
  border: 3px solid #000;
  border-radius: 25px;
  padding: 0.35rem 0.9rem;
  box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
  text-transform: uppercase;
  font-size: 0.8rem;
  display: inline-block;
  transition: all 0.18s ease;
}

.btn-ghost:hover {
  transform: scale(1.05);
  background: #000;
  color: #fff;
}

/* bottone solido (Github) */
.btn-solid {
  display: inline-block;
  background: #000;
  color: #fff;
  border: 3px solid #000;
  border-radius: 25px;
  padding: 0.35rem 0.9rem;
  box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);
  text-transform: uppercase;
  font-size: 0.8rem;
  text-decoration: none;
  transition: transform 0.18s ease;
}

.btn-solid:hover {
  transform: scale(1.05);
  color: #fff;
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

