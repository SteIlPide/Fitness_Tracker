<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <template v-slot:start>
          <ion-buttons>
            <ion-back-button></ion-back-button>
          </ion-buttons>
        </template>
        <ion-title>Di che pasto si tratta?</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding ion-text-center">
      <div class="meal-selection-container">
        <ion-button expand="block" class="meal-button" @click="selectMeal('Colazione')"
          >Colazione</ion-button
        >
        <ion-button expand="block" class="meal-button" @click="selectMeal('Pranzo')"
          >Pranzo</ion-button
        >
        <ion-button expand="block" class="meal-button" @click="selectMeal('Cena')">Cena</ion-button>
        <ion-button expand="block" class="meal-button" @click="selectMeal('Spuntino')"
          >Spuntino</ion-button
        >
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useFoodStore } from '../stores/food' // Importa lo store cibo
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonBackButton,
} from '@ionic/vue'

const router = useRouter()
const foodStore = useFoodStore()

const selectMeal = (mealType) => {
  foodStore.setSelectedMealType(mealType) // Salva il tipo di pasto nello store
  router.push('/search-create-plate') // Naviga alla pagina successiva
}
</script>

<style scoped>
.meal-selection-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  gap: 20px; /* Spazio tra i pulsanti */
}

.meal-button {
  --border-radius: 15px;
  height: 60px;
  font-size: 1.3em;
  font-weight: bold;
  --background: #4caf50; /* Verde per i pulsanti pasto */
  --background-activated: #45a049;
  --box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  width: 80%; /* Larghezza fissa per i pulsanti */
  max-width: 300px; /* Larghezza massima */
}
</style>
