<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <template v-slot:start>
          <ion-buttons>
            <ion-back-button
              v-if="currentView === 'dishes'"
              @click="currentView = 'folders'"
            ></ion-back-button>
          </ion-buttons>
        </template>
        <ion-title>Piatti Salvati</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <!-- Campo di ricerca per i piatti salvati (come da wireframe) -->
      <ion-searchbar placeholder="Ricerca nei salvati" class="search-saved-bar"></ion-searchbar>

      <!-- Toggle per la visualizzazione Cartelle/Piatti -->
      <ion-segment v-model="currentView" mode="md" class="view-toggle-segment">
        <ion-segment-button value="folders">
          <ion-label>Cartelle</ion-label>
        </ion-segment-button>
        <ion-segment-button value="dishes">
          <ion-label>Piatti</ion-label>
        </ion-segment-button>
      </ion-segment>

      <!-- Visualizzazione Cartelle (Layout a Griglia) -->
      <div v-if="currentView === 'folders'">
        <ion-grid class="folder-grid">
          <ion-row>
            <!-- Card per ogni cartella esistente -->
            <ion-col
              size="6"
              size-md="4"
              size-lg="3"
              v-for="folder in dishesStore.folders"
              :key="folder.id"
            >
              <ion-card class="folder-grid-card" button @click="viewFolder(folder.id)">
                <ion-card-content class="folder-card-content">
                  <div class="folder-icon-wrapper">
                    <ion-icon :icon="folderOutline"></ion-icon>
                  </div>
                  <h3>{{ folder.name }}</h3>
                  <p>{{ folder.dishIds.length }} piatti</p>
                  <!-- Pulsante ellipsis per opzioni cartella (come da wireframe) -->
                  <div class="folder-ellipsis-button" @click.stop="openFolderMenu(folder)">
                    <ion-icon :icon="ellipsisVertical"></ion-icon>
                  </div>
                </ion-card-content>
              </ion-card>
            </ion-col>

            <!-- Card "Crea nuova cartella" -->
            <ion-col size="6" size-md="4" size-lg="3">
              <ion-card class="create-folder-card" button @click="openCreateFolderModal">
                <ion-card-content class="create-folder-content">
                  <ion-icon :icon="addOutline"></ion-icon>
                  <h3>Crea nuova cartella</h3>
                </ion-card-content>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>
        <p v-if="dishesStore.folders.length === 0" class="ion-text-center ion-padding-top">
          Nessuna cartella creata. Clicca "Crea nuova cartella" per iniziare.
        </p>
      </div>

      <!-- Visualizzazione Piatti -->
      <div v-else-if="currentView === 'dishes'">
        <ion-card class="dish-card" v-for="dish in dishesToDisplay" :key="dish.id">
          <ion-item class="dish-item-container">
            <ion-label>
              <h2>{{ dish.name }}</h2>
              <p>{{ dish.kcal }} kcal</p>
            </ion-label>
            <div class="ellipsis-div-button" @click.stop="openDishMenu(dish)">
              <ion-icon :icon="ellipsisVertical"></ion-icon>
            </div>
          </ion-item>
          <div v-if="expandedDishId === dish.id" class="dish-details">
            <ion-item lines="none">
              <ion-label>Carboidrati</ion-label>
              <ion-text>{{ dish.carbs.toFixed(1) }} g</ion-text>
            </ion-item>
            <ion-item lines="none">
              <ion-label>Proteine</ion-label>
              <ion-text>{{ dish.proteins.toFixed(1) }} g</ion-text>
            </ion-item>
            <ion-item lines="none">
              <ion-label>Grassi</ion-label>
              <ion-text>{{ dish.fats.toFixed(1) }} g</ion-text>
            </ion-item>
            <ion-button
              expand="block"
              fill="outline"
              size="small"
              class="ion-margin-top"
              @click="viewIngredients(dish)"
              >Visualizza ingredienti</ion-button
            >
          </div>
        </ion-card>
        <p v-if="dishesToDisplay.length === 0" class="ion-text-center ion-padding-top">
          Nessun piatto salvato.
        </p>
      </div>

      <!-- Action Sheet per il menu del piatto -->
      <ion-action-sheet
        :is-open="showActionSheet"
        :header="selectedDish?.name"
        :buttons="actionSheetButtons"
        @didDismiss="showActionSheet = false"
      ></ion-action-sheet>

      <!-- Action Sheet per il menu della cartella (NUOVO) -->
      <ion-action-sheet
        :is-open="showFolderActionSheet"
        :header="selectedFolder?.name"
        :buttons="folderActionSheetButtons"
        @didDismiss="showFolderActionSheet = false"
      ></ion-action-sheet>

      <!-- Modale per la duplicazione del piatto -->
      <ion-modal :is-open="showDuplicateModal" @didDismiss="showDuplicateModal = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>Duplica Piatto</ion-title>
            <template v-slot:end>
              <ion-buttons>
                <ion-button @click="showDuplicateModal = false">Chiudi</ion-button>
              </ion-buttons>
            </template>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-item>
            <ion-label position="floating" for="newDishNameInput"
              >Nuovo nome del piatto (opzionale)</ion-label
            >
            <ion-input id="newDishNameInput" v-model="newDishName"></ion-input>
          </ion-item>
          <ion-button expand="block" class="ion-margin-top" @click="confirmDuplicate"
            >Duplica</ion-button
          >
        </ion-content>
      </ion-modal>

      <!-- Modale di conferma eliminazione piatto -->
      <ion-modal :is-open="showDeleteConfirm" @didDismiss="showDeleteConfirm = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>Conferma Eliminazione</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding ion-text-center">
          <p>Sei sicuro di voler eliminare il piatto "{{ selectedDish?.name }}"?</p>
          <ion-button color="danger" @click="confirmDelete">Sì, elimina</ion-button>
          <ion-button fill="outline" @click="showDeleteConfirm = false">No, annulla</ion-button>
        </ion-content>
      </ion-modal>

      <!-- Modale per la creazione di una nuova cartella -->
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

      <!-- Action Sheet per le opzioni "Aggiungi a Cartella" (per i piatti) -->
      <ion-action-sheet
        :is-open="showAddToFolderOptions"
        header="Aggiungi a Cartella"
        :buttons="addToFolderOptionsButtons"
        @didDismiss="showAddToFolderOptions = false"
      ></ion-action-sheet>

      <!-- Modale per selezionare una cartella esistente (per i piatti) -->
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
              @click="addSelectedDishToFolder(folder.id)"
            >
              <ion-label>{{ folder.name }}</ion-label>
            </ion-item>
          </ion-list>
          <p v-else class="ion-text-center ion-padding">
            Nessuna cartella disponibile. Crea una nuova cartella.
          </p>
        </ion-content>
      </ion-modal>

      <!-- Modale di conferma eliminazione cartella (NUOVO) -->
      <ion-modal :is-open="showDeleteFolderConfirm" @didDismiss="showDeleteFolderConfirm = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>Conferma Eliminazione Cartella</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding ion-text-center">
          <p>
            Sei sicuro di voler eliminare la cartella "{{ folderToDelete?.name }}"? Tutti i piatti
            al suo interno rimarranno salvati ma non saranno più associati a questa cartella.
          </p>
          <ion-button color="danger" @click="deleteFolder">Sì, elimina</ion-button>
          <ion-button fill="outline" @click="showDeleteFolderConfirm = false"
            >No, annulla</ion-button
          >
        </ion-content>
      </ion-modal>

      <!-- Modale per rinominare cartella (NUOVO) -->
      <ion-modal :is-open="showRenameFolderModal" @didDismiss="showRenameFolderModal = false">
        <ion-header>
          <ion-toolbar>
            <ion-title>Rinomina Cartella</ion-title>
            <template v-slot:end>
              <ion-buttons>
                <ion-button @click="showRenameFolderModal = false">Annulla</ion-button>
              </ion-buttons>
            </template>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-item>
            <ion-label position="floating" for="renameFolderNameInput"
              >Nuovo nome cartella</ion-label
            >
            <ion-input id="renameFolderNameInput" v-model="renamedFolderName" required></ion-input>
          </ion-item>
          <ion-button
            expand="block"
            class="ion-margin-top"
            @click="confirmRenameFolder"
            :disabled="!renamedFolderName.trim()"
            >Rinomina</ion-button
          >
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useDishesStore } from '../stores/dishes'
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonIcon,
  IonCard,
  IonItem,
  IonButton,
  IonText,
  IonActionSheet,
  IonModal,
  IonInput,
  IonList,
  IonSearchbar,
  IonGrid,
  IonRow,
  IonCol,
  IonCardContent,
  IonCardHeader, // Aggiunti per il layout a griglia
} from '@ionic/vue'
import {
  folderOutline,
  chevronForwardOutline,
  ellipsisVertical,
  expandOutline,
  contractOutline,
  createOutline,
  copyOutline,
  trashOutline,
  folderOpenOutline,
  addCircleOutline as addCircleOutlineIcon,
  addOutline, // Aggiunto per il pulsante "Crea nuova cartella" nella griglia
} from 'ionicons/icons'

