<script>
import axios from 'axios';
import TechBubbles from '../components/TechBubbles.vue';
import AppCta from '../components/AppCta.vue';
import AppPortfolioShowcase from '../components/AppPortfolioShowcase.vue';

export default {
  name: 'home',
  components: {
    TechBubbles,
    AppCta,
    AppPortfolioShowcase,
  },
  data() {
    return {
      // HERO
      titleTexts: ['DEVELOPER', 'TECH-ENTUSIAST', 'DREAMER'],
      currentTextIndex: 0,
      animatedText: '',
      currentIndex: 0,
      interval: 3000,

      // API (come Projects)
      base_url: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
      projects_API: 'api/projects',

      // stato
      loading: { projects: true },
      error: { projects: null },
      isMobile: false,

      // dati
      projects: [],     // array vero -> results.data
      techItems: [],    // [{ name, imageUrl|null, faIcon|null }]
      startYear: 2023,

      // timeline
      timeline: [
        { when: '2019', title: 'Percorso Formativo', note: 'Soft skills, mindset, comunicazione' },
        { when: '2022', title: 'Boolean Careers', note: 'Full Stack Web Development (700+ ore)' },
        { when: '2024', title: 'Freelance', note: 'Ecommerce Manager & Junior Developer' },
        { when: '2025', title: 'Progetti Personali', note: 'Portfolio, sperimentazione, crescita' },
      ],
    };
  },

  created() {
    this.changeText();
    setInterval(this.changeText, this.interval);
  },

  mounted() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
    this.fetchProjects().then(() => {
      // loaded
    });
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.checkMobile);
  },

  computed: {
    // KPI
    kpiProjects() { return this.projects.length; },
    kpiSkills() { return this.techItems.length; },
    kpiYears() { return Math.max(1, new Date().getFullYear() - this.startYear); },
    kpi() {
      return [
        { label: 'Progetti', value: this.kpiProjects },
        { label: 'Tecnologie', value: this.kpiSkills },
        { label: 'Anni', value: this.kpiYears },
      ];
    },

    // Featured: se non ci sono pinned/featured, prendi i primi 3
    featured() {
      if (!this.projects?.length) return [];
      const pinned = this.projects.filter(p => p.pinned || p.featured || p.is_featured);
      const base = pinned.length ? pinned : this.projects;
      return base.slice(0, 3);
    },
  },

  methods: {
    // HERO
    changeText() {
      this.animatedText = '';
      this.titleText = this.titleTexts[this.currentTextIndex];
      this.currentTextIndex = (this.currentTextIndex + 1) % this.titleTexts.length;
      this.animateTitle();
    },
    animateTitle() {
      this.animatedText = this.titleText;
      this.currentIndex = 0;
    },

    /* ========= IMMAGINI (stessa logica della Projects page) ========= */

    // esattamente come nella Projects page
    getImageFromPath(path) {
      if (!path) return null;
      if (/^https?:\/\//i.test(path)) return path; // se mai il backend fornisse già URL assoluto
      return this.base_url + 'img/' + String(path).replace(/^\/+/, '');
    },

    // project cover: usa i campi “classici” che probabilmente usi in Projects
    projectImage(p) {
      const path =
        p.image ||
        p.image_path ||
        p.cover ||
        p.cover_image ||
        p.thumbnail ||
        p.thumb ||
        null;
      return path ? this.getImageFromPath(path) : null;
    },

    // handler img rotta (nasconde solo l’img rotta, lascia il placeholder)
    onImgError(ev) { ev.target.style.display = 'none'; },

    /* ======================= API ======================= */
    async fetchProjects() {
      try {
        const url = this.base_url + this.projects_API; // http://127.0.0.1:8000/api/projects
        const { data } = await axios.get(url);

        // *** STESSA STRUTTURA DELLA TUA PROJECTS PAGE ***
        // nella Projects page: this.projects = response.data.results; ... this.projects.data
        const results = data?.results || {};
        const list = Array.isArray(results?.data) ? results.data : [];
        this.projects = list;

        // tecnologie UNICHE con immagine (stessa idea ma URL come in Projects)
        const map = new Map();
        list.forEach(p => {
          const techs = Array.isArray(p.technologies) ? p.technologies : [];
          techs.forEach(t => {
            const rawName = t?.name || t?.title || t?.slug;
            if (!rawName) return;
            const name = String(rawName).trim();

            const rawImg = t.image || t.logo || t.icon_path || t.icon || null;
            const imageUrl = rawImg 
              ? (String(rawImg).startsWith('http') ? rawImg : this.base_url + 'storage/' + rawImg)
              : null;

            if (!map.has(name)) {
              map.set(name, {
                name,
                imageUrl,
                faIcon: imageUrl ? null : this.guessFaIcon(name),
              });
            }
          });
        });
        this.techItems = Array.from(map.values());
      } catch (e) {
        console.error('[Home] fetchProjects error:', e);
        this.error.projects = 'Impossibile caricare i progetti';
        this.projects = [];
        this.techItems = [];
      } finally {
        this.loading.projects = false;
      }
    },

    // fallback icone FA se manca il logo tech
    guessFaIcon(name) {
      const n = (name || '').toLowerCase();
      if (n.includes('vue')) return 'vuejs';
      if (n.includes('javascript') || n === 'js') return 'js';
      if (n.includes('typescript') || n === 'ts') return 'js';
      if (n.includes('html')) return 'html5';
      if (n.includes('css')) return 'css3-alt';
      if (n.includes('sass') || n.includes('scss')) return 'sass';
      if (n.includes('bootstrap')) return 'bootstrap';
      if (n.includes('php')) return 'php';
      if (n.includes('laravel')) return 'laravel';
      if (n.includes('sql')) return 'database';
      return null;
    },

    // UI
    goProjects() { this.$router.push({ name: 'projects' }); },
    goContacts() { this.$router.push({ name: 'contacts' }); },
    dlCV() { window.open('/cv.pdf', '_blank'); },

    projectTitle(p) {
      if (this.$i18n.locale === 'en' && p.title_en) {
        return p.title_en;
      }
      return p.title || p.name || 'Progetto';
    },
    projectDesc(p) {
      if (this.$i18n.locale === 'en' && p.content_en) {
        return p.content_en;
      }
      return p.description || p.summary || '';
    },
    projectTags(p) {
      return Array.isArray(p.technologies)
        ? p.technologies.map(t => t?.name).filter(Boolean)
        : [];
    },

    checkMobile() {
      this.isMobile = window.innerWidth < 768;
    },
  },
};
</script>


