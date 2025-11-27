
<style lang="scss" scoped>
.showcase-card {
  background: var(--tech-bg-glass);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid var(--tech-border);
  border-radius: 20px;
  box-shadow: var(--tech-shadow);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    border-color: var(--tech-cyan);
    box-shadow: 0 0 30px rgba(56, 189, 248, 0.2);
  }
}

.section-title {
  color: var(--tech-cyan);
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  text-shadow: 0 0 10px rgba(56, 189, 248, 0.3);
}

.showcase-desc {
  color: var(--tech-text-main);
  font-size: 1.1rem;
  line-height: 1.6;
  
  ::v-deep(strong) {
    color: var(--tech-purple);
    font-weight: 700;
  }
}

.tech-tag {
  background: rgba(56, 189, 248, 0.1);
  color: var(--tech-cyan);
  border: 1px solid var(--tech-border);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    background: var(--tech-cyan);
    color: #fff;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(56, 189, 248, 0.4);
  }
}

.cta-text {
  color: var(--tech-text-main);
  font-weight: 700;
}

.btn-tech-primary {
  background: linear-gradient(135deg, var(--tech-cyan), var(--tech-purple));
  color: #fff;
  border: none;
  padding: 12px 30px;
  border-radius: 50px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 5px 20px rgba(56, 189, 248, 0.4);

  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 10px 30px rgba(147, 51, 234, 0.6);
  }
}

.tech-visual {
  animation: float 6s ease-in-out infinite;
}

.tech-stack-img {
  max-width: 80%;
  border-radius: 20px;
  box-shadow: 0 0 30px rgba(56, 189, 248, 0.3);
  border: 1px solid var(--tech-border);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.02);
    box-shadow: 0 0 50px rgba(56, 189, 248, 0.5);
    border-color: var(--tech-cyan);
  }
}

@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-15px); }
}
</style>
