<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <template v-slot:start>
          <ion-buttons>
            <ion-back-button></ion-back-button>
          </ion-buttons>
        </template>
        <ion-title>Obiettivi e Attività</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-card class="info-card">
        <ion-card-content>
          <p>Monitora le tue attività e raggiungi i tuoi obiettivi giornalieri</p>
        </ion-card-content>
      </ion-card>

      <!-- Sezione Attività Fisica -->
      <ion-card class="activity-card">
        <ion-card-header>
          <ion-card-title>Attività fisica</ion-card-title>
          <!-- Pulsante Aggiungi Attività -->
          <ion-button fill="clear" class="add-button-in-header" @click="openAddActivityModal()">
            <ion-icon :icon="addCircleOutline"></ion-icon>
          </ion-button>
        </ion-card-header>
        <ion-card-content>
          <ion-list lines="none" v-if="userStore.physicalActivities.length > 0">
            <ion-item v-for="activity in userStore.physicalActivities" :key="activity.id">
              <ion-label>
                <h3>{{ activity.name }}</h3>
                <p>Tempo: {{ activity.durationMinutes }} min</p>
                <p>Bruciate: {{ activity.burnedKcal.toFixed(0) }} kcal</p>
              </ion-label>
              <template v-slot:end>
                <ion-buttons>
                  <ion-button fill="clear" @click="openAddActivityModal(activity)">
                    <ion-icon :icon="pencilOutline"></ion-icon>
                  </ion-button>
                  <ion-button fill="clear" color="danger" @click="confirmDeleteActivity(activity)">
                    <ion-icon :icon="trashOutline"></ion-icon>
                  </ion-button>
                </ion-buttons>
              </template>
            </ion-item>
          </ion-list>
          <p v-else class="ion-text-center">Nessuna attività registrata.</p>
        </ion-card-content>
      </ion-card>

      <!-- Sezione Obiettivo Calorico (Riepilogo e Link a Modifica) -->
      <ion-card class="goals-summary-card">
        <ion-card-header>
          <ion-card-title>Obiettivo calorico</ion-card-title>
          <!-- Pulsante per modificare gli obiettivi -->
          <ion-button fill="clear" class="add-button-in-header" @click="goToEditGoals()">
            <ion-icon :icon="pencilOutline"></ion-icon>
          </ion-button>
        </ion-card-header>
        <ion-card-content>
          <ion-item lines="none">
            <ion-label>Calorie mangiate:</ion-label>
            <ion-text
              >{{ userStore.dailyTotals.kcal.toFixed(0) }} /
              {{ userStore.dailyTargetKcal }} kcal</ion-text
            >
          </ion-item>
          <ion-item lines="none">
            <ion-label>Calorie bruciate:</ion-label>
            <ion-text>{{ userStore.dailyBurnedKcal.toFixed(0) }} kcal</ion-text>
          </ion-item>
          <ion-item lines="none">
            <ion-label>Rimanenti:</ion-label>
            <ion-text>{{ userStore.remainingKcal.toFixed(0) }} kcal</ion-text>
          </ion-item>
          <ion-item lines="none">
            <ion-label>Carboidrati:</ion-label>
            <ion-text
              >{{ userStore.dailyTotals.carbs.toFixed(1) }} /
              {{ userStore.dailyTargetCarbs }} g</ion-text
            >
          </ion-item>
          <ion-item lines="none">
            <ion-label>Proteine:</ion-label>
            <ion-text
              >{{ userStore.dailyTotals.proteins.toFixed(1) }} /
              {{ userStore.dailyTargetProteins }} g</ion-text
            >
          </ion-item>
          <ion-item lines="none">
            <ion-label>Grassi:</ion-label>
            <ion-text
              >{{ userStore.dailyTotals.fats.toFixed(1) }} /
              {{ userStore.dailyTargetFats }} g</ion-text
            >
          </ion-item>
        </ion-card-content>
      </ion-card>

      <!-- Sezione Tieni traccia del tuo peso -->
      <ion-card class="weight-card">
        <ion-card-header>
          <ion-card-title>Tieni traccia del tuo peso</ion-card-title>
          <!-- Pulsante Aggiungi Misurazione Peso -->
          <ion-button fill="clear" class="add-button-in-header" @click="openAddWeightModal()">
            <ion-icon :icon="addCircleOutline"></ion-icon>
          </ion-button>
        </ion-card-header>
        <ion-card-content>
          <ion-item lines="none">
            <ion-label>Peso obiettivo:</ion-label>
            <ion-text>{{ userStore.userData.pesoObiettivo || 'N/A' }} Kg</ion-text>
          </ion-item>
          <ion-list lines="none" v-if="userStore.weightMeasurements.length > 0">
            <ion-item v-for="measurement in userStore.weightMeasurements" :key="measurement.id">
              <ion-label>
                <h3>Data: {{ formatDate(measurement.date) }}</h3>
                <p>Peso: {{ measurement.weightKg.toFixed(1) }} kg</p>
              </ion-label>
              <template v-slot:end>
                <ion-buttons>
                  <ion-button fill="clear" @click="openAddWeightModal(measurement)">
                    <ion-icon :icon="pencilOutline"></ion-icon>
                  </ion-button>
                  <ion-button fill="clear" color="danger" @click="confirmDeleteWeight(measurement)">
                    <ion-icon :icon="trashOutline"></ion-icon>
                  </ion-button>
                </ion-buttons>
              </template>
            </ion-item>
          </ion-list>
          <p v-else class="ion-text-center">Nessuna misurazione del peso registrata.</p>
        </ion-card-content>
      </ion-card>

      <!-- Modale Aggiungi/Modifica Attività -->
      <ion-modal :is-open="showAddActivityModal" @didDismiss="showAddActivityModal = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ editingActivity ? 'Modifica Attività' : 'Aggiungi Attività' }}</ion-title>
            <template v-slot:end>
              <ion-buttons>
                <ion-button @click="showAddActivityModal = false">Annulla</ion-button>
              </ion-buttons>
            </template>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-item>
            <ion-label position="floating" for="activityType">Seleziona tipo di attività</ion-label>
            <ion-select
              id="activityType"
              v-model="currentActivity.name"
              placeholder="Scegli attività"
            >
              <ion-select-option
                v-for="type in activityTypes"
                :key="type.name"
                :value="type.name"
                >{{ type.name }}</ion-select-option
              >
            </ion-select>
          </ion-item>
          <ion-item>
            <ion-label position="floating" for="activityDuration"
              >Inserisci per quanto tempo (min)</ion-label
            >
            <ion-input
              id="activityDuration"
              type="number"
              v-model="currentActivity.durationMinutes"
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-label>Calorie Bruciate (stima):</ion-label>
            <ion-text>{{ estimatedBurnedKcal.toFixed(0) }} kcal</ion-text>
          </ion-item>
          <ion-button
            expand="block"
            class="ion-margin-top"
            @click="saveActivity"
            :disabled="!currentActivity.name || !currentActivity.durationMinutes"
            >Salva</ion-button
          >
        </ion-content>
      </ion-modal>

      <!-- Modale Aggiungi/Modifica Peso -->
      <ion-modal :is-open="showAddWeightModal" @didDismiss="showAddWeightModal = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{
              editingWeight ? 'Modifica Peso' : 'Aggiungi Misurazione Peso'
            }}</ion-title>
            <template v-slot:end>
              <ion-buttons>
                <ion-button @click="showAddWeightModal = false">Annulla</ion-button>
              </ion-buttons>
            </template>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-item>
            <ion-label position="floating" for="weightDate">Data della misurazione</ion-label>
            <ion-datetime-button id="weightDate" datetime="weightDatetime"></ion-datetime-button>
            <ion-modal :keep-contents-mounted="true">
              <ion-datetime
                id="weightDatetime"
                v-model="currentWeight.date"
                presentation="date"
              ></ion-datetime>
            </ion-modal>
          </ion-item>
          <ion-item>
            <ion-label position="floating" for="weightKg">Inserisci il peso (kg)</ion-label>
            <ion-input id="weightKg" type="number" v-model="currentWeight.weightKg"></ion-input>
          </ion-item>
          <ion-button
            expand="block"
            class="ion-margin-top"
            @click="saveWeight"
            :disabled="!currentWeight.date || !currentWeight.weightKg"
            >Salva</ion-button
          >
        </ion-content>
      </ion-modal>

      <!-- Modale di conferma eliminazione attività -->
      <ion-modal
        :is-open="showDeleteActivityConfirm"
        @didDismiss="showDeleteActivityConfirm = false"
      >
        <ion-header>
          <ion-toolbar>
            <ion-title>Conferma Eliminazione</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding ion-text-center">
          <p>Sei sicuro di voler eliminare l'attività "{{ activityToDelete?.name }}"?</p>
          <ion-button color="danger" @click="deleteActivity">Sì, elimina</ion-button>
          <ion-button fill="outline" @click="showDeleteActivityConfirm = false"
            >No, annulla</ion-button
          >
        </ion-content>
      </ion-modal>

      <!-- Modale di conferma eliminazione peso -->
      <ion-modal :is-open="showDeleteWeightConfirm" @didDismiss="showDeleteWeightConfirm = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>Conferma Eliminazione</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding ion-text-center">
          <p>
            Sei sicuro di voler eliminare la misurazione del peso del
            {{ formatDate(weightToDelete?.date) }}?
          </p>
          <ion-button color="danger" @click="deleteWeight">Sì, elimina</ion-button>
          <ion-button fill="outline" @click="showDeleteWeightConfirm = false"
            >No, annulla</ion-button
          >
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
import { useUserStore } from '../stores/user'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonText,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonDatetimeButton,
  IonDatetime,
} from '@ionic/vue'
import { addCircleOutline, pencilOutline, trashOutline } from 'ionicons/icons'

