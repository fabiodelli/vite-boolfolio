<script>
export default {
  name: "ContactView",
};
</script>

<template>
  <div class="contacts-container container-xxl py-5">

    <div class="row align-items-center justify-content-center gap-lg-5">

      <!-- LEFT: TITOLONE -->
      <div class="col-12 col-lg-5 mb-5 mb-lg-0 text-center text-lg-start">
        <h1 class="contact-title page-title" v-html="$t('contacts.hero_title')"></h1>
      </div>

      <!-- RIGHT: CARD CONTATTI -->
      <div class="col-12 col-lg-5">
        <div class="contact-card card-like p-4 text-center">

          <img src="../../public/img/avatar.png"
               alt="Avatar"
               class="contact-avatar mb-3" />

          <h3 class="section-title mb-3">{{ $t('contacts.subtitle') }}</h3>

          <p class="contact-subtitle mb-4">
            {{ $t('contacts.text') }}
          </p>

          <!-- EMAIL BOX -->
          <div class="email-box mb-4">
            <a href="mailto:delli.fabio@gmail.com" class="email-link">
              <i class="fa-solid fa-envelope me-2"></i>
              {{ $t('contacts.email_me') }}
            </a>
          </div>

          <p class="fw-semibold mb-2">{{ $t('contacts.socials') }}</p>

          <div class="social-links d-flex justify-content-center gap-3 mt-3">
            <a class="social-pill" href="#" target="_blank"><i class="fa-brands fa-linkedin"></i></a>
            <a class="social-pill" href="#" target="_blank"><i class="fa-brands fa-github"></i></a>
            <a class="social-pill" href="#" target="_blank"><i class="fa-brands fa-facebook"></i></a>
          </div>

        </div>
      </div>

    </div>

  </div>
</template>


