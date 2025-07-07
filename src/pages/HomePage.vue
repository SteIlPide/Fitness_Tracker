<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Data: {{ displayedDate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <!-- Sezione Riepilogo Calorie -->
      <ion-card class="calorie-summary-card">
        <ion-card-content>
          <ion-grid>
            <ion-row class="ion-align-items-center ion-justify-content-between">
              <ion-col size="4" class="ion-text-center">
                <div class="calorie-value">{{ currentDailyTotals.kcal.toFixed(0) }}</div>
                <div class="calorie-label">Mangiate</div>
              </ion-col>
              <ion-col size="4" class="ion-text-center">
                <div class="calorie-value remaining">{{ currentRemainingKcal.toFixed(0) }}</div>
                <div class="calorie-label">Rimanenti</div>
              </ion-col>
              <ion-col size="4" class="ion-text-center">
                <div class="calorie-value">{{ currentDailyBurnedKcal.toFixed(0) }}</div>
                <div class="calorie-label">Bruciate</div>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-card-content>
      </ion-card>

      <!-- Sezione Macronutrienti Totali -->
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
                  {{ currentDailyTotals.carbs.toFixed(1) }}/{{
                    currentDailyTargetKcal ? ((currentDailyTargetKcal * 0.5) / 4).toFixed(0) : 'N/A'
                  }}
                  g
                </div>
              </ion-col>
              <ion-col>
                <div class="macro-label">Proteine</div>
                <div class="macro-value">
                  {{ currentDailyTotals.proteins.toFixed(1) }}/{{
                    currentDailyTargetKcal ? ((currentDailyTargetKcal * 0.3) / 4).toFixed(0) : 'N/A'
                  }}
                  g
                </div>
              </ion-col>
              <ion-col>
                <div class="macro-label">Grassi</div>
                <div class="macro-value">
                  {{ currentDailyTotals.fats.toFixed(1) }}/{{
                    currentDailyTargetKcal ? ((currentDailyTargetKcal * 0.2) / 9).toFixed(0) : 'N/A'
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
            <!-- Colazione -->
            <ion-item class="meal-item">
              <div class="meal-icon-wrapper">
                <ion-icon :icon="cafeOutline"></ion-icon>
                <!-- Icona aggiornata -->
              </div>
              <ion-label>
                <h2>Colazione</h2>
                <p>{{ getMealKcalForDisplay('Colazione').toFixed(0) }} kcal</p>
              </ion-label>
              <ion-button v-if="isCurrentDay" fill="clear" @click="toggleMealMacros('Colazione')">
                <ion-icon
                  :icon="expandedMeal === 'Colazione' ? removeCircleOutline : addCircleOutline"
                ></ion-icon>
                <!-- Icone aggiornate -->
              </ion-button>
            </ion-item>
            <div v-if="expandedMeal === 'Colazione'" class="meal-macros-details">
              <ion-item lines="none">
                <ion-label>Carboidrati</ion-label>
                <ion-text>{{ getMealMacrosForDisplay('Colazione').carbs.toFixed(1) }} g</ion-text>
              </ion-item>
              <ion-item lines="none">
                <ion-label>Proteine</ion-label>
                <ion-text
                  >{{ getMealMacrosForDisplay('Colazione').proteins.toFixed(1) }} g</ion-text
                >
              </ion-item>
              <ion-item lines="none">
                <ion-label>Grassi</ion-label>
                <ion-text>{{ getMealMacrosForDisplay('Colazione').fats.toFixed(1) }} g</ion-text>
              </ion-item>
              <ion-button
                v-if="isCurrentDay"
                expand="block"
                fill="outline"
                size="small"
                @click="addFoodToMeal('Colazione')"
                >Aggiungi cibo</ion-button
              >
            </div>

            <!-- Pranzo -->
            <ion-item class="meal-item">
              <div class="meal-icon-wrapper">
                <ion-icon :icon="restaurantOutline"></ion-icon>
                <!-- Icona aggiornata -->
              </div>
              <ion-label>
                <h2>Pranzo</h2>
                <p>{{ getMealKcalForDisplay('Pranzo').toFixed(0) }} kcal</p>
              </ion-label>
              <ion-button v-if="isCurrentDay" fill="clear" @click="toggleMealMacros('Pranzo')">
                <ion-icon
                  :icon="expandedMeal === 'Pranzo' ? removeCircleOutline : addCircleOutline"
                ></ion-icon>
                <!-- Icone aggiornate -->
              </ion-button>
            </ion-item>
            <div v-if="expandedMeal === 'Pranzo'" class="meal-macros-details">
              <ion-item lines="none">
                <ion-label>Carboidrati</ion-label>
                <ion-text>{{ getMealMacrosForDisplay('Pranzo').carbs.toFixed(1) }} g</ion-text>
              </ion-item>
              <ion-item lines="none">
                <ion-label>Proteine</ion-label>
                <ion-text>{{ getMealMacrosForDisplay('Pranzo').proteins.toFixed(1) }} g</ion-text>
              </ion-item>
              <ion-item lines="none">
                <ion-label>Grassi</ion-label>
                <ion-text>{{ getMealMacrosForDisplay('Pranzo').fats.toFixed(1) }} g</ion-text>
              </ion-item>
              <ion-button
                v-if="isCurrentDay"
                expand="block"
                fill="outline"
                size="small"
                @click="addFoodToMeal('Pranzo')"
                >Aggiungi cibo</ion-button
              >
            </div>

            <!-- Cena -->
            <ion-item class="meal-item">
              <div class="meal-icon-wrapper">
                <ion-icon :icon="restaurantOutline"></ion-icon>
                <!-- Icona aggiornata -->
              </div>
              <ion-label>
                <h2>Cena</h2>
                <p>{{ getMealKcalForDisplay('Cena').toFixed(0) }} kcal</p>
              </ion-label>
              <ion-button v-if="isCurrentDay" fill="clear" @click="toggleMealMacros('Cena')">
                <ion-icon
                  :icon="expandedMeal === 'Cena' ? removeCircleOutline : addCircleOutline"
                ></ion-icon>
                <!-- Icone aggiornate -->
              </ion-button>
            </ion-item>
            <div v-if="expandedMeal === 'Cena'" class="meal-macros-details">
              <ion-item lines="none">
                <ion-label>Carboidrati</ion-label>
                <ion-text>{{ getMealMacrosForDisplay('Cena').carbs.toFixed(1) }} g</ion-text>
              </ion-item>
              <ion-item lines="none">
                <ion-label>Proteine</ion-label>
                <ion-text>{{ getMealMacrosForDisplay('Cena').proteins.toFixed(1) }} g</ion-text>
              </ion-item>
              <ion-item lines="none">
                <ion-label>Grassi</ion-label>
                <ion-text>{{ getMealMacrosForDisplay('Cena').fats.toFixed(1) }} g</ion-text>
              </ion-item>
              <ion-button
                v-if="isCurrentDay"
                expand="block"
                fill="outline"
                size="small"
                @click="addFoodToMeal('Cena')"
                >Aggiungi cibo</ion-button
              >
            </div>

            <!-- Spuntini -->
            <ion-item class="meal-item">
              <div class="meal-icon-wrapper">
                <ion-icon :icon="nutritionOutline"></ion-icon>
                <!-- Icona aggiornata -->
              </div>
              <ion-label>
                <h2>Spuntini</h2>
                <p>{{ getMealKcalForDisplay('Spuntino').toFixed(0) }} kcal</p>
              </ion-label>
              <ion-button v-if="isCurrentDay" fill="clear" @click="toggleMealMacros('Spuntino')">
                <ion-icon
                  :icon="expandedMeal === 'Spuntino' ? removeCircleOutline : addCircleOutline"
                ></ion-icon>
                <!-- Icone aggiornate -->
              </ion-button>
            </ion-item>
            <div v-if="expandedMeal === 'Spuntino'" class="meal-macros-details">
              <ion-item lines="none">
                <ion-label>Carboidrati</ion-label>
                <ion-text>{{ getMealMacrosForDisplay('Spuntino').carbs.toFixed(1) }} g</ion-text>
              </ion-item>
              <ion-item lines="none">
                <ion-label>Proteine</ion-label>
                <ion-text>{{ getMealMacrosForDisplay('Spuntino').proteins.toFixed(1) }} g</ion-text>
              </ion-item>
              <ion-item lines="none">
                <ion-label>Grassi</ion-label>
                <ion-text>{{ getMealMacrosForDisplay('Spuntino').fats.toFixed(1) }} g</ion-text>
              </ion-item>
              <ion-button
                v-if="isCurrentDay"
                expand="block"
                fill="outline"
                size="small"
                @click="addFoodToMeal('Spuntino')"
                >Aggiungi cibo</ion-button
              >
            </div>
          </ion-list>
          <!-- Se non ci sono pasti per il giorno selezionato -->
          <p v-if="!hasMealsForDisplay" class="ion-text-center ion-padding-top">
            Nessun pasto registrato per questo giorno.
          </p>
        </ion-card-content>
      </ion-card>

      <!-- Sezione Contatore Acqua (Mostra solo se è il giorno corrente) -->
      <ion-card class="water-tracker-card" v-if="isCurrentDay">
        <ion-card-header>
          <ion-card-title>Contatore di acqua</ion-card-title>
          <ion-card-subtitle>Obiettivo: {{ waterTracker.targetLiters }} L</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content class="ion-text-center">
          <div class="water-glasses">
            <div
              v-for="n in waterTracker.targetGlasses"
              :key="n"
              class="water-glass"
              :class="{ 'filled-glass': n <= waterTracker.currentGlasses }"
              @click="toggleWaterGlass(n)"
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6 7H18V21H6V7Z"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M5 7H19"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <rect
                  x="6"
                  :y="21 - 14 * (n <= waterTracker.currentGlasses ? 1 : 0)"
                  width="12"
                  :height="14 * (n <= waterTracker.currentGlasses ? 1 : 0)"
                  fill="currentColor"
                  class="water-fill-rect"
                />
              </svg>
            </div>
          </div>
          <p class="ion-text-center water-note">nota: 1 bicchiere = 250 ml</p>
        </ion-card-content>
      </ion-card>

      <!-- Bottoni Azione (Mostra solo se è il giorno corrente) -->
      <div class="action-buttons ion-padding-top" v-if="isCurrentDay">
        <ion-button expand="block" @click="addPlate">Aggiungi piatto</ion-button>
        <ion-button expand="block" color="tertiary" @click="suggestPlate"
          >Consiglia piatto</ion-button
        >
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
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
  IonCardContent,
  IonGrid,
  IonRow,
  IonCol,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonText,
} from '@ionic/vue'
// Importa le icone con il suffisso 'Outline' per maggiore compatibilità
import {
  addCircleOutline,
  removeCircleOutline,
  cafeOutline,
  restaurantOutline,
  nutritionOutline,
} from 'ionicons/icons'

const router = useRouter()
const route = useRoute()
const foodStore = useFoodStore()
const userStore = useUserStore()

const displayedDate = ref('')
const isCurrentDay = ref(true)

const currentDailyTotals = ref({ kcal: 0, carbs: 0, proteins: 0, fats: 0 })
const currentDailyTargetKcal = ref(2000)
const currentDailyBurnedKcal = ref(0)
const currentDailyLog = ref({ Colazione: [], Pranzo: [], Cena: [], Spuntino: [] })

const expandedMeal = ref(null)

const currentRemainingKcal = computed(() => {
  return currentDailyTargetKcal.value - currentDailyTotals.value.kcal + currentDailyBurnedKcal.value
})

const getMealKcalForDisplay = (mealType) => {
  return currentDailyLog.value[mealType]
    ? currentDailyLog.value[mealType].reduce((sum, entry) => sum + entry.kcal, 0)
    : 0
}

const getMealMacrosForDisplay = (mealType) => {
  if (isCurrentDay.value) {
    return userStore.getMealMacros(mealType)
  } else {
    console.log(`DEBUG: Richiesti macro per pasto storico: ${mealType}. Restituisco zeri.`)
    return { carbs: 0, proteins: 0, fats: 0 }
  }
}

const hasMealsForDisplay = computed(() => {
  return Object.values(currentDailyLog.value).some((mealArray) => mealArray.length > 0)
})

const loadDataForDate = (dateString) => {
  console.log(`DEBUG: Caricamento dati per la data: ${dateString}`)
  const todayString = new Date().toISOString().slice(0, 10)
  isCurrentDay.value = dateString === todayString

  if (isCurrentDay.value) {
    console.log('DEBUG: Caricamento dati per il giorno corrente.')
    displayedDate.value = new Date().toLocaleDateString('it-IT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
    currentDailyTotals.value = userStore.dailyTotals
    currentDailyTargetKcal.value = userStore.dailyTargetKcal
    currentDailyBurnedKcal.value = userStore.dailyBurnedKcal
    currentDailyLog.value = userStore.dailyLog
  } else {
    console.log('DEBUG: Caricamento dati per un giorno storico.')
    const historicalData = userStore.getDailySummary(dateString)
    if (historicalData) {
      console.log('DEBUG: Dati storici trovati:', historicalData)
      displayedDate.value = new Date(dateString).toLocaleDateString('it-IT', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
      currentDailyTotals.value = {
        kcal: historicalData.kcal || 0,
        carbs: historicalData.carbs || 0,
        proteins: historicalData.proteins || 0,
        fats: historicalData.fats || 0,
      }
      currentDailyTargetKcal.value = historicalData.targetKcal || 2000
      currentDailyBurnedKcal.value = historicalData.burnedKcal || 0
      currentDailyLog.value = { Colazione: [], Pranzo: [], Cena: [], Spuntino: [] }
    } else {
      console.log('DEBUG: Nessun dato storico trovato per questa data.')
      displayedDate.value = new Date(dateString).toLocaleDateString('it-IT', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
      })
      currentDailyTotals.value = { kcal: 0, carbs: 0, proteins: 0, fats: 0 }
      currentDailyTargetKcal.value = 2000
      currentDailyBurnedKcal.value = 0
      currentDailyLog.value = { Colazione: [], Pranzo: [], Cena: [], Spuntino: [] }
    }
  }
  expandedMeal.value = null
}

onMounted(() => {
  console.log('DEBUG: HomePage montata.')
  const dateParam = route.query.date
  if (dateParam) {
    loadDataForDate(dateParam)
  } else {
    loadDataForDate(userStore.currentDateString)
  }
})

watch(
  () => route.query.date,
  (newDate) => {
    console.log('DEBUG: Parametro data cambiato:', newDate)
    if (newDate) {
      loadDataForDate(newDate)
    } else {
      loadDataForDate(userStore.currentDateString)
    }
  },
  { immediate: true },
)

const waterTracker = ref({
  targetLiters: 2.5,
  glassSizeMl: 250,
  currentGlasses: 0,
  targetGlasses: computed(() =>
    Math.ceil((waterTracker.value.targetLiters * 1000) / waterTracker.value.glassSizeMl),
  ),
})

const addFoodToMeal = (mealType) => {
  console.log(`DEBUG: Navigazione per aggiungere cibo al pasto: ${mealType}`)
  foodStore.setSelectedMealType(mealType)
  router.push('/search-create-plate')
}

const addPlate = () => {
  console.log('DEBUG: Navigazione per aggiungere piatto (generico).')
  router.push('/select-meal')
}

const suggestPlate = () => {
  console.log('DEBUG: Consiglia piatto cliccato.')
}

const toggleWaterGlass = (glassNumber) => {
  if (isCurrentDay.value) {
    if (glassNumber <= waterTracker.value.currentGlasses) {
      waterTracker.value.currentGlasses = glassNumber - 1
    } else {
      waterTracker.value.currentGlasses = glassNumber
    }
    console.log(`DEBUG: Contatore acqua aggiornato a: ${waterTracker.value.currentGlasses}`)
  } else {
    console.log('DEBUG: Tentativo di modificare contatore acqua per giorno storico. Non permesso.')
  }
}

const toggleMealMacros = (mealType) => {
  console.log(`DEBUG: Toggle macro per pasto: ${mealType}. Stato attuale: ${expandedMeal.value}`)
  if (expandedMeal.value === mealType) {
    expandedMeal.value = null
    console.log(`DEBUG: Piatto ${mealType} collassato.`)
  } else {
    expandedMeal.value = mealType
    console.log(`DEBUG: Piatto ${mealType} espanso.`)
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
  display: flex;
  align-items: center;
}

.meal-icon-wrapper {
  margin-right: 10px;
  font-size: 1.8em;
  color: #555;
  display: flex;
  align-items: center;
}

.meal-item ion-label {
  flex-grow: 1;
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

/* Stili per i dettagli dei macronutrienti del pasto */
.meal-macros-details {
  background-color: #f0f0f0;
  border-radius: 0 0 10px 10px;
  margin-top: -10px;
  margin-bottom: 10px;
  padding: 10px 0;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.meal-macros-details ion-item {
  --background: transparent;
  --padding-start: 20px;
  --inner-padding-end: 16px;
  font-size: 0.95em;
  color: #555;
}

.meal-macros-details ion-item ion-label {
  font-weight: normal;
}

.meal-macros-details ion-item ion-text {
  font-weight: bold;
  color: #333;
}

.meal-macros-details ion-button {
  margin-top: 10px;
  margin-left: 20px;
  margin-right: 20px;
  --border-radius: 8px;
  height: 40px;
  font-size: 0.9em;
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

/* Stili per i bicchieri SVG */
.water-glass {
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.2s ease-in-out;
  position: relative;
}

.water-glass svg {
  width: 100%;
  height: 100%;
  color: #ccc;
  overflow: hidden;
}

.water-glass.filled-glass svg {
  color: #2196f3;
}

.water-glass svg .water-fill-rect {
  transition: all 0.3s ease-in-out;
  transform-origin: bottom;
}

.water-glass.filled-glass svg .water-fill-rect {
  fill: #2196f3;
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
</style>
