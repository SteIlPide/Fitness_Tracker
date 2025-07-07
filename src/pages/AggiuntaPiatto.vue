<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <template v-slot:start>
          <ion-buttons>
            <ion-back-button></ion-back-button>
          </ion-buttons>
        </template>
        <ion-title>{{ isEditMode ? 'Modifica Piatto' : 'Aggiungi Dettagli Piatto' }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-card>
        <ion-card-content>
          <ion-item>
            <ion-label position="floating" for="plateName">Nome del Piatto</ion-label>
            <ion-input id="plateName" v-model="plateDetails.name" required></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating" for="plateKcal">Calorie (kcal)</ion-label>
            <ion-input
              id="plateKcal"
              type="number"
              v-model="plateDetails.kcal"
              required
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating" for="plateCarbs">Carboidrati (g)</ion-label>
            <ion-input id="plateCarbs" type="number" v-model="plateDetails.carbs"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating" for="plateProteins">Proteine (g)</ion-label>
            <ion-input id="plateProteins" type="number" v-model="plateDetails.proteins"></ion-input>
          </ion-item>
          <ion-item>
            <ion-label position="floating" for="plateFats">Grassi (g)</ion-label>
            <ion-input id="plateFats" type="number" v-model="plateDetails.fats"></ion-input>
          </ion-item>

          <ion-list-header>Ingredienti</ion-list-header>
          <ion-item v-for="(ingredient, index) in plateDetails.ingredients" :key="index">
            <!-- ID univoco per ogni ingrediente usando l'indice -->
            <ion-label position="floating" :for="'ingredient-' + index"
              >Ingrediente {{ index + 1 }}</ion-label
            >
            <ion-input
              :id="'ingredient-' + index"
              v-model="plateDetails.ingredients[index]"
            ></ion-input>
            <template v-slot:end>
              <ion-button fill="clear" @click="removeIngredient(index)">
                <ion-icon :icon="removeCircleOutline"></ion-icon>
              </ion-button>
            </template>
          </ion-item>
          <ion-button expand="block" fill="outline" class="ion-margin-top" @click="addIngredient">
            <template v-slot:start>
              <ion-icon :icon="addCircleOutline"></ion-icon>
            </template>
            Aggiungi Ingrediente
          </ion-button>

          <ion-button expand="block" class="ion-margin-top" @click="savePlate">
            {{ isEditMode ? 'Salva Modifiche' : 'Salva Piatto' }}
          </ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useFoodStore } from '../stores/food'
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
  IonCardContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonIcon,
  IonListHeader,
} from '@ionic/vue'
import { addCircleOutline, removeCircleOutline } from 'ionicons/icons'

const router = useRouter()
// eslint-disable-next-line no-unused-vars
const foodStore = useFoodStore()
const dishesStore = useDishesStore()

const props = defineProps({
  dishId: String,
})

const isEditMode = ref(false)

const plateDetails = ref({
  id: null,
  name: '',
  kcal: null,
  carbs: null,
  proteins: null,
  fats: null,
  ingredients: [''],
})

const loadPlateForEdit = () => {
  if (props.dishId) {
    isEditMode.value = true
    const dishToEdit = dishesStore.getDishById(props.dishId)
    if (dishToEdit) {
      plateDetails.value = { ...dishToEdit }
      if (!plateDetails.value.ingredients || plateDetails.value.ingredients.length === 0) {
        plateDetails.value.ingredients = ['']
      }
    } else {
      console.warn(`Piatto con ID ${props.dishId} non trovato per la modifica.`)
      isEditMode.value = false
      resetPlateDetails()
    }
  } else {
    isEditMode.value = false
    resetPlateDetails()
  }
}

const resetPlateDetails = () => {
  plateDetails.value = {
    id: null,
    name: '',
    kcal: null,
    carbs: null,
    proteins: null,
    fats: null,
    ingredients: [''],
  }
}

const addIngredient = () => {
  plateDetails.value.ingredients.push('')
}

const removeIngredient = (index) => {
  if (plateDetails.value.ingredients.length > 1) {
    plateDetails.value.ingredients.splice(index, 1)
  } else {
    plateDetails.value.ingredients[0] = ''
  }
}

const savePlate = () => {
  plateDetails.value.ingredients = plateDetails.value.ingredients.filter((ing) => ing.trim() !== '')

  if (isEditMode.value) {
    dishesStore.updateDish(plateDetails.value)
    console.log('Piatto modificato:', plateDetails.value)
  } else {
    dishesStore.addDish(plateDetails.value)
    console.log('Piatto salvato:', plateDetails.value)
  }
  router.back()
}

onMounted(loadPlateForEdit)
watch(() => props.dishId, loadPlateForEdit)
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
ion-card-content {
  padding: 15px;
}
ion-item {
  margin-bottom: 10px;
  --background: #f9f9f9;
  border-radius: 8px;
}
ion-list-header {
  font-size: 1em;
  font-weight: bold;
  color: #333;
  margin-top: 20px;
  margin-bottom: 10px;
  padding-left: 0;
}
ion-button {
  --border-radius: 10px;
  height: 48px;
  font-size: 1.05em;
  --background: #2196f3;
  --background-activated: #1976d2;
  --box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}
ion-button[fill='outline'] {
  --background: transparent;
  --border-color: #2196f3;
  --color: #2196f3;
}
</style>
