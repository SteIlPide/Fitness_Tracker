<template>
  <ion-app :class="{ 'has-footer': showFooter }">
    <!-- ion-router-outlet renderà il contenuto della pagina corrente -->
    <ion-router-outlet />

    <!-- Menu di Navigazione Personalizzato (Globale e Condizionale) -->
    <div class="custom-footer-menu" v-if="showFooter">
      <!-- Elemento per Obiettivi e Attività -->
      <div
        class="menu-item"
        :class="{ active: $route.path === '/obiettivi-attivita' }"
        @click="router.push('/obiettivi-attivita')"
      >
        <img src="https://placehold.co/24x24/000000/ffffff?text=🏋️" alt="Obiettivi" />
        <span>Obiettivi</span>
      </div>
      <div
        class="menu-item"
        :class="{ active: $route.path === '/calendario' }"
        @click="router.push('/calendario')"
      >
        <img src="https://placehold.co/24x24/000000/ffffff?text=📅" alt="Calendario" />
        <span>Calendario</span>
      </div>
      <div
        class="menu-item"
        :class="{ active: $route.path === '/home' }"
        @click="router.push('/home')"
      >
        <img src="https://placehold.co/24x24/000000/ffffff?text=🏠" alt="Home" />
        <span>Home</span>
      </div>
      <div
        class="menu-item"
        :class="{ active: $route.path === '/piatti-salvati' }"
        @click="router.push('/piatti-salvati')"
      >
        <img src="https://placehold.co/24x24/000000/ffffff?text=🍽️" alt="Piatti Salvati" />
        <span>Piatti Salvati</span>
      </div>
      <div
        class="menu-item"
        :class="{ active: $route.path === '/impostazioni' }"
        @click="router.push('/impostazioni')"
      >
        <img src="https://placehold.co/24x24/000000/ffffff?text=⚙️" alt="Impostazioni" />
        <span>Impostazioni</span>
      </div>
    </div>
  </ion-app>
</template>

<script setup>
import { IonApp, IonRouterOutlet } from '@ionic/vue'
import { useRouter, useRoute } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()

// Definisci le rotte in cui il footer DEVE essere visibile
const routesWithFooter = [
  '/home',
  '/calendario',
  '/obiettivi-attivita',
  '/piatti-salvati',
  '/impostazioni',
  '/select-meal',
  '/search-create-plate',
  '/add-plate-details',
  '/search-results',
  '/enter-quantity',
  '/food-summary',
]

// Computed property per determinare se mostrare il footer
const showFooter = computed(() => {
  return routesWithFooter.includes(route.path)
})
</script>

<style>
/* Stili per il menu personalizzato (FINALIZZATI) */
.custom-footer-menu {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 70px; /* Altezza fissa del menu */
  background-color: #ffffff; /* Sfondo bianco */
  border-top: 1px solid #eee; /* Bordo superiore */
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05); /* Ombra leggera */
  display: flex;
  justify-content: space-around;
  align-items: center;
  z-index: 100;
  border-radius: 15px 15px 0 0; /* Angoli arrotondati in alto */
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5px;
  cursor: pointer;
  color: #333; /* Colore testo default (nero) */
  font-size: 0.75em;
  font-weight: bold;
  transition: all 0.2s ease-in-out;
  min-width: 60px; /* Larghezza minima per ogni elemento */
}

.menu-item img {
  width: 24px;
  height: 24px;
  margin-bottom: 3px;
  filter: none; /* Rimuove qualsiasi filtro per le icone predefinite */
}

.menu-item.active {
  background-color: #e0e0e0; /* Sfondo grigio per elemento attivo */
  border-radius: 50%;
  width: 60px;
  height: 60px;
  position: relative;
  top: -5px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  color: #333; /* Colore testo attivo (nero) */
}

.menu-item.active img {
  filter: none;
}

.menu-item.active span {
  color: #333;
}

/* Stile globale per tutti gli ion-content che necessitano di padding per il footer fisso */
/* Questo stile viene applicato solo se il footer è visibile */
ion-content {
  --padding-bottom: var(--ion-safe-area-bottom, 0px); /* Reset default per le pagine senza footer */
}

/* Se il footer è visibile, aggiungi il padding */
ion-app.has-footer ion-content {
  --padding-bottom: 90px; /* Altezza del footer (70px) + un po' di margine extra */
}
</style>
