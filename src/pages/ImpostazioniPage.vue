<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <template v-slot:start>
          <ion-buttons>
            <ion-back-button></ion-back-button>
          </ion-buttons>
        </template>
        <ion-title>Impostazioni</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <!-- Sezione IMPOSTAZIONI GENERALI -->
      <ion-card class="settings-card">
        <ion-card-header>
          <ion-card-title class="section-title">IMPOSTAZIONI GENERALI</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list lines="full">
            <ion-item button detail @click="goToSetting('generale1')">
              <ion-label>Impostazione</ion-label>
            </ion-item>
            <ion-item button detail @click="goToSetting('generale2')">
              <ion-label>Impostazione</ion-label>
            </ion-item>
            <ion-item button detail @click="goToSetting('generale3')">
              <ion-label>Impostazione</ion-label>
            </ion-item>
            <ion-item button detail @click="goToSetting('generale4')">
              <ion-label>Impostazione</ion-label>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

      <!-- Sezione OBIETTIVI PERSONALIZZATI -->
      <ion-card class="settings-card">
        <ion-card-header>
          <ion-card-title class="section-title">OBIETTIVI PERSONALIZZATI</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list lines="full">
            <ion-item button detail @click="goToSetting('pesoObiettivo')">
              <ion-label>Obiettivo peso</ion-label>
            </ion-item>
            <ion-item button detail @click="goToSetting('livelloAttivita')">
              <ion-label>Livello attività</ion-label>
            </ion-item>
            <ion-item button detail @click="goToSetting('obiettivoPercorso')">
              <ion-label>Obiettivo percorso</ion-label>
            </ion-item>
            <ion-item button detail @click="goToSetting('obiettivoAltro')">
              <ion-label>Impostazione</ion-label>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

      <!-- Sezione PROFILO PERSONALE -->
      <ion-card class="settings-card">
        <ion-card-header>
          <ion-card-title class="section-title">PROFILO PERSONALE</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list lines="full">
            <ion-item button detail @click="goToSetting('profiloDati')">
              <ion-label>Età, sesso, altezza, peso</ion-label>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

      <!-- Sezione PREFERENZE ALIMENTARI -->
      <ion-card class="settings-card">
        <ion-card-header>
          <ion-card-title class="section-title">PREFERENZE ALIMENTARI</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list lines="full">
            <ion-item button detail @click="goToSetting('tipoDieta')">
              <ion-label>Tipo di dieta</ion-label>
            </ion-item>
            <ion-item button detail @click="goToSetting('cibiEsclusi')">
              <ion-label>Cibi esclusi</ion-label>
            </ion-item>
            <ion-item button detail @click="goToSetting('preferenzeAltro1')">
              <ion-label>Impostazione</ion-label>
            </ion-item>
            <ion-item button detail @click="goToSetting('preferenzeAltro2')">
              <ion-label>Impostazione</ion-label>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
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
} from '@ionic/vue'

// eslint-disable-next-line no-unused-vars
const router = useRouter()

// Funzione per navigare alle sottopagine di impostazione
const goToSetting = (settingName) => {
  console.log(`Naviga a impostazione: ${settingName}`)
  // Qui useremo il router per navigare a sottopagine specifiche.
  // Per ora, useremo un placeholder. Le rotte dovranno essere definite in router/index.js
  // Esempio: router.push(`/impostazioni/${settingName}`);
  // Per ora, facciamo un semplice log, ma prepareremo le rotte.
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

.settings-card {
  margin-top: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  background-color: #ffffff;
}

.settings-card:first-of-type {
  margin-top: 0; /* Rimuovi margine superiore per la prima card */
}

ion-card-header {
  padding-bottom: 0; /* Riduci spazio tra titolo e lista */
}

.section-title {
  font-size: 0.9em;
  font-weight: bold;
  color: #666;
  text-transform: uppercase;
  margin-bottom: 10px;
  padding-left: 16px; /* Allinea con il padding di ion-item */
}

ion-list {
  background: transparent; /* Rimuovi sfondo di default della lista */
  padding-top: 0; /* Rimuovi padding superiore della lista */
}

ion-item {
  --background: transparent; /* Assicura che l'item non abbia uno sfondo */
  --padding-start: 16px;
  --inner-padding-end: 16px;
  --min-height: 50px; /* Altezza minima per ogni voce */
  font-size: 1.05em;
  color: #333;
}

ion-item:last-of-type {
  --border-width: 0; /* Rimuovi la linea inferiore dell'ultimo item */
}
</style>
