<script>
export default {
  name: "ParticleBackground",
  props: {
    darkMode: {
      type: Boolean,
      default: false,
    },
    particleCount: {
      type: Number,
      default: 80,
    },
  },
  data() {
    return {
      canvas: null,
      ctx: null,
      particles: [],
      animationFrameId: null,
      mouse: { x: null, y: null },
    };
  },
  computed: {
    bgColor() {
      // Light: --tech-bg-dark (#f0f9ff), Dark: --tech-bg-dark (#020617)
      return this.darkMode ? "#020617" : "#ffffff";
    },
    particleColor() {
      // Light: Cyan/Blue (#0ea5e9) for visibility, Dark: White (#ffffff) or Cyan (#38bdf8)
      // User asked for "azzurrino", let's try Cyan in Dark Mode too for a more "Tech" feel, 
      // or keep White for contrast. Let's stick to White for Dark Mode as it's star-like.
      // For Light Mode, use a darker Cyan/Blue for contrast against white.
      return this.darkMode ? "#ffffff" : "#0ea5e9";
    },
  },

  mounted() {
    this.canvas = this.$refs.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.resizeCanvas();
    this.initParticles();
    this.animate();

    window.addEventListener("resize", this.resizeCanvas);
  },
  beforeUnmount() {
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener("resize", this.resizeCanvas);
  },
  methods: {
    resizeCanvas() {
      if (this.canvas) {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.initParticles();
      }
    },
    initParticles() {
      this.particles = [];
      for (let i = 0; i < this.particleCount; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          baseVx: (Math.random() - 0.5) * 1,
          baseVy: (Math.random() - 0.5) * 1,
          vx: (Math.random() - 0.5) * 1,
          vy: (Math.random() - 0.5) * 1,
          size: Math.random() * 3 + 1,
        });
      }
    },
    animate() {
      // Fill background
      this.ctx.fillStyle = this.bgColor;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      
      for (let i = 0; i < this.particles.length; i++) {
        let p = this.particles[i];

        // Restore to base velocity (friction/stability)
        p.vx += (p.baseVx - p.vx) * 0.05;
        p.vy += (p.baseVy - p.vy) * 0.05;

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > this.canvas.width) {
            p.vx *= -1;
            p.baseVx *= -1; // Reflect base velocity too
        }
        if (p.y < 0 || p.y > this.canvas.height) {
            p.vy *= -1;
            p.baseVy *= -1; // Reflect base velocity too
        }

        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        this.ctx.fillStyle = this.particleColor;
        this.ctx.fill();

        for (let j = i; j < this.particles.length; j++) {
          let p2 = this.particles[j];
          let dx = p.x - p2.x;
          let dy = p.y - p2.y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = this.particleColor;
            this.ctx.globalAlpha = 1 - dist / 120;
            this.ctx.lineWidth = 0.5;
            this.ctx.moveTo(p.x, p.y);
            this.ctx.lineTo(p2.x, p2.y);
            this.ctx.stroke();
            this.ctx.globalAlpha = 1;
          }
        }
      }

      this.animationFrameId = requestAnimationFrame(this.animate);
    },
  },
};
</script>

<template>
  <div class="particle-background">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<style scoped>
.particle-background {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
  /* Background color handled by canvas */
}

canvas {
  display: block;
}
</style>
