<script>
import axios from 'axios';

export default {
    name: 'home',
    data() {
        return {
            // --- HERO
            titleTexts: ['DEVELOPER', 'TECH-ENTUSIAST', 'DREAMER'],
            currentTextIndex: 0,
            animatedText: '',
            currentIndex: 0,
            interval: 3000,

            // --- API (coerente con Projects page)
            base_url: 'http://127.0.0.1:8000/',
            projects_API: 'api/projects',

            // --- Stato/dati
            loading: { projects: true },
            error: { projects: null },

            projects: [],        // response.data.results.data
            techItems: [],       // [{name, imageUrl|null, faIcon|null}]
            startYear: 2023,

            // --- Timeline (ok hardcoded)
            timeline: [
                { when: '2024', title: 'Formazione Full-Stack', note: 'HTML/CSS/JS, Vue, PHP' },
                { when: '2025', title: 'Stage Front-End', note: 'Componenti riutilizzabili' },
                { when: 'Oggi', title: 'Progetti personali', note: 'UI/UX, performance' },
            ],
        };
    },

    created() {
        this.changeText();
        setInterval(this.changeText, this.interval);
    },

    mounted() {
        this.fetchProjects(); // include anche il build delle tecnologie con immagini
    },

    computed: {
        // KPI dinamici (reali)
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

        // Featured: pinned/featured o i più recenti
        featured() {
            if (!this.projects?.length) return [];
            const pinned = this.projects.filter(p => p.pinned || p.featured);
            const base = (pinned.length ? pinned : this.projects).slice().sort((a, b) => {
                const ad = new Date(a.updatedAt || a.createdAt || 0);
                const bd = new Date(b.updatedAt || b.createdAt || 0);
                return bd - ad;
            });
            return base.slice(0, 3);
        },
    },

    methods: {
        // --- HERO
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

        // --- API
        async fetchProjects() {
            try {
                const url = this.base_url + this.projects_API; // http://127.0.0.1:8000/api/projects
                const { data } = await axios.get(url);
                const list = Array.isArray(data?.results?.data) ? data.results.data : [];
                this.projects = list;

                // Build tecnologie uniche con immagine se presente
                // Ogni project.technologies = [{name, image|logo|icon_path?}, ...]
                const map = new Map();
                list.forEach(p => {
                    (Array.isArray(p.technologies) ? p.technologies : []).forEach(t => {
                        const rawName = t?.name || t?.title || t?.slug;
                        if (!rawName) return;
                        const name = String(rawName).trim();

                        // Prova a capire l'immagine/icone dal record tecnologia
                        const imgPath =
                            t.image || t.logo || t.icon_path || t.icon || t.cover || null;

                        // Se già esiste non sovrascrivo (primo valore vince)
                        if (!map.has(name)) {
                            map.set(name, {
                                name,
                                imageUrl: imgPath ? this.getImageFromPath(imgPath) : null,
                                faIcon: this.guessFaIcon(name), // fallback
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

        // --- Helpers immagini
        getImageFromPath(path) {
            if (!path) return null;
            // se il backend restituisce già l’URL assoluto, lo uso
            if (/^https?:\/\//i.test(path)) return path;
            return this.base_url + "img/" + String(path).replace(/^\/+/, "");
        },


        projectImage(p) {
            // usa gli stessi campi e la stessa logica della tua Projects page
            const path = p.image || p.image_path || p.cover || p.thumbnail || null;
            return path ? this.getImageFromPath(path) : null;
        },


        // fallback per icone FA se manca il logo tecnologia
        guessFaIcon(name) {
            const n = name.toLowerCase();
            if (n.includes('vue')) return 'vuejs';
            if (n.includes('javascript') || n === 'js') return 'js';
            if (n.includes('typescript') || n === 'ts') return 'js'; // fallback generico
            if (n.includes('html')) return 'html5';
            if (n.includes('css')) return 'css3-alt';
            if (n.includes('sass') || n.includes('scss')) return 'sass';
            if (n.includes('bootstrap')) return 'bootstrap';
            if (n.includes('php')) return 'php';
            if (n.includes('laravel')) return 'laravel';
            if (n.includes('sql')) return 'database';
            return null;
        },

        // --- UI actions
        goProjects() { this.$router.push({ name: 'projects' }); },
        goContacts() { this.$router.push({ name: 'contacts' }); },
        dlCV() { window.open('/cv.pdf', '_blank'); },

        projectTitle(p) { return p.title || p.name || 'Progetto'; },
        projectDesc(p) { return p.description || p.summary || ''; },
        projectTags(p) {
            return Array.isArray(p.technologies)
                ? p.technologies.map(t => t?.name).filter(Boolean)
                : [];
        },
    },
};
</script>

<template>
    <div class="bg-white">

        <!-- HERO -->
        <section class="home-section">
            <h1 class="home_text">
                HI I'M FABIO <br />
                {{ animatedText }} <br />
                AND THIS IS MY PORTFOLIO
            </h1>
            <img src="../../public/img/home.png" class="img-home" alt="Portfolio hero" />
        </section>

        <!-- KPI (reali) -->
        <section class="kpi-wrap container-xxl">
            <div class="row g-4 justify-content-center">
                <div v-for="k in kpi" :key="k.label" class="col-12 col-md-4">
                    <div class="pill card-like text-center py-4">
                        <div class="kpi-num">
                            <span v-if="loading.projects">…</span>
                            <span v-else>{{ k.value }}</span>
                        </div>
                        <div class="kpi-label">{{ k.label }}</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- TECH STACK (reale, con immagini) -->
        <section class="stack-wrap container-xxl">
            <h3 class="section-title">Tecnologie</h3>

            <div v-if="loading.projects" class="text-muted">Caricamento tecnologie…</div>
            <div v-else-if="!techItems.length" class="text-muted">Nessuna tecnologia disponibile.</div>
            <div v-else class="stack-logos">
                <div v-for="t in techItems" :key="t.name" class="tech-item">
                    <div class="tech-logo card-like">
                        <img v-if="t.imageUrl" :src="t.imageUrl" :alt="t.name" />
                        <i v-else-if="t.faIcon" :class="`fa-brands fa-${t.faIcon}`"></i>
                        <span v-else class="tech-placeholder">{{ t.name[0] }}</span>
                    </div>
                    <div class="tech-name text-uppercase">{{ t.name }}</div>
                </div>
            </div>
        </section>

        <!-- FEATURED PROJECTS (reali, con cover) -->
        <section class="featured-wrap container-xxl">
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h3 class="section-title m-0">Progetti in evidenza</h3>
                <button class="btn-ghost" @click="goProjects">Vedi tutti</button>
            </div>

            <div v-if="loading.projects" class="text-muted">Caricamento progetti…</div>
            <div v-else-if="!featured.length" class="text-muted">Nessun progetto in evidenza.</div>
            <div v-else class="row g-4">
                <div v-for="(p, i) in featured" :key="i" class="col-12 col-md-4">
                    <article class="card-like h-100 d-flex flex-column overflow-hidden">
                        <!-- Cover progetto -->
                        <div class="proj-cover-wrap">
                            <img v-if="projectImage(p)" :src="projectImage(p)" :alt="projectTitle(p)"
                                class="proj-cover" />
                            <div v-else class="proj-cover placeholder">N/A</div>
                        </div>

                        <!-- Testi -->
                        <div class="p-3 d-flex flex-column flex-grow-1">
                            <h5 class="mb-2">{{ projectTitle(p) }}</h5>
                            <p class="mb-3">{{ projectDesc(p) }}</p>
                            <div class="d-flex flex-wrap gap-2 mb-3">
                                <span v-for="t in projectTags(p)" :key="t" class="tag">{{ t }}</span>
                            </div>
                            <button class="btn-ghost mt-auto align-self-start" @click="goProjects">Apri</button>
                        </div>
                    </article>
                </div>
            </div>
        </section>

        <!-- TIMELINE -->
        <section class="timeline-wrap container-xxl">
            <h3 class="section-title">Percorso</h3>
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

        <!-- CTA -->
        <section class="cta-wrap container-xxl text-center">
            <div class="card-like p-4">
                <h4 class="mb-3">Ti interessa il mio profilo?</h4>
                <div class="d-flex flex-wrap gap-3 justify-content-center">
                    <button class="btn-solid" @click="dlCV">Scarica CV</button>
                    <button class="btn-ghost" @click="goContacts">Contattami</button>
                </div>
            </div>
        </section>

    </div>
</template>

<style lang="scss" scoped>
/* Sezioni generali */
.kpi-wrap,
.stack-wrap,
.featured-wrap,
.timeline-wrap,
.cta-wrap {
    padding: 3rem 1rem;
}

/* Card stile portfolio */
.card-like {
    background-color: #eaf5ff !important;
    border: 3px solid #000 !important;
    border-radius: 25px !important;
    box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4) !important;
}

/* KPI */
.kpi-num {
    font-size: 42px;
    font-weight: 800;
    line-height: 1;
}

.kpi-label {
    text-transform: uppercase;
    letter-spacing: .04em;
}

/* Titoli/sezioni */
.section-title {
    font-weight: 800;
    margin-bottom: 1rem;
}

/* --- Tech logos grid --- */
/* --- Tech logos grid (versione bilanciata) --- */
.stack-logos {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
    gap: 1rem;
    justify-items: center;
}

.tech-item {
    text-align: center;
}

.tech-logo {
    width: 90px;
    height: 90px;
    background: #fff;
    border: 3px solid #000;
    border-radius: 20px;
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    transition: transform .25s ease;
}

.tech-logo:hover {
    transform: scale(1.07);
}

.tech-logo img {
    width: 70%;
    height: auto;
    object-fit: contain;
    display: block;
}

.tech-logo i {
    font-size: 2rem;
}

.tech-placeholder {
    font-weight: 700;
    font-size: 1.5rem;
}

.tech-name {
    margin-top: .4rem;
    font-size: .85rem;
    font-weight: 600;
    text-transform: uppercase;
}


/* --- Project cover --- */
.proj-cover-wrap {
    width: 100%;
    aspect-ratio: 16/9;
    /* ritaglio pulito */
    overflow: hidden;
    /* taglia agli angoli della card */
    border-bottom: 3px solid #000;
    /* coerenza stile */
}

.proj-cover {
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* riempie senza deformare */
    display: block;
}

.proj-cover.placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    font-weight: 800;
    letter-spacing: .08em;
}

/* Tag */
.tag {
    background: #fff;
    border: 2px solid #000;
    border-radius: 12px;
    padding: .2rem .6rem;
    font-size: .85rem;
}

/* Bottoni */
.btn-ghost {
    background: #fff;
    border: 3px solid #000;
    border-radius: 25px;
    padding: .5rem 1rem;
    box-shadow: 3px 3px 6px rgba(0, 0, 0, .3);
    transition: all .2s ease;
    text-transform: uppercase;
}

.btn-ghost:hover {
    transform: scale(1.05);
    background: #000;
    color: #fff;
}

.btn-solid {
    background: #000;
    color: #fff;
    border: 3px solid #000;
    border-radius: 25px;
    padding: .5rem 1rem;
    box-shadow: 3px 3px 6px rgba(0, 0, 0, .3);
    text-transform: uppercase;
    transition: transform .2s ease;
}

.btn-solid:hover {
    transform: scale(1.05);
}

/* Timeline */
.timeline {
    list-style: none;
    padding-left: 0;
    position: relative;
    margin: 0;
}

.timeline:before {
    content: "";
    position: absolute;
    left: 18px;
    top: 0;
    bottom: 0;
    width: 3px;
    background: #000;
}

.timeline li {
    position: relative;
    padding-left: 60px;
    margin: 1.25rem 0;
}

.timeline .dot {
    position: absolute;
    left: 10px;
    top: 6px;
    width: 20px;
    height: 20px;
    border: 3px solid #000;
    border-radius: 50%;
    background: #fff;
}

.timeline .content .when {
    font-weight: 800;
}

.timeline .content .title {
    font-size: 1.05rem;
}

.timeline .content .note {
    opacity: .9;
}

@media (max-width: 992px) {
    .kpi-num {
        font-size: 34px;
    }
}
</style>