const userStore = useUserStore()

// --- Stato per Attività Fisica ---
const showAddActivityModal = ref(false)
const editingActivity = ref(null)
const currentActivity = ref({
  id: null,
  name: '',
  durationMinutes: null,
  burnedKcal: 0,
})
const activityToDelete = ref(null)
const showDeleteActivityConfirm = ref(false)

const activityTypes = ref([
  { name: 'Corsa', mets: 9 },
  { name: 'Pesi', mets: 5 },
  { name: 'Camminata', mets: 3 },
  { name: 'Nuoto', mets: 7 },
  { name: 'Ciclismo', mets: 6 },
  { name: 'Yoga', mets: 2.5 },
])

const estimatedBurnedKcal = computed(() => {
  const selectedType = activityTypes.value.find((type) => type.name === currentActivity.value.name)
  if (selectedType && currentActivity.value.durationMinutes && userStore.userData.peso) {
    const kcal =
      ((selectedType.mets * 3.5 * userStore.userData.peso) / 200) *
      currentActivity.value.durationMinutes
    return kcal
  }
  return 0
})

const openAddActivityModal = (activity = null) => {
  if (activity) {
    editingActivity.value = activity
    currentActivity.value = { ...activity }
  } else {
    editingActivity.value = null
    currentActivity.value = { id: null, name: '', durationMinutes: null, burnedKcal: 0 }
  }
  showAddActivityModal.value = true
}

