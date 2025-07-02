import { createRouter, createWebHistory } from '@ionic/vue-router'
import WelcomePage from '../pages/WelcomePage.vue'
import UserInputPage from '../pages/UserInputPage.vue'
import SummaryPage from '../pages/SummaryPage.vue'
import HomePage from '../pages/HomePage.vue' // La schermata principale di tracking

const routes = [
  {
    path: '/',
    redirect: '/welcome', // La prima pagina che l'utente vedrà
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: WelcomePage,
  },
  {
    path: '/input-dati',
    name: 'UserInput',
    component: UserInputPage,
  },
  {
    path: '/riepilogo',
    name: 'Summary',
    component: SummaryPage,
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
