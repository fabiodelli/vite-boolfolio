<script>
export default {
  name: 'ContactView',
}
</script>

<template>
  <div class="contact-section container-fluid">
    <div class="row align-items-center justify-content-center py-5">

      <!-- Testo sinistro -->
      <div class="col-12 col-lg-6 text-center text-lg-start mb-5 mb-lg-0">
        <h1 class="contact-title">
          Facciamo<br />
          <span class="outlined">qualcosa</span><br />
          insieme!
        </h1>
      </div>

      <!-- Box destro -->
      <div class="col-12 col-lg-5">
        <div class="contact-card text-center p-5">
          <img src="../../public/img/avatar.png" alt="Avatar" class="contact-avatar mb-4" />
          <h2 class="fw-bold mb-3">ENTRA IN CONTATTO</h2>
          <p class="mb-4">Sentiti liberə di scrivermi qui 👇</p>

          <div class="contact-info mb-4">
            <a href="mailto:tuamail@example.com" class="contact-link">
              <i class="fa-solid fa-envelope me-2"></i> tuamail@example.com
            </a>
          </div>

          <p class="fw-semibold">Guarda anche i miei social</p>
          <div class="social-links d-flex justify-content-center gap-3 mt-3">
            <a href="#" target="_blank" class="social-btn"><i class="fa-brands fa-linkedin"></i></a>
            <a href="#" target="_blank" class="social-btn"><i class="fa-brands fa-github"></i></a>
            <a href="#" target="_blank" class="social-btn"><i class="fa-brands fa-facebook"></i></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.contact-section {
  background-color: #ffffff;
  min-height: calc(100vh - 140px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.contact-title {
  font-size: 5rem;
  font-weight: 800;
  color: #000;
  line-height: 1;
  text-transform: none;

  .outlined {
    color: transparent;
    -webkit-text-stroke: 2px #000;
  }

  @media (max-width: 768px) {
    font-size: 3rem;
    text-align: center;
  }
}

/* --- Card destra --- */
.contact-card {
  background-color: #eaf5ff;
  border: 3px solid #000;
  border-radius: 25px;
  box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);
}

.contact-avatar {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #000;
}

.contact-info {
  background: #fff;
  border-radius: 15px;
  border: 2px solid #000;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.3);
  padding: 10px 15px;
  display: inline-block;
}

.contact-link {
  color: #000;
  text-decoration: none;
  font-weight: 500;
}

.social-btn {
  background: #fff;
  border: 2px solid #000;
  border-radius: 15px;
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  color: #000;
  box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.3);

  &:hover {
    background-color: #000;
    color: #fff;
    transform: scale(1.1);
  }
}
</style>
