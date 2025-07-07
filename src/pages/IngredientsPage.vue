<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <template v-slot:start>
          <ion-buttons>
            <ion-back-button></ion-back-button>
          </ion-buttons>
        </template>
        <ion-title>Ingredienti: {{ dish?.name }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-card v-if="dish">
        <ion-card-header>
          <ion-card-title>Ingredienti di {{ dish.name }}</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list lines="none">
            <ion-item v-for="(ingredient, index) in dish.ingredients" :key="index">
              <ion-label>{{ ingredient }}</ion-label>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>
      <div v-else class="ion-text-center ion-padding-top">
        <p>Piatto non trovato o ingredienti non disponibili.</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDishesStore } from '../stores/dishes'
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

const route = useRoute()
const dishesStore = useDishesStore()
const dish = ref(null)

const loadDishIngredients = () => {
  const dishId = route.params.dishId
  if (dishId) {
    dish.value = dishesStore.getDishById(dishId)
  }
}

onMounted(loadDishIngredients)
watch(() => route.params.dishId, loadDishIngredients) // Ricarica se l'ID del piatto cambia nell'URL
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
ion-card {
  margin-top: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
}
ion-card-header {
  --background: #f0f0f0;
  border-bottom: 1px solid #eee;
  border-radius: 15px 15px 0 0;
}
ion-card-title {
  font-size: 1.1em;
  color: #333;
}
ion-list {
  background: transparent;
}
ion-item {
  --background: transparent;
  font-size: 1em;
  color: #555;
}
</style>
