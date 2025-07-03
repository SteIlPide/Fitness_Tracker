<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <template v-slot:start>
          <ion-buttons>
            <ion-back-button></ion-back-button>
          </ion-buttons>
        </template>
        <ion-title>Ricerca o Crea Piatto</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding ion-text-center">
      <div class="search-create-container">
        <ion-searchbar
          placeholder="Ricerca piatto"
          v-model="searchQuery"
          @keyup.enter="searchPlate"
          class="custom-searchbar"
        ></ion-searchbar>
        <ion-button expand="block" class="search-button" @click="searchPlate">
          <template v-slot:start>
            <ion-icon :icon="search"></ion-icon>
          </template>
          Ricerca piatto
        </ion-button>

        <p class="separator">oppure</p>

        <ion-button expand="block" class="create-button" @click="createPlate">
          <template v-slot:start>
            <ion-icon :icon="addCircle"></ion-icon>
          </template>
          Crea piatto
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFoodStore } from '../stores/food'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonButton,
  IonIcon,
  IonButtons,
  IonBackButton,
} from '@ionic/vue'
import { search, addCircle } from 'ionicons/icons'

const router = useRouter()
const foodStore = useFoodStore()
const searchQuery = ref('')

const searchPlate = () => {
  if (searchQuery.value.trim() !== '') {
    // Naviga alla pagina dei risultati di ricerca con la query
    router.push({ name: 'SearchResults', query: { q: searchQuery.value.trim() } })
  }
}

const createPlate = () => {
  foodStore.resetCurrentPlate() // Resetta lo stato del piatto in creazione
  router.push('/add-plate-details') // Naviga alla pagina di creazione piatto
}
</script>

<style scoped>
.search-create-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 20px;
}

.custom-searchbar {
  --border-radius: 15px;
  --background: #f0f0f0;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  width: 100%;
  max-width: 400px;
}

.search-button,
.create-button {
  --border-radius: 15px;
  height: 55px;
  font-size: 1.2em;
  font-weight: bold;
  width: 100%;
  max-width: 300px;
  --box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.search-button {
  --background: #2196f3; /* Blu per ricerca */
  --background-activated: #1976d2;
}

.create-button {
  --background: #ff9800; /* Arancione per creazione */
  --background-activated: #fb8c00;
  margin-top: 20px;
}

.separator {
  margin: 30px 0;
  font-size: 1.1em;
  color: #666;
  position: relative;
  width: 100%;
  max-width: 300px;
}

.separator::before,
.separator::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background-color: #ddd;
}

.separator::before {
  left: 0;
}

.separator::after {
  right: 0;
}
</style>
