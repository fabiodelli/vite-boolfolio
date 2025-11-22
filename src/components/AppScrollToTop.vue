<script>
export default {
  name: 'AppScrollToTop',
  data() {
    return {
      isVisible: false,
      scrollThreshold: 300,
    };
  },
  mounted() {
    window.addEventListener('scroll', this.checkScroll);
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.checkScroll);
  },
  methods: {
    checkScroll() {
      this.isVisible = window.scrollY > this.scrollThreshold;
    },
    scrollToTop() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    },
  },
};
</script>

<template>
  <transition name="fade">
    <button
      v-if="isVisible"
      class="scroll-to-top"
      @click="scrollToTop"
      aria-label="Scroll to top"
    >
      <i class="fa-solid fa-arrow-up"></i>
    </button>
  </transition>
</template>

<style lang="scss" scoped>
.scroll-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 9999;
  
  width: 50px;
  height: 50px;
  border-radius: 50%;
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  background: var(--tech-bg-glass);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid var(--tech-cyan);
  color: var(--tech-cyan);
  
  box-shadow: 0 0 15px rgba(56, 189, 248, 0.3);
  cursor: pointer;
  transition: all 0.3s ease;
  
  font-size: 1.2rem;

  &:hover {
    background: var(--tech-cyan);
    color: #000;
    box-shadow: 0 0 25px rgba(56, 189, 248, 0.6);
    transform: translateY(-5px);
  }
}

/* Transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
