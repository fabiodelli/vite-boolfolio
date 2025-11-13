<script>
export default {
  name: 'TechBubbles',
  props: {
    items:   { type: Array,  default: () => [] },
    height:  { type: Number, default: 360 },
    minSize: { type: Number, default: 70 },
    maxSize: { type: Number, default: 110 },
    padding: { type: Number, default: 10 },
    speed:   { type: Number, default: 1.0 },   // 1 = base, >1 più veloce
  },
  data() {
    return {
      boxW: 0,
      boxH: 0,
      bubbles: [], // {name,imageUrl,faIcon,size,mass,x,y,vx,vy,baseSpeed}
      _raf: null,
      _tAccum: 0,
      _lastT: 0,
      _dtFixed: 1 / 120,      // timestep fisso 120Hz
      _dtMax: 1 / 30,         // clamp ai frame lenti
      _substepsMax: 5,        // ulteriore clamp
    };
  },
  watch: {
    items: {
      immediate: true,
      handler() { this.$nextTick(() => { this.stop(); this.setup(); this.start(); }); }
    }
  },
  mounted() {
    this.measure();
    window.addEventListener('resize', this.onResize);
    this.setup();
    this.start();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.onResize);
    this.stop();
  },
  methods: {
    /* --------- utils --------- */
    measure() {
      const el = this.$refs.box;
      if (!el) return;
      this.boxW = el.clientWidth;
      this.boxH = el.clientHeight;
    },
    onResize() {
      this.measure();
      // clamp posizioni dentro i nuovi bounds
      for (const b of this.bubbles) {
        b.x = Math.min(Math.max(b.x, this.padding), this.boxW - this.padding - b.size);
        b.y = Math.min(Math.max(b.y, this.padding), this.boxH - this.padding - b.size);
      }
    },
    seedFrom(str = '') {
      return [...String(str)].reduce((a, c) => (a * 33 + c.charCodeAt(0)) >>> 0, 5381);
    },
    rnd(seed) { let s = seed || 1; return () => ((s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296); },

    /* --------- setup iniziale (no overlap) --------- */
    setup() {
      this.measure();
      const W = this.boxW || 1;
      const H = this.boxH || this.height;
      const pad = this.padding;
      const bubbles = [];
      const maxAttempts = 600;

      this.items.forEach(it => {
        const seed = this.seedFrom(it.name);
        const r = this.rnd(seed);
        const size = Math.round(this.minSize + r() * (this.maxSize - this.minSize));
        const mass = size * size;

        // velocità target (px/s) in base alle dimensioni
        const baseSpeed = (0.08 + 0.16 * r()) * (this.minSize + this.maxSize) * this.speed;
        const ang = r() * Math.PI * 2;
        let vx = Math.cos(ang) * baseSpeed;
        let vy = Math.sin(ang) * baseSpeed;

        // trova posizione senza sovrapporsi
        let x, y, attempts = 0;
        do {
          const minX = pad;
          const maxX = Math.max(pad, W - size - pad);
          const minY = pad;
          const maxY = Math.max(pad, H - size - pad);
          x = minX + r() * (maxX - minX);
          y = minY + r() * (maxY - minY);
          attempts++;
          if (attempts > maxAttempts) break;
        } while (this.overlapsAny(x, y, size, bubbles));

        bubbles.push({ ...it, size, mass, x, y, vx, vy, baseSpeed });
      });

      this.bubbles = bubbles;
      this._tAccum = 0;
      this._lastT = performance.now();
    },

    overlapsAny(x, y, size, list) {
      const cx = x + size / 2, cy = y + size / 2;
      for (const b of list) {
        const dx = (b.x + b.size / 2) - cx;
        const dy = (b.y + b.size / 2) - cy;
        const dist = Math.hypot(dx, dy);
        if (dist < (b.size + size) / 2 + 2) return true;
      }
      return false;
    },

    /* --------- loop fisso --------- */
    start() {
      this.stop();
      const tick = (t) => {
        let dt = (t - this._lastT) / 1000;
        this._lastT = t;
        if (dt > this._dtMax) dt = this._dtMax; // evita salti
        this._tAccum += dt;

        // substeps a dt fisso
        let safety = 0;
        while (this._tAccum >= this._dtFixed && safety < this._substepsMax) {
          this.updatePhysics(this._dtFixed);
          this._tAccum -= this._dtFixed;
          safety++;
        }

        // render (post update)
        for (const b of this.bubbles) {
          const node = b._el;
          if (node) node.style.transform = `translate3d(${Math.round(b.x)}px, ${Math.round(b.y)}px, 0)`;
        }

        this._raf = requestAnimationFrame(tick);
      };
      this._raf = requestAnimationFrame(tick);
    },
    stop() { if (this._raf) cancelAnimationFrame(this._raf); this._raf = null; },

    attachEl(name) {
      // hook per memorizzare ref al DOM (per evitare querySelector a ogni frame)
      return (el) => {
        const b = this.bubbles.find(x => x.name === name);
        if (b) b._el = el || null;
      };
    },

    /* --------- fisica con rimbalzi --------- */
    updatePhysics(dt) {
      const W = this.boxW, H = this.boxH, pad = this.padding;

      // muovi
      for (const b of this.bubbles) {
        b.x += b.vx * dt;
        b.y += b.vy * dt;

        // pareti
        if (b.x <= pad) { b.x = pad; b.vx = Math.abs(b.vx); }
        if (b.x + b.size >= W - pad) { b.x = W - pad - b.size; b.vx = -Math.abs(b.vx); }
        if (b.y <= pad) { b.y = pad; b.vy = Math.abs(b.vy); }
        if (b.y + b.size >= H - pad) { b.y = H - pad - b.size; b.vy = -Math.abs(b.vy); }
      }

      // collisioni tra bolle (elastico semplificato)
      const n = this.bubbles.length;
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const a = this.bubbles[i], c = this.bubbles[j];
          const ax = a.x + a.size / 2, ay = a.y + a.size / 2;
          const cx = c.x + c.size / 2, cy = c.y + c.size / 2;
          let dx = cx - ax, dy = cy - ay;
          let dist = Math.hypot(dx, dy);
          const minDist = (a.size + c.size) / 2;

          if (dist > 0 && dist < minDist) {
            // separazione
            const nx = dx / dist, ny = dy / dist;
            const overlap = (minDist - dist) + 0.5;

            const invA = 1 / a.mass, invC = 1 / c.mass, invSum = invA + invC;
            a.x -= nx * overlap * (invA / invSum);
            a.y -= ny * overlap * (invA / invSum);
            c.x += nx * overlap * (invC / invSum);
            c.y += ny * overlap * (invC / invSum);

            // proiezione velocità sulla normale
            const vaN = a.vx * nx + a.vy * ny;
            const vcN = c.vx * nx + c.vy * ny;

            // scambio componente normale (urto elastico 1D)
            const vaN2 = (vaN * (a.mass - c.mass) + 2 * c.mass * vcN) / (a.mass + c.mass);
            const vcN2 = (vcN * (c.mass - a.mass) + 2 * a.mass * vaN) / (a.mass + c.mass);

            // aggiorna solo la componente normale, tangenziale invariata
            a.vx += (vaN2 - vaN) * nx;
            a.vy += (vaN2 - vaN) * ny;
            c.vx += (vcN2 - vcN) * nx;
            c.vy += (vcN2 - vcN) * ny;
          }
        }
      }

      // normalizza velocità (niente damping → fluido e costante)
      for (const b of this.bubbles) {
        const v = Math.hypot(b.vx, b.vy);
        const minV = b.baseSpeed * 0.95;
        const maxV = b.baseSpeed * 1.05;
        if (v < minV && v > 0) {
          const s = minV / v; b.vx *= s; b.vy *= s;
        } else if (v > maxV) {
          const s = maxV / v; b.vx *= s; b.vy *= s;
        }
      }
    },
  }
};
</script>

