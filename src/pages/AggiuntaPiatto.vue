<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <template v-slot:start>
          <ion-buttons>
            <ion-back-button></ion-back-button>
          </ion-buttons>
        </template>
        <ion-title>Crea il tuo piatto</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-item>
        <ion-label position="stacked">Nome del piatto:</ion-label>
        <ion-input
          v-model="foodStore.currentPlate.name"
          placeholder="Es. Pollo al curry"
        ></ion-input>
      </ion-item>

      <ion-list-header class="ion-margin-top">
        <ion-label>Aggiungi ingrediente</ion-label>
        <ion-button fill="clear" @click="showAddIngredientModal">
          <ion-icon :icon="addCircle"></ion-icon>
        </ion-button>
      </ion-list-header>

      <ion-list v-if="foodStore.currentPlate.ingredients.length > 0">
        <ion-item v-for="(ingredient, index) in foodStore.currentPlate.ingredients" :key="index">
          <ion-label>
            {{ ingredient.name }}
            <p>{{ ingredient.quantity }} {{ ingredient.unit }}</p>
          </ion-label>
          <ion-button
            fill="clear"
            color="danger"
            @click="foodStore.removeIngredientFromCurrentPlate(index)"
          >
            <ion-icon :icon="closeCircle"></ion-icon>
          </ion-button>
        </ion-item>
      </ion-list>
      <p v-else class="ion-text-center ion-padding-top">Nessun ingrediente aggiunto.</p>

      <ion-list-header class="ion-margin-top">
        <ion-label>Proprietà (Totali per il piatto)</ion-label>
      </ion-list-header>

      <!-- Visualizzazione dei valori CALCOLATI -->
      <ion-item>
        <ion-label>Peso totale del piatto</ion-label>
        <ion-text>{{ calculatedTotalWeight.toFixed(0) }} g</ion-text>
      </ion-item>
      <ion-item>
        <ion-label>Calorie totali</ion-label>
        <ion-text>{{ calculatedTotalKcal.toFixed(0) }} kcal</ion-text>
      </ion-item>
      <ion-item>
        <ion-label>Carboidrati totali</ion-label>
        <ion-text>{{ calculatedTotalCarbs.toFixed(1) }} g</ion-text>
      </ion-item>
      <ion-item>
        <ion-label>Proteine totali</ion-label>
        <ion-text>{{ calculatedTotalProteins.toFixed(1) }} g</ion-text>
      </ion-item>
      <ion-item>
        <ion-label>Grassi totali</ion-label>
        <ion-text>{{ calculatedTotalFats.toFixed(1) }} g</ion-text>
      </ion-item>

      <ion-button expand="block" class="ion-margin-top" @click="savePlate">Avanti</ion-button>

      <!-- Modale per aggiungere ingrediente -->
      <ion-modal :is-open="isModalOpen" @didDismiss="isModalOpen = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>Aggiungi Ingrediente</ion-title>
            <template v-slot:end>
              <ion-buttons>
                <ion-button @click="isModalOpen = false">Chiudi</ion-button>
              </ion-buttons>
            </template>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-item>
            <ion-label position="stacked">Nome Ingrediente:</ion-label>
            <ion-input v-model="newIngredient.name" placeholder="Es. Pollo"></ion-input>
          </ion-item>
          <ion-item class="ion-margin-top">
            <ion-label position="stacked">Quantità (g):</ion-label>
            <ion-input
              type="number"
              v-model="newIngredient.quantity"
              placeholder="Es. 100"
            ></ion-input>
          </ion-item>
          <!-- Ho rimosso l'unità per semplicità, assumendo che sia sempre 'g' per il calcolo.
               Se vuoi unità diverse, dovrai gestire la conversione. -->
          <ion-button expand="block" class="ion-margin-top" @click="addIngredient"
            >Aggiungi</ion-button
          >
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useFoodStore } from '../stores/food'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonListHeader,
  IonList,
  IonText,
  IonButton,
  IonIcon,
  IonModal,
  IonButtons,
  IonBackButton,
} from '@ionic/vue'
import { addCircle, closeCircle } from 'ionicons/icons'

const router = useRouter()
const foodStore = useFoodStore()

const isModalOpen = ref(false)
const newIngredient = ref({ name: '', quantity: null, unit: 'g' }) // Assumiamo 'g' come default

