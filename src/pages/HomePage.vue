<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Data: {{ todayDate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <!-- AGGIUNTA CLASSE: ion-content-with-footer -->
    <ion-content :fullscreen="true" class="ion-padding ion-content-with-footer">
      <!-- Sezione Riepilogo Calorie -->
      <ion-card class="calorie-summary-card">
        <ion-card-content>
          <ion-grid>
            <ion-row class="ion-align-items-center ion-justify-content-between">
              <ion-col size="4" class="ion-text-center">
                <div class="calorie-value">{{ userStore.dailyTotals.kcal.toFixed(0) }}</div>
                <div class="calorie-label">Mangiate</div>
              </ion-col>
              <ion-col size="4" class="ion-text-center">
                <div class="calorie-value remaining">{{ userStore.remainingKcal.toFixed(0) }}</div>
                <div class="calorie-label">Rimanenti</div>
              </ion-col>
              <ion-col size="4" class="ion-text-center">
                <div class="calorie-value">{{ userStore.dailyBurnedKcal.toFixed(0) }}</div>
                <div class="calorie-label">Bruciate</div>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-card-content>
      </ion-card>

      <!-- Sezione Macronutrienti -->
      <ion-card class="macronutrients-card">
        <ion-card-header>
          <ion-card-title>Macronutrienti</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-grid>
            <ion-row class="ion-text-center">
              <ion-col>
                <div class="macro-label">Carboidrati</div>
                <div class="macro-value">
                  {{ userStore.dailyTotals.carbs.toFixed(1) }}/{{
                    userStore.dailyTargetKcal
                      ? ((userStore.dailyTargetKcal * 0.5) / 4).toFixed(0)
                      : 'N/A'
                  }}
                  g
                </div>
              </ion-col>
              <ion-col>
                <div class="macro-label">Proteine</div>
                <div class="macro-value">
                  {{ userStore.dailyTotals.proteins.toFixed(1) }}/{{
                    userStore.dailyTargetKcal
                      ? ((userStore.dailyTargetKcal * 0.3) / 4).toFixed(0)
                      : 'N/A'
                  }}
                  g
                </div>
              </ion-col>
              <ion-col>
                <div class="macro-label">Grassi</div>
                <div class="macro-value">
                  {{ userStore.dailyTotals.fats.toFixed(1) }}/{{
                    userStore.dailyTargetKcal
                      ? ((userStore.dailyTargetKcal * 0.2) / 9).toFixed(0)
                      : 'N/A'
                  }}
                  g
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-card-content>
      </ion-card>

      <!-- Sezione Pasti -->
      <ion-card class="meals-card">
        <ion-card-header>
          <ion-card-title>Pasti</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list lines="none">
            <ion-item class="meal-item">
              <ion-label>
                <h2>Colazione</h2>
                <p>{{ userStore.getMealKcal('Colazione').toFixed(0) }} kcal</p>
              </ion-label>
              <ion-button fill="clear" @click="addFood('Colazione')">
                <ion-icon :icon="addCircle"></ion-icon>
              </ion-button>
            </ion-item>
            <ion-item class="meal-item">
              <ion-label>
                <h2>Pranzo</h2>
                <p>{{ userStore.getMealKcal('Pranzo').toFixed(0) }} kcal</p>
              </ion-label>
              <ion-button fill="clear" @click="addFood('Pranzo')">
                <ion-icon :icon="addCircle"></ion-icon>
              </ion-button>
            </ion-item>
            <ion-item class="meal-item">
              <ion-label>
                <h2>Cena</h2>
                <p>{{ userStore.getMealKcal('Cena').toFixed(0) }} kcal</p>
              </ion-label>
              <ion-button fill="clear" @click="addFood('Cena')">
                <ion-icon :icon="addCircle"></ion-icon>
              </ion-button>
            </ion-item>
            <ion-item class="meal-item">
              <ion-label>
                <h2>Spuntini</h2>
                <p>{{ userStore.getMealKcal('Spuntino').toFixed(0) }} kcal</p>
              </ion-label>
              <ion-button fill="clear" @click="addFood('Spuntino')">
                <ion-icon :icon="addCircle"></ion-icon>
              </ion-button>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

      <!-- Sezione Contatore Acqua -->
      <ion-card class="water-tracker-card">
        <ion-card-header>
          <ion-card-title>Contatore di acqua</ion-card-title>
          <ion-card-subtitle>Obiettivo: {{ waterTracker.targetLiters }} L</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content class="ion-text-center">
          <div class="water-glasses">
            <ion-icon
              v-for="n in waterTracker.targetGlasses"
              :key="n"
              :icon="water"
              :class="{ 'filled-glass': n <= waterTracker.currentGlasses }"
              @click="toggleWaterGlass(n)"
            ></ion-icon>
          </div>
          <p class="ion-text-center water-note">nota: 1 bicchiere = 250 ml</p>
        </ion-card-content>
      </ion-card>

      <!-- Bottoni Azione -->
      <div class="action-buttons ion-padding-top">
        <ion-button expand="block" @click="addPlate">Aggiungi piatto</ion-button>
        <ion-button expand="block" color="tertiary" @click="suggestPlate"
          >Consiglia piatto</ion-button
        >
      </div>
    </ion-content>

    <!-- Menu di Navigazione Personalizzato -->
    <div class="custom-footer-menu">
      <div
        class="menu-item"
        :class="{ active: $route.path === '/obiettivi' }"
        @click="router.push('/obiettivi')"
      >
        <img src="https://placehold.co/24x24/000000/ffffff?text=🎯" alt="Obiettivi" />
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
  </ion-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFoodStore } from '../stores/food'
import { useUserStore } from '../stores/user'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  // Rimosso IonFooter, IonTabs, IonTabBar, IonTabButton, IonRouterOutlet
} from '@ionic/vue'
import { addCircle, water } from 'ionicons/icons' // Le icone per il tab bar non sono più necessarie qui