<template>
  <div
    ref="box"
    class="bubble-box card-like"
    :style="{ height: height + 'px', padding: padding + 'px' }"
  >
    <div
      v-for="b in bubbles"
      :key="b.name"
      class="bubble"
      :ref="attachEl(b.name)"
      :style="{ width: b.size + 'px', height: b.size + 'px' }"
    >
      <img v-if="b.imageUrl" :src="b.imageUrl" :alt="b.name" @error="$event.target.style.display='none'" />
      <i v-else-if="b.faIcon" :class="`fa-brands fa-${b.faIcon}`"></i>
      <span v-else class="fallback">{{ b.name[0] }}</span>
      <div class="label">{{ b.name }}</div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.bubble-box {
  position: relative;
  width: 100%;
  overflow: hidden;
  background-color: #eaf5ff !important; /* stile coerente */
  /* .card-like del tuo tema aggiunge border/radius/shadow */
  contain: layout paint; /* micro-ottimizzazione */
}

.bubble {
  position: absolute;
  display: grid;
  place-items: center;
  border-radius: 50%;
  border: 3px solid #000;
  background: #fff;
  box-shadow: 3px 3px 6px rgba(0,0,0,0.4);
  user-select: none;
  will-change: transform;
  backface-visibility: hidden;
  transform: translate3d(0,0,0);
  z-index: 1;
}

.bubble:hover { z-index: 3; transform: translate3d(0,0,0) scale(1.05); }

.bubble img { max-width: 70%; max-height: 70%; object-fit: contain; display: block; z-index: 2; }
.bubble i, .bubble .fallback { z-index: 2; }
.bubble i { font-size: clamp(18px, 3.2vw, 36px); }
.bubble .fallback { font-weight: 800; font-size: 1.2rem; }

.bubble .label {
  position: absolute;
  bottom: -10px;
  transform: translateY(100%);
  background: #fff;
  border: 3px solid #000;
  border-radius: 12px;
  padding: 2px 8px;
  font-size: .75rem;
  white-space: nowrap;
  box-shadow: 2px 2px 4px rgba(0,0,0,.25);
}

@media (max-width: 768px) {
  .bubble-box { height: 420px !important; }
}
</style>
