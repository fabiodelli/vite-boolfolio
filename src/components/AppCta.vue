<script>
export default {
  name: 'AppCta',
  methods: {
    goContacts() {
      this.$router.push({ name: 'contacts' });
    },
    dlCV() {
      window.open('/effedidev.pdf', '_blank');
    },
  },
};
</script>

<template>
  <section class="cta-wrap container-xxl text-center my-5">
    <div class="cta-card p-5">
      <h4 class="cta-title mb-4">{{ $t('home.cta_title') }}</h4>
      <div class="d-flex flex-wrap gap-3 justify-content-center">
        <button class="btn-tech-solid" @click="dlCV">
          <i class="fa-solid fa-download me-2"></i>{{ $t('home.download_cv') }}
        </button>
        <button class="btn-tech-ghost" @click="goContacts">
          {{ $t('home.contact_me') }}
        </button>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.cta-card {
  background: var(--tech-bg-glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--tech-border);
  border-radius: 25px;
  box-shadow: var(--tech-shadow);
  transition: all 0.3s ease;
}

.cta-card:hover {
  box-shadow: var(--tech-shadow-hover);
  border-color: var(--tech-cyan);
}

.cta-title {
  font-weight: 800;
  color: var(--tech-text-main);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-shadow: 0 0 20px rgba(56, 189, 248, 0.3);
}

/* Button Styles */
.btn-tech-solid {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--tech-cyan);
  color: #000;
  border: 1px solid var(--tech-cyan);
  border-radius: 12px;
  padding: 0.6rem 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(56, 189, 248, 0.4);

  &:hover {
    transform: translateY(-2px);
    background: #fff;
    color: var(--tech-cyan);
    box-shadow: 0 0 25px rgba(56, 189, 248, 0.6);
  }
}

.btn-tech-ghost {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  color: var(--tech-text-main);
  border: 1px solid var(--tech-text-main);
  border-radius: 12px;
  padding: 0.6rem 1.5rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: var(--tech-cyan);
    color: var(--tech-cyan);
    box-shadow: 0 0 15px rgba(56, 189, 248, 0.3);
  }
}
</style>
