import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import AboutView from './views/AboutView.vue';
import ContactsView from './views/ContactsView.vue';


const router = createRouter({
  history: createWebHistory(),
  routes:[
      {
          'path': '/', 
          'name' : 'home',
          'component': HomeView
      },
      {
          'path': '/About', 
          'name' : 'about',
          'component': AboutView
      },
      {
          'path': '/Contacts', 
          'name' : 'contacts',
          'component': ContactsView
      }
]
})

export default {router}
