<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <template v-slot:start>
          <ion-buttons>
            <ion-back-button></ion-back-button>
          </ion-buttons>
        </template>
        <ion-title>Ricerca il nome del piatto</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-searchbar
        placeholder="Ricerca il nome del piatto"
        v-model="searchQuery"
        @ionInput="performSearch"
        class="custom-searchbar"
      ></ion-searchbar>

      <ion-item class="ion-margin-top">
        <ion-label>Filtro per:</ion-label>
        <ion-select v-model="filterBy" placeholder="Nessun filtro">
          <ion-select-option value="all">Tutti</ion-select-option>
          <ion-select-option value="low_cal">Basse Calorie</ion-select-option>
          <ion-select-option value="high_protein">Alto Contenuto Proteico</ion-select-option>
        </ion-select>
      </ion-item>

      <ion-list class="ion-margin-top">
        <ion-item
          v-for="food in filteredResults"
          :key="food.id"
          class="food-item"
          @click="selectFood(food)"
        >
          <template v-slot:start>
            <ion-thumbnail>
              <img
                src="https://placehold.co/60x60/cccccc/333333?text=Piatto"
                alt="Immagine piatto"
              />
            </ion-thumbnail>
          </template>
          <ion-label>
            <h2>{{ food.name }}</h2>
            <p>{{ food.kcal }} kcal/100g</p>
          </ion-label>
          <template v-slot:end>
            <ion-icon :icon="chevronForward"></ion-icon>
          </template>
        </ion-item>
        <ion-item v-if="filteredResults.length === 0">
          <ion-label class="ion-text-center">Nessun risultato trovato.</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useFoodStore } from '../stores/food'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonList,
  IonThumbnail,
  IonIcon,
  IonButtons,
  IonBackButton,
} from '@ionic/vue'
import { chevronForward } from 'ionicons/icons'

const route = useRoute()
const router = useRouter()
const foodStore = useFoodStore()

const searchQuery = ref('')
const filterBy = ref('all')

// Inizializza la query di ricerca se presente nell'URL
onMounted(() => {
  if (route.query.q) {
    searchQuery.value = route.query.q
  }
})

const performSearch = () => {
  // La logica di filtro è nel getter dello store
}

const filteredResults = computed(() => {
  let results = foodStore.filteredFoods(searchQuery.value)

  // Applica i filtri aggiuntivi
  if (filterBy.value === 'low_cal') {
    results = results.filter((food) => food.kcal < 250) // Esempio di soglia
  } else if (filterBy.value === 'high_protein') {
    results = results.filter((food) => food.proteins > 20) // Esempio di soglia
  }
  return results
})

const selectFood = (food) => {
  foodStore.setSelectedFoodForQuantity(food) // Salva il cibo selezionato nello store
  router.push('/enter-quantity') // Naviga alla pagina di inserimento quantità
}
</script>

<style scoped>
.custom-searchbar {
  --border-radius: 15px;
  --background: #f0f0f0;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.food-item {
  --padding-start: 0;
  --inner-padding-end: 0;
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

.food-item ion-thumbnail {
  --border-radius: 8px;
  margin-right: 15px;
  --size: 60px;
}

.food-item h2 {
  font-size: 1.1em;
  font-weight: bold;
  color: #333;
}

.food-item p {
  font-size: 0.9em;
  color: #666;
}

ion-icon {
  color: #888;
}
</style>
