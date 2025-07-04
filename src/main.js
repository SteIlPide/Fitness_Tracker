import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

import { IonicVue } from '@ionic/vue'

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css'

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css'
import '@ionic/vue/css/structure.css'
import '@ionic/vue/css/typography.css'

/* Optional CSS utils that can be commented out */
// import '@ionic/vue/css/padding.css';
// import '@ionic/vue/css/float-effects.css';
// import '@ionic/vue/css/text-alignment.css';
// import '@ionic/vue/css/text-transformation.css';
// import '@ionic/vue/css/flex-utils.css';
// import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css'
import './theme/calendar.css'

const app = createApp(App).use(createPinia()).use(router).use(IonicVue)

// Aggiungi un watcher al router per aggiungere/rimuovere la classe 'has-footer'
router.isReady().then(() => {
  app.mount('#app')

  // Dopo che l'app è montata, aggiungi un watcher per il percorso della rotta
  router.afterEach((to) => {
    const appEl = document.querySelector('ion-app')
    if (appEl) {
      const routesWithFooter = [
        '/home',
        '/obiettivi',
        '/calendario',
        '/piatti-salvati',
        '/impostazioni',
        '/select-meal',
        '/search-create-plate',
        '/add-plate-details',
        '/search-results',
        '/enter-quantity',
        '/food-summary',
      ]
      if (routesWithFooter.includes(to.path)) {
        appEl.classList.add('has-footer')
      } else {
        appEl.classList.remove('has-footer')
      }
    }
  })
})
