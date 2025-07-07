import { createRouter, createWebHistory } from '@ionic/vue-router'
import WelcomePage from '../pages/WelcomePage.vue'
import UserInputPage from '../pages/UserInputPage.vue'
import SummaryPage from '../pages/SummaryPage.vue'
import HomePage from '../pages/HomePage.vue'
import SelezionePasto from '../pages/SelezionePasto.vue'
import CercaOcreaPiatto from '../pages/CercaOcreaPiatto.vue'
import AggiuntaPiatto from '../pages/AggiuntaPiatto.vue'
import RicercaPiatto from '../pages/RicercaPiatto.vue'
import SchermataQuantPiattoScelto from '../pages/SchermataQuantPiattoScelto.vue'
import RiepilogoPiatto from '../pages/RiepilogoPiatto.vue'
import CalendarioPage from '../pages/CalendarioPage.vue'
import PiattiSalvatiPage from '../pages/PiattiSalvatiPage.vue'
import ImpostazioniPage from '../pages/ImpostazioniPage.vue'
// NUOVO: Pagina per visualizzare gli ingredienti
import IngredientsPage from '../pages/IngredientsPage.vue'
import ObiettiviAttivitaPage from '../pages/ObiettiviAttivitaPage.vue' // Corretto a ../pages/

const routes = [
  {
    path: '/',
    redirect: '/welcome',
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
  // Nuove rotte per l'aggiunta di piatti/cibi
  {
    path: '/select-meal',
    name: 'MealSelection',
    component: SelezionePasto,
  },
  {
    path: '/search-create-plate',
    name: 'SearchCreatePlate',
    component: CercaOcreaPiatto,
  },
  {
    path: '/add-plate-details',
    name: 'AddPlateDetails',
    component: AggiuntaPiatto,
  },
  {
    path: '/search-results',
    name: 'SearchResults',
    component: RicercaPiatto, // Questa rotta userà i query params (es. /search-results?q=pasta)
  },
  {
    path: '/enter-quantity',
    name: 'EnterQuantity',
    component: SchermataQuantPiattoScelto,
  },
  {
    path: '/food-summary',
    name: 'FoodSummary',
    component: RiepilogoPiatto,
  },
  {
    path: '/calendario',
    name: 'Calendario',
    component: CalendarioPage,
  },
  {
    path: '/piatti-salvati',
    name: 'PiattiSalvati',
    component: PiattiSalvatiPage,
  },
  {
    path: '/impostazioni',
    name: 'Impostazioni',
    component: ImpostazioniPage,
  },
  // NUOVA ROTTA: Pagina per gli ingredienti
  {
    path: '/ingredients/:dishId', // Usa un parametro di rotta per l'ID del piatto
    name: 'IngredientsPage',
    component: IngredientsPage,
    props: true, // Passa il parametro di rotta come prop al componente
  },
  {
    path: '/obiettivi-attivita',
    name: 'ObiettiviAttivita',
    component: ObiettiviAttivitaPage,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