const saveActivity = () => {
  currentActivity.value.burnedKcal = estimatedBurnedKcal.value
  if (editingActivity.value) {
    userStore.updatePhysicalActivity(currentActivity.value)
  } else {
    userStore.addPhysicalActivity(currentActivity.value)
  }
  const totalBurned = userStore.physicalActivities.reduce((sum, act) => sum + act.burnedKcal, 0)
  userStore.setDailyBurnedKcal(totalBurned)

  showAddActivityModal.value = false
}

const confirmDeleteActivity = (activity) => {
  activityToDelete.value = activity
  showDeleteActivityConfirm.value = true
}

const deleteActivity = () => {
  if (activityToDelete.value) {
    userStore.deletePhysicalActivity(activityToDelete.value.id)
    const totalBurned = userStore.physicalActivities.reduce((sum, act) => sum + act.burnedKcal, 0)
    userStore.setDailyBurnedKcal(totalBurned)
  }
  showDeleteActivityConfirm.value = false
  activityToDelete.value = null
}

// --- Stato per Misurazioni Peso ---
const showAddWeightModal = ref(false)
const editingWeight = ref(null)
const currentWeight = ref({
  id: null,
  date: new Date().toISOString(),
  weightKg: null,
})
const weightToDelete = ref(null)
const showDeleteWeightConfirm = ref(false)

