import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router.js'
import '@fortawesome/fontawesome-free/css/all.css';

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

createApp(App).use(router).mount('#app')
