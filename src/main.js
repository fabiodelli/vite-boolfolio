import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router.js'
import i18n from './i18n';
import '@fortawesome/fontawesome-free/css/all.css';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

createApp(App).use(router).use(i18n).mount('#app')