const router = useRouter()
const dishesStore = useDishesStore()

const currentView = ref('folders') // 'folders' o 'dishes'
const selectedFolderId = ref(null) // Usato per filtrare i piatti se si visualizza una cartella

const expandedDishId = ref(null)

const showActionSheet = ref(false)
const selectedDish = ref(null)

const showDuplicateModal = ref(false)
const newDishName = ref('')

const showDeleteConfirm = ref(false)

const showCreateFolderModal = ref(false)
const newFolderName = ref('')

const showAddToFolderOptions = ref(false)
const showSelectFolderModal = ref(false)

// NUOVO: Stato per il menu delle opzioni della cartella
const showFolderActionSheet = ref(false)
const selectedFolder = ref(null)

// NUOVO: Stato per la modale di conferma eliminazione cartella
const showDeleteFolderConfirm = ref(false)
const folderToDelete = ref(null)

// NUOVO: Stato per la modale di rinomina cartella
const showRenameFolderModal = ref(false)
const renamedFolderName = ref('')

const dishesToDisplay = computed(() => {
  if (selectedFolderId.value) {
    return dishesStore.getDishesInFolder(selectedFolderId.value)
  }
  return dishesStore.dishes
})

const viewFolder = (folderId) => {
  selectedFolderId.value = folderId
  currentView.value = 'dishes'
  expandedDishId.value = null
}

