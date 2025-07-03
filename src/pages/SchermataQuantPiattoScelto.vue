<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <template v-slot:start>
          <ion-buttons>
            <ion-back-button></ion-back-button>
          </ion-buttons>
        </template>
        <ion-title>Inserisci la quantità:</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <div v-if="foodStore.selectedFoodForQuantity">
        <ion-item>
          <ion-label position="stacked">Quantità (g):</ion-label>
          <ion-input type="number" v-model="quantity" placeholder="Es. 100"></ion-input>
        </ion-item>

        <ion-card class="ion-margin-top">
          <ion-card-header>
            <ion-card-title>Ingredienti piatto:</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-list
              lines="none"
              v-if="
                foodStore.selectedFoodForQuantity.ingredients &&
                foodStore.selectedFoodForQuantity.ingredients.length > 0
              "
            >
              <ion-item
                v-for="(ingredient, index) in foodStore.selectedFoodForQuantity.ingredients"
                :key="index"
              >
                <ion-label>
                  <h3>{{ ingredient.name }}</h3>
                  <p>{{ ingredient.quantity }} {{ ingredient.unit }}</p>
                </ion-label>
              </ion-item>
            </ion-list>
            <p v-else class="ion-text-center">Nessun ingrediente specificato per questo piatto.</p>
          </ion-card-content>
        </ion-card>

        <ion-button expand="block" class="ion-margin-top" @click="proceedToSummary"
          >Avanti</ion-button
        >
      </div>
      <div v-else class="ion-text-center">
        <p>Nessun piatto selezionato. Torna indietro per selezionarne uno.</p>
        <ion-button @click="router.back()">Torna indietro</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useFoodStore } from '../stores/food'
// userStore non è più necessario qui, i calcoli e l'aggiunta avvengono in FoodSummaryPage
// import { useUserStore } from '../stores/user';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonList,
  IonButton,
  IonButtons,
  IonBackButton,
} from '@ionic/vue'

const router = useRouter()
const foodStore = useFoodStore()
// const userStore = useUserStore(); // Non più necessario qui

const quantity = ref(null)

onMounted(() => {
  if (!foodStore.selectedFoodForQuantity) {
    router.replace('/search-create-plate')
  }
})

// Funzione modificata per navigare alla pagina di riepilogo
const proceedToSummary = () => {
  if (quantity.value > 0 && foodStore.selectedFoodForQuantity) {
    // Passa la quantità come query parameter alla pagina di riepilogo
    router.push({
      name: 'FoodSummary',
      query: { quantity: quantity.value },
    })
  } else {
    console.log('Per favore, inserisci una quantità valida.')
  }
}
</script>

<style scoped>
ion-item {
  --padding-start: 0;
  --inner-padding-end: 0;
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

ion-input {
  --padding-start: 10px;
  --padding-end: 10px;
}

ion-card {
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

ion-card-content p {
  margin-bottom: 8px;
  color: #555;
  line-height: 1.5;
}

ion-button {
  --border-radius: 10px;
  margin-top: 30px;
  --background: #4caf50;
  --background-activated: #45a049;
  --box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