const router = useRouter()
// eslint-disable-next-line no-unused-vars
const route = useRoute()
const foodStore = useFoodStore()
const userStore = useUserStore()

const todayDate = computed(() => {
  const date = new Date()
  return date.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })
})

const waterTracker = ref({
  targetLiters: 2.5,
  glassSizeMl: 250,
  currentGlasses: 3,
  targetGlasses: computed(() =>
    Math.ceil((waterTracker.value.targetLiters * 1000) / waterTracker.value.glassSizeMl),
  ),
})

const addFood = (mealType) => {
  foodStore.setSelectedMealType(mealType)
  router.push('/search-create-plate')
}

const addPlate = () => {
  router.push('/select-meal')
}

const suggestPlate = () => {
  console.log('Consiglia piatto')
}

const toggleWaterGlass = (glassNumber) => {
  if (glassNumber <= waterTracker.value.currentGlasses) {
    waterTracker.value.currentGlasses = glassNumber - 1
  } else {
    waterTracker.value.currentGlasses = glassNumber
  }
}
</script>

<style scoped>
ion-header ion-toolbar {
  --background: #f8f8f8;
  --color: #333;
}

ion-title {
  font-size: 1.2em;
  font-weight: bold;
}

/* Card Generiche */
ion-card {
  margin-top: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

ion-card-header {
  --background: #f0f0f0;
  border-bottom: 1px solid #eee;
  border-radius: 15px 15px 0 0;
}

ion-card-title {
  font-size: 1.3em;
  color: #333;
}

/* Calorie Summary Card */
.calorie-summary-card {
  background: linear-gradient(135deg, #a8e063, #56ab2f);
  color: white;
}

.calorie-summary-card ion-card-content {
  padding: 15px;
}

.calorie-value {
  font-size: 2.2em;
  font-weight: bold;
  margin-bottom: 5px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.calorie-value.remaining {
  color: #ffeb3b;
}

.calorie-label {
  font-size: 0.9em;
  opacity: 0.8;
}

/* Macronutrients Card */
.macronutrients-card ion-card-content {
  padding: 15px;
}

.macro-label {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 5px;
}

.macro-value {
  font-size: 1.1em;
  font-weight: bold;
  color: #333;
}

/* Meals Card */
.meals-card ion-list {
  background: none;
}

.meal-item {
  --border-radius: 10px;
  --background: #f9f9f9;
  margin-bottom: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  padding-right: 10px;
}

.meal-item h2 {
  font-size: 1.1em;
  font-weight: bold;
  color: #333;
}

.meal-item p {
  font-size: 0.9em;
  color: #666;
}

.meal-item ion-button {
  --padding-end: 0;
  --padding-start: 0;
  font-size: 1.8em;
  color: #2196f3;
}

/* Water Tracker Card */
.water-tracker-card ion-card-subtitle {
  color: #555;
  font-size: 0.9em;
}

.water-glasses {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 15px;
  margin-bottom: 10px;
}

.water-glasses ion-icon {
  font-size: 3em;
  color: #ccc;
  transition: color 0.2s ease-in-out;
  cursor: pointer;
}

.water-glasses ion-icon.filled-glass {
  color: #2196f3;
}

.water-note {
  font-size: 0.8em;
  color: #888;
}

/* Action Buttons */
.action-buttons ion-button {
  --border-radius: 10px;
  height: 50px;
  font-size: 1.1em;
  margin-bottom: 15px;
  --box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

ion-button[color='tertiary'] {
  --background: #ff9800;
  --background-activated: #fb8c00;
  --color: white;
}

/* Stili per il menu personalizzato */
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

  /* Rimuovi gli stili di debug per il footer se non servono più */
  /* background-color: #ff0000 !important; */
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

  /* Rimuovi gli stili di debug per i pulsanti se non servono più */
  /* border: 2px solid green !important; */
  /* background-color: yellow !important; */
  /* min-height: 60px !important; */
}

.menu-item img {
  width: 24px;
  height: 24px;
  margin-bottom: 3px;
  filter: none; /* Rimuove qualsiasi filtro per le icone predefinite */

  /* Rimuovi gli stili di debug per le icone se non servono più */
  /* filter: invert(0%) sepia(100%) saturate(7460%) hue-rotate(240deg) brightness(90%) contrast(100%) !important; */
}
/*
.menu-item span {
   Rimuovi gli stili di debug per il testo se non servono più
   color: purple !important;
}
*/
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

/* NUOVO STILE: Padding inferiore per ion-content per evitare sovrapposizioni */
ion-content.ion-content-with-footer {
  --padding-bottom: 90px; /* Altezza del footer (70px) + un po' di margine extra */
}
</style>