const openDishMenu = (dish) => {
  console.log('DEBUG: openDishMenu chiamato per piatto:', dish.name)
  selectedDish.value = dish
  showActionSheet.value = true
  console.log('DEBUG: showActionSheet impostato a:', showActionSheet.value)
  if (expandedDishId.value === dish.id) {
    expandedDishId.value = null
  }
}

// NUOVO: Funzione per aprire il menu delle opzioni della cartella
const openFolderMenu = (folder) => {
  console.log('DEBUG: openFolderMenu chiamato per cartella:', folder.name)
  selectedFolder.value = folder
  showFolderActionSheet.value = true
}

// NUOVO: Bottoni per l'Action Sheet del menu della cartella
const folderActionSheetButtons = computed(() => [
  {
    text: 'Rinomina',
    icon: createOutline,
    handler: () => {
      console.log('DEBUG: Rinomina cartella cliccato per:', selectedFolder.value?.name)
      if (selectedFolder.value) {
        renamedFolderName.value = selectedFolder.value.name // Pre-compila con il nome attuale
        showRenameFolderModal.value = true
      }
      return true
    },
  },
  {
    text: 'Elimina',
    icon: trashOutline,
    role: 'destructive',
    handler: () => {
      console.log('DEBUG: Elimina cartella cliccato per:', selectedFolder.value?.name)
      showDeleteFolderConfirm.value = true
      return true
    },
  },
  {
    text: 'Annulla',
    role: 'cancel',
    handler: () => {
      console.log('DEBUG: Annulla menu cartella.')
      selectedFolder.value = null
      return true
    },
  },
])

