<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <template v-slot:start>
          <ion-buttons>
            <ion-back-button></ion-back-button>
          </ion-buttons>
        </template>
        <ion-title>Riepilogo</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <div v-if="foodStore.selectedFoodForQuantity && quantityToDisplay">
        <!-- Dati del wireframe:  -->
        <ion-item class="summary-item">
          <ion-label position="stacked">Nome del piatto:</ion-label>
          <ion-text class="summary-value">{{ foodStore.selectedFoodForQuantity.name }}</ion-text>
        </ion-item>

        <ion-item class="summary-item">
          <ion-label position="stacked">Quantità:</ion-label>
          <ion-text class="summary-value">{{ quantityToDisplay }} g</ion-text>
        </ion-item>

        <ion-item class="summary-item ion-margin-top">
          <ion-label>Calorie</ion-label>
          <ion-text class="summary-value">{{ calculatedKcal.toFixed(0) }} kcal</ion-text>
        </ion-item>
        <ion-item class="summary-item">
          <ion-label>Carboidrati</ion-label>
          <ion-text class="summary-value">{{ calculatedCarbs.toFixed(1) }} g</ion-text>
        </ion-item>
        <ion-item class="summary-item">
          <ion-label>Proteine</ion-label>
          <ion-text class="summary-value">{{ calculatedProteins.toFixed(1) }} g</ion-text>
        </ion-item>
        <ion-item class="summary-item">
          <ion-label>Grassi</ion-label>
          <ion-text class="summary-value">{{ calculatedFats.toFixed(1) }} g</ion-text>
        </ion-item>

        <ion-button expand="block" class="action-button ion-margin-top" @click="addFoodToMeal"
          >Aggiungi al pasto</ion-button
        >
        <ion-button expand="block" class="action-button" color="secondary" @click="addToFolder"
          >Aggiungi a una cartella</ion-button
        >
        <ion-button expand="block" class="action-button" fill="outline" @click="modifyPlate"
          >Modifica piatto</ion-button
        >
        <ion-button
          expand="block"
          class="action-button"
          fill="clear"
          color="danger"
          @click="cancelAction"
          >Annulla</ion-button
        >
      </div>
      <div v-else class="ion-text-center ion-padding">
        <p>Nessun dato di riepilogo disponibile. Torna indietro per selezionare un piatto.</p>
        <ion-button @click="router.back()">Torna indietro</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFoodStore } from '../stores/food'
import { useUserStore } from '../stores/user'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonText,
  IonButton,
  IonButtons,
  IonBackButton,
} from '@ionic/vue'

const router = useRouter()
const route = useRoute() // Per leggere i parametri di rotta
const foodStore = useFoodStore()
const userStore = useUserStore()

// La quantità viene passata come query parameter dalla pagina precedente
const quantityToDisplay = ref(null)

onMounted(() => {
  // Recupera la quantità dalla query string
  if (route.query.quantity) {
    quantityToDisplay.value = parseFloat(route.query.quantity)
  }

  // Se non ci sono dati del cibo selezionato o quantità, reindirizza
  if (!foodStore.selectedFoodForQuantity || !quantityToDisplay.value) {
    router.replace('/home') // O a una pagina di errore/inizio appropriata
  }
})

// Calcoli delle proprietà nutrizionali basati sulla quantità e sui dati per 100g
const calculatedKcal = computed(() => {
  if (!foodStore.selectedFoodForQuantity || !quantityToDisplay.value) return 0
  return (foodStore.selectedFoodForQuantity.kcal / 100) * quantityToDisplay.value
})

const calculatedCarbs = computed(() => {
  if (!foodStore.selectedFoodForQuantity || !quantityToDisplay.value) return 0
  return (foodStore.selectedFoodForQuantity.carbs / 100) * quantityToDisplay.value
})

const calculatedProteins = computed(() => {
  if (!foodStore.selectedFoodForQuantity || !quantityToDisplay.value) return 0
  return (foodStore.selectedFoodForQuantity.proteins / 100) * quantityToDisplay.value
})

const calculatedFats = computed(() => {
  if (!foodStore.selectedFoodForQuantity || !quantityToDisplay.value) return 0
  return (foodStore.selectedFoodForQuantity.fats / 100) * quantityToDisplay.value
})

// Azione per aggiungere il cibo al pasto (logica principale)
const addFoodToMeal = () => {
  if (foodStore.selectedFoodForQuantity && quantityToDisplay.value) {
    const food = foodStore.selectedFoodForQuantity
    const mealType = foodStore.selectedMealType // Il tipo di pasto è già nello store

    const foodEntry = {
      name: food.name,
      quantity: quantityToDisplay.value,
      unit: 'g',
      kcal: calculatedKcal.value,
      carbs: calculatedCarbs.value,
      proteins: calculatedProteins.value,
      fats: calculatedFats.value,
      timestamp: new Date().toISOString(),
    }

    userStore.addFoodEntryToMeal(mealType, foodEntry)

    // Resetta lo stato temporaneo nello store food dopo l'aggiunta
    foodStore.setSelectedFoodForQuantity(null)
    foodStore.setSelectedMealType('')

    router.push('/home') // Torna alla schermata principale
  } else {
    console.log("Errore: dati del cibo o quantità mancanti per l'aggiunta al pasto.")
  }
}

// Azione per aggiungere a una cartella (funzionalità futura)
const addToFolder = () => {
  console.log('Funzionalità: Aggiungi a una cartella (da implementare)')
  // Qui si potrebbe navigare a una pagina per salvare il piatto in una lista personalizzata
}

// Azione per modificare il piatto (torna alla pagina precedente)
const modifyPlate = () => {
  // Torna alla pagina di inserimento quantità, mantenendo il cibo selezionato
  router.back()
}

// Azione per annullare e tornare alla home
const cancelAction = () => {
  foodStore.setSelectedFoodForQuantity(null) // Resetta il cibo selezionato
  foodStore.setSelectedMealType('') // Resetta il tipo di pasto
  router.push('/home')
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

.summary-item {
  --background: #f9f9f9;
}

.summary-item ion-label {
  font-weight: bold;
  color: #333;
}

.summary-item ion-text {
  font-size: 1.1em;
  color: #555;
  padding-left: 10px; /* Spazio tra label e valore */
}

.action-button {
  --border-radius: 10px;
  height: 48px;
  font-size: 1.05em;
  margin-top: 20px;
  --box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.action-button[color='secondary'] {
  --background: #ffc107; /* Giallo per "Aggiungi a una cartella" */
  --background-activated: #ffa000;
  --color: #333;
}

.action-button[fill='outline'] {
  --border-color: #2196f3; /* Blu per "Modifica piatto" */
  --color: #2196f3;
}

.action-button[fill='clear'] {
  --color: #f44336; /* Rosso per "Annulla" */
}
</style>
