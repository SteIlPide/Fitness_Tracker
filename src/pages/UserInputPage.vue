<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Inserisci i seguenti dati:</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <form @submit.prevent="saveUserData">
        <!-- Sesso -->
        <ion-list-header>
          <ion-label>Sesso:</ion-label>
        </ion-list-header>
        <ion-radio-group v-model="userData.sesso">
          <ion-item>
            <ion-label>M</ion-label>
            <ion-radio value="M"></ion-radio>
          </ion-item>
          <ion-item>
            <ion-label>F</ion-label>
            <ion-radio value="F"></ion-radio>
          </ion-item>
        </ion-radio-group>

        <!-- Altezza -->
        <ion-item class="ion-margin-top">
          <ion-label position="stacked">Altezza (cm):</ion-label>
          <ion-input type="number" v-model="userData.altezza" placeholder="Es. 175"></ion-input>
        </ion-item>

        <!-- Età -->
        <ion-item class="ion-margin-top">
          <ion-label position="stacked">Età:</ion-label>
          <ion-input type="number" v-model="userData.eta" placeholder="Es. 30"></ion-input>
        </ion-item>

        <!-- Peso -->
        <ion-item class="ion-margin-top">
          <ion-label position="stacked">Peso (kg):</ion-label>
          <ion-input type="number" v-model="userData.peso" placeholder="Es. 70"></ion-input>
        </ion-item>

        <!-- Livello di attività -->
        <ion-list-header class="ion-margin-top">
          <ion-label>Livello di attività:</ion-label>
        </ion-list-header>
        <ion-radio-group v-model="userData.livelloAttivita">
          <ion-item>
            <ion-label>Per nulla attivo</ion-label>
            <ion-radio value="sedentario"></ion-radio>
          </ion-item>
          <ion-item>
            <ion-label>Leggermente attivo</ion-label>
            <ion-radio value="leggermente_attivo"></ion-radio>
          </ion-item>
          <ion-item>
            <ion-label>Attivo</ion-label>
            <ion-radio value="attivo"></ion-radio>
          </ion-item>
          <ion-item>
            <ion-label>Molto attivo</ion-label>
            <ion-radio value="molto_attivo"></ion-radio>
          </ion-item>
        </ion-radio-group>

        <!-- Obiettivo percorso -->
        <ion-list-header class="ion-margin-top">
          <ion-label>Obiettivo percorso:</ion-label>
        </ion-list-header>
        <ion-radio-group v-model="userData.obiettivoPercorso">
          <ion-item>
            <ion-label>Aumentare di peso</ion-label>
            <ion-radio value="aumentare"></ion-radio>
          </ion-item>
          <ion-item>
            <ion-label>Mantenere il peso</ion-label>
            <ion-radio value="mantenere"></ion-radio>
          </ion-item>
          <ion-item>
            <ion-label>Diminuire di peso</ion-label>
            <ion-radio value="diminuire"></ion-radio>
          </ion-item>
        </ion-radio-group>

        <!-- Peso obiettivo (opzionale) -->
        <ion-item class="ion-margin-top">
          <ion-label position="stacked">Qual è il peso che vuoi raggiungere? (opzionale)</ion-label>
          <ion-input
            type="number"
            v-model="userData.pesoObiettivo"
            placeholder="Es. 65"
          ></ion-input>
        </ion-item>

        <!-- Tipo di dieta (opzionale) -->
        <ion-item class="ion-margin-top">
          <ion-label position="stacked">Che tipo di dieta segui? (opzionale)</ion-label>
          <ion-select v-model="userData.tipoDieta" placeholder="Seleziona">
            <ion-select-option value="standard">Standard</ion-select-option>
            <ion-select-option value="vegetariana">Vegetariana</ion-select-option>
            <ion-select-option value="vegana">Vegana</ion-select-option>
            <ion-select-option value="chetogenica">Chetogenica</ion-select-option>
            <ion-select-option value="senza_glutine">Senza Glutine</ion-select-option>
          </ion-select>
        </ion-item>

        <!-- Cibi esclusi (input dinamico) -->
        <ion-item class="ion-margin-top">
          <ion-label position="stacked">Cerca qui i cibi da non includere nel programma.</ion-label>
          <ion-input
            v-model="currentExcludedFood"
            @keyup.enter="addExcludedFood"
            placeholder="Aggiungi cibo escluso"
          ></ion-input>
        </ion-item>
        <ion-list v-if="userData.cibiEsclusi.length > 0">
          <ion-item v-for="(food, index) in userData.cibiEsclusi" :key="index">
            <ion-label>{{ food }}</ion-label>
            <ion-button fill="clear" color="danger" @click="removeExcludedFood(index)">
              <ion-icon :icon="closeCircle"></ion-icon>
            </ion-button>
          </ion-item>
        </ion-list>

        <ion-button expand="block" type="submit" class="ion-margin-top">Avanti</ion-button>
      </form>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user' // Importa lo store utente
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonRadioGroup,
  IonRadio,
  IonListHeader,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
} from '@ionic/vue'
import { closeCircle } from 'ionicons/icons'

const router = useRouter()
const userStore = useUserStore() // Inizializza lo store

// Dati dell'utente reattivi, inizializzati con i dati dello store se presenti
// Questo è utile se l'utente torna indietro per modificare i dati
const userData = ref({ ...userStore.userData })

const currentExcludedFood = ref('')

const addExcludedFood = () => {
  if (currentExcludedFood.value.trim() !== '') {
    userData.value.cibiEsclusi.push(currentExcludedFood.value.trim())
    currentExcludedFood.value = ''
  }
}

const removeExcludedFood = (index) => {
  userData.value.cibiEsclusi.splice(index, 1)
}

// Salva i dati dell'utente nello store Pinia e naviga alla pagina di riepilogo
const saveUserData = () => {
  userStore.setUserData(userData.value) // Salva i dati nello store
  console.log('Dati utente salvati nello store:', userStore.userData)
  router.push('/riepilogo') // Naviga alla pagina di riepilogo
}
</script>

<style scoped>
ion-list-header {
  margin-top: 20px;
  --color: #555;
  font-weight: bold;
}

ion-item {
  --padding-start: 0;
  --inner-padding-end: 0;
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

ion-input,
ion-select {
  --padding-start: 10px;
  --padding-end: 10px;
}

ion-button {
  --border-radius: 10px;
  margin-top: 30px;
  --background: #2196f3;
  --background-activated: #1976d2;
  --box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