// NUOVO: Funzione per confermare la rinomina della cartella
const confirmRenameFolder = () => {
  const newName = renamedFolderName.value.trim()
  if (newName && selectedFolder.value) {
    dishesStore.renameFolder(selectedFolder.value.id, newName)
    showRenameFolderModal.value = false
    selectedFolder.value = null
    renamedFolderName.value = ''
  }
}

// NUOVO: Funzione per confermare l'eliminazione della cartella
const deleteFolder = () => {
  if (folderToDelete.value) {
    dishesStore.deleteFolder(folderToDelete.value.id)
    showDeleteFolderConfirm.value = false
    folderToDelete.value = null
  }
}

const actionSheetButtons = computed(() => [
  {
    text: expandedDishId.value === selectedDish.value?.id ? 'Nascondi dettagli' : 'Vedi di più',
    icon: expandedDishId.value === selectedDish.value?.id ? contractOutline : expandOutline,
    handler: () => {
      console.log('DEBUG: Vedi di più/Nascondi dettagli cliccato per:', selectedDish.value?.name)
      if (selectedDish.value) {
        expandedDishId.value =
          expandedDishId.value === selectedDish.value.id ? null : selectedDish.value.id
      }
      return true
    },
  },
  {
    text: 'Aggiungi a una cartella',
    icon: folderOpenOutline,
    handler: () => {
      console.log('DEBUG: Aggiungi a una cartella cliccato per:', selectedDish.value?.name)
      showAddToFolderOptions.value = true
      return true
    },
  },
  {
    text: 'Modifica',
    icon: createOutline,
    handler: () => {
      console.log('DEBUG: Modifica cliccato per:', selectedDish.value?.name)
      if (selectedDish.value) {
        router.push({ name: 'AddPlateDetails', query: { dishId: selectedDish.value.id } })
      }
      return true
    },
  },
  {
    text: 'Duplica',
    icon: copyOutline,
    handler: () => {
      console.log('DEBUG: Duplica cliccato per:', selectedDish.value?.name)
      if (selectedDish.value) {
        newDishName.value = ''
        showDuplicateModal.value = true
      }
      return true
    },
  },
  {
    text: 'Elimina',
    icon: trashOutline,
    role: 'destructive',
    handler: () => {
      console.log('DEBUG: Elimina cliccato per:', selectedDish.value?.name)
      showDeleteConfirm.value = true
      return true
    },
  },
  {
    text: 'Annulla',
    role: 'cancel',
    handler: () => {
      console.log('DEBUG: Annulla cliccato.')
      selectedDish.value = null
      return true
    },
  },
])

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

const confirmDuplicate = () => {
  console.log(
    'DEBUG: Conferma duplicazione per:',
    selectedDish.value?.name,
    'Nuovo nome:',
    newDishName.value,
  )
  if (selectedDish.value) {
    dishesStore.duplicateDish(selectedDish.value.id, newDishName.value)
    showDuplicateModal.value = false
    selectedDish.value = null
    newDishName.value = ''
  }
}

const confirmDelete = () => {
  console.log('DEBUG: Conferma eliminazione per:', selectedDish.value?.name)
  if (selectedDish.value) {
    dishesStore.deleteDish(selectedDish.value.id)
    showDeleteConfirm.value = false
    selectedDish.value = null
  }
}

const viewIngredients = (dish) => {
  console.log('DEBUG: Visualizza ingredienti per:', dish.name)
  router.push({ name: 'IngredientsPage', params: { dishId: dish.id } })
}

const openCreateFolderModal = () => {
  newFolderName.value = ''
  showCreateFolderModal.value = true
}

const confirmCreateFolder = () => {
  const folderName = newFolderName.value.trim()
  if (folderName) {
    dishesStore.addFolder(folderName)
    showCreateFolderModal.value = false
    newFolderName.value = ''
  }
}

