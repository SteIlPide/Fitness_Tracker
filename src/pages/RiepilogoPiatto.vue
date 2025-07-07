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

      <!-- NUOVO: Action Sheet per le opzioni "Aggiungi a Cartella" -->
      <ion-action-sheet
        :is-open="showAddToFolderOptions"
        header="Aggiungi il piatto a una cartella?"
        :buttons="addToFolderOptionsButtons"
        @didDismiss="showAddToFolderOptions = false"
      ></ion-action-sheet>

      <!-- NUOVO: Modale per selezionare una cartella esistente -->
      <ion-modal :is-open="showSelectFolderModal" @didDismiss="showSelectFolderModal = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>Seleziona Cartella</ion-title>
            <template v-slot:end>
              <ion-buttons>
                <ion-button @click="showSelectFolderModal = false">Annulla</ion-button>
              </ion-buttons>
            </template>
          </ion-toolbar>
        </ion-header>
        <ion-content>
          <ion-list v-if="dishesStore.folders.length > 0">
            <ion-item
              button
              v-for="folder in dishesStore.folders"
              :key="folder.id"
              @click="addSavedDishToFolder(folder.id)"
            >
              <ion-label>{{ folder.name }}</ion-label>
            </ion-item>
          </ion-list>
          <p v-else class="ion-text-center ion-padding">
            Nessuna cartella disponibile. Crea una nuova cartella.
          </p>
        </ion-content>
      </ion-modal>

      <!-- NUOVO: Modale per la creazione di una nuova cartella (riutilizzata) -->
      <ion-modal :is-open="showCreateFolderModal" @didDismiss="showCreateFolderModal = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>Crea Nuova Cartella</ion-title>
            <template v-slot:end>
              <ion-buttons>
                <ion-button @click="showCreateFolderModal = false">Annulla</ion-button>
              </ion-buttons>
            </template>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-item>
            <ion-label position="floating" for="newFolderNameInput">Nome della Cartella</ion-label>
            <ion-input id="newFolderNameInput" v-model="newFolderName" required></ion-input>
          </ion-item>
          <ion-button
            expand="block"
            class="ion-margin-top"
            @click="confirmCreateFolder"
            :disabled="!newFolderName.trim()"
            >Crea</ion-button
          >
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useFoodStore } from '../stores/food'
import { useUserStore } from '../stores/user'
import { useDishesStore } from '../stores/dishes' // Importa lo store dei piatti
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
  IonActionSheet,
  IonModal,
  IonList, // Aggiunto IonList
} from '@ionic/vue'
import { folderOutline, addCircleOutline as addCircleOutlineIcon } from 'ionicons/icons' // Importa le icone necessarie

const router = useRouter()
const route = useRoute()
const foodStore = useFoodStore()
const userStore = useUserStore()
const dishesStore = useDishesStore() // Inizializza lo store dei piatti

const quantityToDisplay = ref(null)

// NUOVO: Stati per le modali e action sheet "Aggiungi a Cartella"
const showAddToFolderOptions = ref(false)
const showSelectFolderModal = ref(false)
const showCreateFolderModal = ref(false)
const newFolderName = ref('')

onMounted(() => {
  if (route.query.quantity) {
    quantityToDisplay.value = parseFloat(route.query.quantity)
  }

  if (!foodStore.selectedFoodForQuantity || !quantityToDisplay.value) {
    router.replace('/home')
  }
})

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

const addFoodToMeal = () => {
  if (foodStore.selectedFoodForQuantity && quantityToDisplay.value) {
    const food = foodStore.selectedFoodForQuantity
    const mealType = foodStore.selectedMealType

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

    foodStore.setSelectedFoodForQuantity(null)
    foodStore.setSelectedMealType('')

    router.push('/home')
  } else {
    console.log("Errore: dati del cibo o quantità mancanti per l'aggiunta al pasto.")
  }
}

// NUOVO: Funzione per aprire l'Action Sheet "Aggiungi a Cartella"
const addToFolder = () => {
  console.log('DEBUG: Aperto Action Sheet "Aggiungi a una cartella"')
  showAddToFolderOptions.value = true
}

