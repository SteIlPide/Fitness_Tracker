<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <template v-slot:start>
          <ion-buttons>
            <ion-back-button></ion-back-button>
          </ion-buttons>
        </template>
        <ion-title>Calendario</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding ion-text-center">
      <h1>Seleziona la data per visualizzare l'andamento di quel giorno</h1>

      <div class="calendar-container">
        <ion-datetime
          presentation="calendar"
          :value="selectedDate"
          @ionChange="onDateChange"
          :day-render="renderDay"
          :max="today"
          locale="it-IT"
        ></ion-datetime>
      </div>

      <ion-button expand="block" class="ion-margin-top" @click="goToSelectedDay"
        >Vai al giorno</ion-button
      >
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonDatetime,
  IonButton,
} from '@ionic/vue'

const router = useRouter()
const userStore = useUserStore()

// Data selezionata nel calendario (inizializzata a oggi)
const selectedDate = ref(new Date().toISOString())

// Data massima selezionabile (oggi)
const today = new Date().toISOString()

const onDateChange = (event) => {
  selectedDate.value = event.detail.value
  console.log('Data selezionata:', selectedDate.value)
}

const goToSelectedDay = () => {
  if (selectedDate.value) {
    const dateString = new Date(selectedDate.value).toISOString().slice(0, 10)
    // Carica i dati per la data selezionata nello store
    userStore.loadDailyData(dateString)
    router.push({ path: '/home', query: { date: dateString } })
  }
}

// Funzione per il rendering personalizzato dei giorni nel calendario
const renderDay = (day) => {
  const dateString = day.dayString // Formato YYYY-MM-DD
  const summary = userStore.getDailySummary(dateString)

  let classes = []
  if (summary && summary.targetKcal > 0) {
    const percentage = (summary.kcal / summary.targetKcal) * 100
    if (percentage >= 100) {
      classes.push('green-day-bg')
    } else if (percentage >= 90) {
      classes.push('orange-day-bg')
    } else {
      classes.push('red-day-bg')
    }
  }

  return {
    innerHTML: `<span>${day.day}</span>`, // Manteniamo lo span per il numero del giorno
    classes: classes, // Le classi verranno applicate all'elemento ::part(day)
  }
}
</script>

<style scoped>
/* Mantieni solo gli stili generali della pagina qui */
h1 {
  font-size: 1.1em;
  color: #333;
  margin-bottom: 20px;
}

.calendar-container {
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  margin: 0 auto;
  max-width: 400px;
}

ion-button {
  --border-radius: 10px;
  height: 48px;
  font-size: 1.05em;
  --background: #2196f3;
  --background-activated: #1976d2;
  --box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin-top: 30px;
}
</style>