const showAddIngredientModal = () => {
  newIngredient.value = { name: '', quantity: null, unit: 'g' } // Resetta il form
  isModalOpen.value = true
}

const addIngredient = () => {
  if (newIngredient.value.name && newIngredient.value.quantity > 0) {
    // Verifica se l'ingrediente esiste nel database per il calcolo
    const ingredientData = foodStore.getIngredientNutritionalData(newIngredient.value.name)
    if (!ingredientData) {
      console.warn(
        `Ingrediente "${newIngredient.value.name}" non trovato nel database. I suoi valori nutrizionali non saranno inclusi nel calcolo.`,
      )
      // Potresti mostrare un avviso all'utente qui
    }
    foodStore.addIngredientToCurrentPlate({ ...newIngredient.value })
    isModalOpen.value = false
  } else {
    console.log("Per favore, inserisci il nome e una quantità valida per l'ingrediente.")
  }
}

// Calcoli dinamici per il piatto in creazione
const calculatedTotalWeight = computed(() => {
  return foodStore.currentPlate.ingredients.reduce((sum, ing) => sum + (ing.quantity || 0), 0)
})

const calculatedTotalKcal = computed(() => {
  return foodStore.currentPlate.ingredients.reduce((sum, ing) => {
    const ingredientData = foodStore.getIngredientNutritionalData(ing.name)
    if (ingredientData && ing.quantity) {
      return sum + (ingredientData.kcal / 100) * ing.quantity
    }
    return sum
  }, 0)
})

const calculatedTotalCarbs = computed(() => {
  return foodStore.currentPlate.ingredients.reduce((sum, ing) => {
    const ingredientData = foodStore.getIngredientNutritionalData(ing.name)
    if (ingredientData && ing.quantity) {
      return sum + (ingredientData.carbs / 100) * ing.quantity
    }
    return sum
  }, 0)
})

const calculatedTotalProteins = computed(() => {
  return foodStore.currentPlate.ingredients.reduce((sum, ing) => {
    const ingredientData = foodStore.getIngredientNutritionalData(ing.name)
    if (ingredientData && ing.quantity) {
      return sum + (ingredientData.proteins / 100) * ing.quantity
    }
    return sum
  }, 0)
})

const calculatedTotalFats = computed(() => {
  return foodStore.currentPlate.ingredients.reduce((sum, ing) => {
    const ingredientData = foodStore.getIngredientNutritionalData(ing.name)
    if (ingredientData && ing.quantity) {
      return sum + (ingredientData.fats / 100) * ing.quantity
    }
    return sum
  }, 0)
})

const savePlate = () => {
  // Validazione: assicurati che il nome del piatto sia presente e che ci siano ingredienti
  if (!foodStore.currentPlate.name || foodStore.currentPlate.ingredients.length === 0) {
    console.log('Per favore, inserisci il nome del piatto e almeno un ingrediente.')
    return
  }

  const totalWeight = calculatedTotalWeight.value
  if (totalWeight === 0) {
    console.log('Il peso totale del piatto non può essere zero. Aggiungi ingredienti con quantità.')
    return
  }

  // Calcola i valori nutrizionali per 100g del PIATTO FINALE
  const factor = 100 / totalWeight // Es: 100 / 400g = 0.25

  foodStore.currentPlate.kcal = Math.round(calculatedTotalKcal.value * factor)
  foodStore.currentPlate.carbs = parseFloat((calculatedTotalCarbs.value * factor).toFixed(1))
  foodStore.currentPlate.proteins = parseFloat((calculatedTotalProteins.value * factor).toFixed(1))
  foodStore.currentPlate.fats = parseFloat((calculatedTotalFats.value * factor).toFixed(1))

  // Salva il nuovo piatto nello store (che ora contiene i valori per 100g)
  foodStore.addNewPlate({ ...foodStore.currentPlate })
  foodStore.resetCurrentPlate() // Resetta lo stato per il prossimo piatto

  router.push('/home') // Torna alla schermata principale
}
</script>

<style scoped>
ion-list-header {
  margin-top: 20px;
  --color: #555;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

ion-list-header ion-button {
  font-size: 1.8em;
  --padding-start: 0;
  --padding-end: 0;
}

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

ion-button {
  --border-radius: 10px;
  margin-top: 30px;
  --background: #4caf50;
  --background-activated: #45a049;
  --box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
</style>