// NUOVO: Bottoni per l'Action Sheet "Aggiungi a Cartella"
const addToFolderOptionsButtons = computed(() => [
  {
    text: 'Aggiungi a cartella esistente',
    icon: folderOutline,
    handler: () => {
      console.log('DEBUG: Aggiungi a cartella esistente cliccato.')
      showSelectFolderModal.value = true
      return true
    },
  },
  {
    text: 'Crea nuova cartella',
    icon: addCircleOutlineIcon,
    handler: () => {
      console.log('DEBUG: Crea nuova cartella cliccato.')
      showCreateFolderModal.value = true
      return true
    },
  },
  {
    text: 'Annulla',
    role: 'cancel',
    handler: () => {
      console.log('DEBUG: Annulla opzioni aggiungi a cartella.')
      return true
    },
  },
])

// NUOVO: Funzione per aggiungere il piatto alla cartella scelta
const addSavedDishToFolder = (folderId) => {
  if (foodStore.selectedFoodForQuantity && folderId) {
    // Creiamo un oggetto piatto con i dettagli necessari per lo store dishes
    const dishToAdd = {
      id: foodStore.selectedFoodForQuantity.id, // Usiamo l'ID del cibo selezionato
      name: foodStore.selectedFoodForQuantity.name,
      kcal: foodStore.selectedFoodForQuantity.kcal, // Questi sono già per 100g
      carbs: foodStore.selectedFoodForQuantity.carbs,
      proteins: foodStore.selectedFoodForQuantity.proteins,
      fats: foodStore.selectedFoodForQuantity.fats,
      ingredients: foodStore.selectedFoodForQuantity.ingredients || [],
    }
    dishesStore.addDishToFolder(dishToAdd.id, folderId)
    console.log(`DEBUG: Piatto '${dishToAdd.name}' aggiunto alla cartella '${folderId}'`)
    showSelectFolderModal.value = false // Chiude la modale
    // Non torniamo alla home qui, l'utente potrebbe voler aggiungere al pasto dopo
  }
}

// NUOVO: Funzione per confermare la creazione della cartella
const confirmCreateFolder = () => {
  const folderName = newFolderName.value.trim()
  if (folderName) {
    dishesStore.addFolder(folderName)
    // Dopo aver creato la cartella, aggiungi il piatto selezionato ad essa
    const newFolder = dishesStore.folders.find((f) => f.name === folderName) // Trova la cartella appena creata
    if (newFolder && foodStore.selectedFoodForQuantity) {
      const dishToAdd = {
        id: foodStore.selectedFoodForQuantity.id,
        name: foodStore.selectedFoodForQuantity.name,
        kcal: foodStore.selectedFoodForQuantity.kcal,
        carbs: foodStore.selectedFoodForQuantity.carbs,
        proteins: foodStore.selectedFoodForQuantity.proteins,
        fats: foodStore.selectedFoodForQuantity.fats,
        ingredients: foodStore.selectedFoodForQuantity.ingredients || [],
      }
      dishesStore.addDishToFolder(dishToAdd.id, newFolder.id)
      console.log(
        `DEBUG: Piatto '${dishToAdd.name}' aggiunto alla nuova cartella '${newFolder.name}'`,
      )
    }
    showCreateFolderModal.value = false
    newFolderName.value = ''
    // Non torniamo alla home qui, l'utente potrebbe voler aggiungere al pasto dopo
  }
}

const modifyPlate = () => {
  router.back()
}

const cancelAction = () => {
  foodStore.setSelectedFoodForQuantity(null)
  foodStore.setSelectedMealType('')
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
  padding-left: 10px;
}

.action-button {
  --border-radius: 10px;
  height: 48px;
  font-size: 1.05em;
  margin-top: 20px;
  --box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.action-button[color='secondary'] {
  --background: #ffc107;
  --background-activated: #ffa000;
  --color: #333;
}

.action-button[fill='outline'] {
  --border-color: #2196f3;
  --color: #2196f3;
}

.action-button[fill='clear'] {
  --color: #f44336;
}
</style>
