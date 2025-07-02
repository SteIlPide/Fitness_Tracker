<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Data: {{ todayDate }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <!-- Sezione Riepilogo Calorie -->
      <ion-card class="calorie-summary-card">
        <ion-card-content>
          <ion-grid>
            <ion-row class="ion-align-items-center ion-justify-content-between">
              <ion-col size="4" class="ion-text-center">
                <div class="calorie-value">{{ calories.eaten }}</div>
                <div class="calorie-label">Mangiate</div>
              </ion-col>
              <ion-col size="4" class="ion-text-center">
                <div class="calorie-value remaining">{{ calories.remaining }}</div>
                <div class="calorie-label">Rimanenti</div>
              </ion-col>
              <ion-col size="4" class="ion-text-center">
                <div class="calorie-value">{{ calories.burned }}</div>
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
                <div class="macro-value">{{ macros.carbs.eaten }}/{{ macros.carbs.total }} g</div>
              </ion-col>
              <ion-col>
                <div class="macro-label">Proteine</div>
                <div class="macro-value">
                  {{ macros.proteins.eaten }}/{{ macros.proteins.total }} g
                </div>
              </ion-col>
              <ion-col>
                <div class="macro-label">Grassi</div>
                <div class="macro-value">{{ macros.fats.eaten }}/{{ macros.fats.total }} g</div>
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
                <p>{{ meals.colazione }} kcal</p>
              </ion-label>
              <ion-button fill="clear" @click="addFood('colazione')">
                <ion-icon :icon="addCircle"></ion-icon>
              </ion-button>
            </ion-item>
            <ion-item class="meal-item">
              <ion-label>
                <h2>Pranzo</h2>
                <p>{{ meals.pranzo }} kcal</p>
              </ion-label>
              <ion-button fill="clear" @click="addFood('pranzo')">
                <ion-icon :icon="addCircle"></ion-icon>
              </ion-button>
            </ion-item>
            <ion-item class="meal-item">
              <ion-label>
                <h2>Cena</h2>
                <p>{{ meals.cena }} kcal</p>
              </ion-label>
              <ion-button fill="clear" @click="addFood('cena')">
                <ion-icon :icon="addCircle"></ion-icon>
              </ion-button>
            </ion-item>
            <ion-item class="meal-item">
              <ion-label>
                <h2>Spuntini</h2>
                <p>{{ meals.spuntini }} kcal</p>
              </ion-label>
              <ion-button fill="clear" @click="addFood('spuntini')">
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

    <!-- Tab Bar di Navigazione -->
    <ion-footer>
      <ion-toolbar>
        <ion-tabs>
          <ion-router-outlet></ion-router-outlet>
          <template v-slot:bottom>
            <ion-tab-bar>
              <ion-tab-button tab="obiettivi" href="/obiettivi">
                <ion-icon :icon="flag"></ion-icon>
                <ion-label>Obiettivi</ion-label>
              </ion-tab-button>

              <ion-tab-button tab="calendario" href="/calendario">
                <ion-icon :icon="calendar"></ion-icon>
                <ion-label>Calendario</ion-label>
              </ion-tab-button>

              <ion-tab-button tab="home" href="/home">
                <ion-icon :icon="home"></ion-icon>
                <ion-label>Home</ion-label>
              </ion-tab-button>

              <ion-tab-button tab="piatti-salvati" href="/piatti-salvati">
                <ion-icon :icon="bookmark"></ion-icon>
                <ion-label>Piatti Salvati</ion-label>
              </ion-tab-button>

              <ion-tab-button tab="impostazioni" href="/impostazioni">
                <ion-icon :icon="settings"></ion-icon>
                <ion-label>Impostazioni</ion-label>
              </ion-tab-button>
            </ion-tab-bar>
          </template>
        </ion-tabs>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script setup>
import { ref, computed } from 'vue'
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
  IonFooter,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonRouterOutlet,
} from '@ionic/vue'
import { addCircle, water, flag, calendar, home, bookmark, settings } from 'ionicons/icons'

// Dati di esempio per la dashboard
const todayDate = computed(() => {
  const date = new Date()
  return date.toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long' })
})

const calories = ref({
  eaten: 1200,
  remaining: 800, // Questo dovrebbe essere calcolato (target - eaten + burned)
  burned: 200,
})

const macros = ref({
  carbs: { eaten: 150, total: 250 },
  proteins: { eaten: 80, total: 120 },
  fats: { eaten: 40, total: 70 },
})

const meals = ref({
  colazione: 300,
  pranzo: 600,
  cena: 500,
  spuntini: 100,
})

const waterTracker = ref({
  targetLiters: 2.5,
  glassSizeMl: 250,
  currentGlasses: 3, // Numero di bicchieri d'acqua bevuti
  targetGlasses: computed(() =>
    Math.ceil((waterTracker.value.targetLiters * 1000) / waterTracker.value.glassSizeMl),
  ),
})

// Logica per aggiungere cibo a un pasto (da implementare con una modale/nuova pagina)
const addFood = (mealType) => {
  console.log(`Aggiungi cibo a: ${mealType}`)
  // Qui si aprirebbe una modale o si navigerebbe a una pagina di ricerca/aggiunta cibo
}

// Logica per aggiungere un piatto (generico)
const addPlate = () => {
  console.log('Aggiungi piatto')
  // Naviga a una pagina per aggiungere un piatto completo
}

// Logica per suggerire un piatto (da implementare)
const suggestPlate = () => {
  console.log('Consiglia piatto')
  // Attiva una logica per suggerire un piatto basato sui dati dell'utente/calorie rimanenti
}

// Logica per il contatore dell'acqua
const toggleWaterGlass = (glassNumber) => {
  if (glassNumber <= waterTracker.value.currentGlasses) {
    // Se clicco su un bicchiere già "pieno" o uno precedente, lo deseleziono e tutti i successivi
    waterTracker.value.currentGlasses = glassNumber - 1
  } else {
    // Se clicco su un bicchiere "vuoto", lo riempio e tutti i precedenti
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
  background: linear-gradient(135deg, #a8e063, #56ab2f); /* Sfumatura verde */
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
  color: #ffeb3b; /* Giallo brillante per le calorie rimanenti */
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
  padding-right: 10px; /* Spazio per l'icona */
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
  color: #2196f3; /* Blu per l'icona aggiungi */
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
  font-size: 3em; /* Dimensione dell'icona del bicchiere */
  color: #ccc; /* Colore del bicchiere vuoto */
  transition: color 0.2s ease-in-out;
  cursor: pointer;
}

.water-glasses ion-icon.filled-glass {
  color: #2196f3; /* Colore del bicchiere pieno */
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
  --background: #ff9800; /* Arancione per "Consiglia piatto" */
  --background-activated: #fb8c00;
  --color: white;
}

/* Footer Tab Bar */
ion-tab-bar {
  --background: #f8f8f8;
  border-top: 1px solid #eee;
  border-radius: 15px 15px 0 0; /* Angoli arrotondati in alto */
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

ion-tab-button {
  --color: #888;
  --color-selected: #2196f3; /* Blu per l'icona selezionata */
}

ion-tab-button ion-icon {
  font-size: 1.6em;
}

ion-tab-button ion-label {
  font-size: 0.7em;
}
</style>