const addSelectedDishToFolder = (folderId) => {
  if (selectedDish.value && folderId) {
    dishesStore.addDishToFolder(selectedDish.value.id, folderId)
    console.log(`DEBUG: Piatto '${selectedDish.value.name}' aggiunto alla cartella '${folderId}'`)
    showSelectFolderModal.value = false
    selectedDish.value = null
  }
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

.search-saved-bar {
  --background: #f0f0f0;
  --border-radius: 10px;
  margin-bottom: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.view-toggle-segment {
  margin-bottom: 20px;
}

/* Stili per le card dei piatti (esistenti) */
.dish-card {
  margin-top: 15px;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  background-color: #ffffff;
}

.dish-item-container {
  position: relative;
  --background: transparent;
  --padding-start: 16px;
  --inner-padding-end: 16px;
  --min-height: 60px;
  font-size: 1.05em;
  color: #333;
  border-radius: 10px;
  margin-bottom: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.dish-item-container h2 {
  font-size: 1.1em;
  font-weight: bold;
  color: #333;
}

.dish-item-container p {
  font-size: 0.9em;
  color: #666;
}

.dish-item-container ion-icon[slot='start'] {
  font-size: 1.5em;
  color: #2196f3;
}

.ellipsis-div-button {
  position: absolute !important;
  right: 10px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  width: 44px !important;
  height: 44px !important;
  min-width: 44px !important;
  min-height: 44px !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center !important;
  z-index: 10;
  cursor: pointer;
}

.ellipsis-div-button ion-icon {
  font-size: 1.5em !important;
  color: #999 !important;
}

.dish-details {
  background-color: #f0f0f0;
  border-radius: 0 0 15px 15px;
  padding: 10px 0;
  border-top: 1px solid #eee;
}

.dish-details ion-item {
  --background: transparent;
  --padding-start: 32px;
  --inner-padding-end: 16px;
  font-size: 0.95em;
  color: #555;
}

.dish-details ion-item ion-label {
  font-weight: normal;
}

.dish-details ion-item ion-text {
  font-weight: bold;
  color: #333;
}

.dish-details ion-button {
  margin: 10px 16px;
  --border-radius: 8px;
  height: 40px;
  font-size: 0.9em;
}

/* NUOVI STILI PER LA GRIGLIA DELLE CARTELLE */
.folder-grid {
  padding: 0; /* Rimuovi il padding predefinito della griglia */
}

.folder-grid ion-col {
  padding: 8px; /* Spazio tra le card */
}

.folder-grid-card {
  margin: 0; /* Rimuovi il margine predefinito delle card */
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  background-color: #ffffff;
  height: 150px; /* Altezza fissa per le card delle cartelle */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative; /* Per posizionare il pulsante ellipsis */
}

.folder-card-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 10px;
}

.folder-grid-card .folder-icon-wrapper {
  font-size: 3em; /* Icona grande */
  color: #2196f3;
  margin-bottom: 5px;
}

.folder-grid-card h3 {
  font-size: 1.1em;
  font-weight: bold;
  color: #333;
  margin: 0;
  white-space: nowrap; /* Impedisce al testo di andare a capo */
  overflow: hidden; /* Nasconde il testo in eccesso */
  text-overflow: ellipsis; /* Aggiunge i puntini di sospensione */
  max-width: 90%; /* Limita la larghezza del testo */
}

.folder-grid-card p {
  font-size: 0.8em;
  color: #666;
  margin: 0;
}

.folder-ellipsis-button {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}

.folder-ellipsis-button ion-icon {
  font-size: 1.2em;
  color: #999;
}

/* Stili per la card "Crea nuova cartella" */
.create-folder-card {
  margin: 0;
  border-radius: 15px;
  border: 2px dashed #ccc; /* Bordo tratteggiato */
  background-color: #f9f9f9;
  height: 150px; /* Altezza fissa */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: #666;
  box-shadow: none; /* Nessuna ombra per questa card */
}

.create-folder-card .create-folder-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 10px;
}

.create-folder-card ion-icon {
  font-size: 3em; /* Icona grande */
  color: #666;
  margin-bottom: 5px;
}

.create-folder-card h3 {
  font-size: 1.1em;
  font-weight: bold;
  color: #666;
  margin: 0;
}
</style>
