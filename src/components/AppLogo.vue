<script>
export default {
  name: 'AppLogo',
};
</script>

<template>
  <router-link :to="{ name: 'home' }" class="app-logo">
    <span class="logo-text">FD</span>
  </router-link>
</template>

<style lang="scss" scoped>
.app-logo {
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  border-radius: 12px;
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid var(--tech-cyan);
  box-shadow: 0 0 15px rgba(56, 189, 248, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.logo-text {
  font-family: 'Saira', sans-serif;
  font-weight: 800;
  font-size: 1.2rem;
  color: var(--tech-cyan);
  letter-spacing: -0.05em;
  text-shadow: 0 0 10px rgba(56, 189, 248, 0.6);
  z-index: 2;
}

.app-logo::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.2) 0%, transparent 70%);
  opacity: 0;
  transform: scale(0.5);
  transition: all 0.5s ease;
}

.app-logo:hover {
  transform: scale(1.05) rotate(3deg);
  box-shadow: 0 0 25px rgba(56, 189, 248, 0.6);
  border-color: #fff;
}

.app-logo:hover .logo-text {
  color: #fff;
  text-shadow: 0 0 15px var(--tech-cyan);
}

.app-logo:hover::before {
  opacity: 1;
  transform: scale(1);
}
</style>