const openAddWeightModal = (measurement = null) => {
  if (measurement) {
    editingWeight.value = measurement
    currentWeight.value = { ...measurement }
  } else {
    editingWeight.value = null
    currentWeight.value = { id: null, date: new Date().toISOString(), weightKg: null }
  }
  showAddWeightModal.value = true
}

const saveWeight = () => {
  const weightValue = parseFloat(currentWeight.value.weightKg)

  if (isNaN(weightValue) || weightValue <= 0) {
    console.error('Per favore, inserisci un peso valido.')
    return
  }

  currentWeight.value.weightKg = weightValue

  if (editingWeight.value) {
    userStore.updateWeightMeasurement(currentWeight.value)
  } else {
    userStore.addWeightMeasurement(currentWeight.value)
  }
  showAddWeightModal.value = false
}

const confirmDeleteWeight = (measurement) => {
  weightToDelete.value = measurement
  showDeleteWeightConfirm.value = true
}

const deleteWeight = () => {
  if (weightToDelete.value) {
    userStore.deleteWeightMeasurement(weightToDelete.value.id)
  }
  showDeleteWeightConfirm.value = false
  weightToDelete.value = null
}

// --- Funzioni Utilità ---
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: '2-digit' })
}

const goToEditGoals = () => {
  router.push('/obiettivi')
}
</script>

<style scoped>
ion-toolbar {
  --background: #f8f8f8;
  --color: #333;
}

ion-title {
  font-size: 1.2em;
  font-weight: bold;
}

.info-card {
  margin-top: 15px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  background-color: #e0f7fa;
  color: #00796b;
}

.info-card ion-card-content {
  font-size: 0.95em;
  text-align: center;
}

ion-card {
  margin-top: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
}

ion-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  --background: #f0f0f0;
  border-bottom: 1px solid #eee;
  border-radius: 15px 15px 0 0;
  padding-right: 10px;
}

ion-card-title {
  font-size: 1.3em;
  color: #333;
  flex-grow: 1;
}

/* NUOVO STILE: Per i pulsanti "Aggiungi" e "Modifica" nelle intestazioni delle card */
.add-button-in-header {
  --padding-start: 0;
  --padding-end: 0;
  --min-width: 36px; /* Rendi il pulsante più piccolo */
  --min-height: 36px; /* Rendi il pulsante più piccolo */
  width: 36px; /* Forza la larghezza */
  height: 36px; /* Forza l'altezza */
  border-radius: 50%; /* Rendi il pulsante rotondo */
  background-color: #2196f3; /* Sfondo blu per il cerchio */
  color: white; /* Colore dell'icona bianca */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2); /* Ombra leggera */
  display: flex;
  justify-content: center;
  align-items: center;
  /* Rimuovi font-size dal pulsante, lo applichiamo all'icona */
}

.add-button-in-header ion-icon {
  font-size: 1.5em; /* Dimensione dell'icona all'interno del pulsante */
  color: white; /* Assicura che l'icona sia bianca */
}

ion-list {
  background: none;
}

ion-item {
  margin-bottom: 8px;
  --background: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

ion-item h3 {
  font-size: 1.05em;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

ion-item p {
  font-size: 0.9em;
  color: #666;
}

ion-buttons[slot='end'] ion-button {
  --padding-start: 5px;
  --padding-end: 5px;
  font-size: 1.2em;
}

ion-button {
  --border-radius: 10px;
  height: 48px;
  font-size: 1.05em;
  --background: #2196f3;
  --background-activated: #1976d2;
  --box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

ion-button[fill='outline'] {
  --background: transparent;
  --border-color: #2196f3;
  --color: #2196f3;
}

ion-button[color='danger'] {
  --background: #f44336;
  --background-activated: #d32f2f;
}

.goals-summary-card ion-card-content ion-item {
  --background: transparent;
  font-size: 1em;
  color: #555;
  margin-bottom: 0;
  box-shadow: none;
}

.goals-summary-card ion-card-content ion-item ion-label {
  font-weight: bold;
  color: #333;
}

.goals-summary-card ion-card-content ion-item ion-text {
  font-weight: normal;
  color: #555;
}

ion-modal ion-toolbar {
  --background: #f0f0f0;
  --color: #333;
}

ion-modal ion-title {
  font-size: 1.1em;
}

ion-modal ion-item {
  margin-bottom: 15px;
}
</style>