<template>
  <div class="bg-transparent">

    <!-- HERO -->
    <section class="home-section" style="background: transparent;">
      <h1 class="home_text">
        {{ $t('home.hero_title') }} <br />
        {{ animatedText }} <br />
        {{ $t('home.hero_subtitle') }}
      </h1>
      <img src="/img/hero_tech.png" class="img-home" alt="Portfolio hero" />
    </section>


    <!-- FEATURED PROJECTS (reali, con cover) -->
    <section class="featured-wrap container-xxl">
      <div class="d-flex justify-content-between align-items-center mb-3">
        <h3 class="section-title m-0">{{ $t('home.featured_title') }}</h3>
        <button class="btn-ghost" @click="goProjects">{{ $t('home.view_all') }}</button>
      </div>

      <div v-if="loading.projects" class="text-muted">{{ $t('home.loading_projects') }}</div>
      <div v-else-if="!featured.length" class="text-muted">{{ $t('home.no_featured') }}</div>
      <div v-else class="row g-4">
        <div v-for="(p, i) in featured" :key="i" class="col-12 col-md-4">
          <article class="card-like h-100 d-flex flex-column overflow-hidden featured-card" @click="goProjects">
            <!-- Cover progetto -->
            <div class="proj-cover-wrap">
              <img v-if="projectImage(p)" :src="projectImage(p)" :alt="projectTitle(p)" class="proj-cover"
                @error="onImgError" />
              <div v-else class="proj-cover placeholder">N/A</div>
            </div>

            <!-- Testi -->
            <div class="p-3 d-flex flex-column flex-grow-1">
              <h5 class="mb-2">{{ projectTitle(p) }}</h5>
              <p class="mb-3">{{ projectDesc(p) }}</p>
              <div class="d-flex flex-wrap gap-2 mb-3">
                <span v-for="t in projectTags(p)" :key="t" class="btn-ghost">{{ t }}</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>


    <!-- TECH STACK (reale, in stile “crypto bubble”) -->
    <section class="stack-wrap container-xxl">
      <h3 class="section-title">{{ $t('home.tech_title') }}</h3>

      <div v-if="loading.projects" class="text-muted">{{ $t('home.loading_tech') }}</div>
      <div v-else-if="!techItems.length" class="text-muted">{{ $t('home.no_tech') }}</div>
      <div v-else>
        <TechBubbles 
          :items="techItems" 
          :height="360" 
          :minSize="isMobile ? 40 : 70" 
          :maxSize="isMobile ? 70 : 110" 
        />
      </div>
    </section>


    <!-- TIMELINE -->
    <section class="timeline-wrap container-xxl">
      <h3 class="section-title">{{ $t('home.timeline_title') }}</h3>
      <ul class="timeline">
        <li v-for="(t, i) in timeline" :key="i">
          <div class="dot"></div>
          <div class="content">
            <div class="when">{{ t.when }}</div>
            <div class="title">{{ t.title }}</div>
            <div class="note">{{ t.note }}</div>
          </div>
        </li>
      </ul>
    </section>

    <!-- PORTFOLIO SHOWCASE -->
    <AppPortfolioShowcase />

    <!-- CTA -->
    <AppCta />

  </div>
</template>
