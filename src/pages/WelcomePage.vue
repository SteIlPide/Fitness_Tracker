<template>
  <ion-page>
    <ion-content :fullscreen="true" class="ion-padding ion-text-center">
      <div class="welcome-container">
        <!-- Immagine del wireframe:  -->
        <img
          src="https://placehold.co/200x200/cccccc/333333?text=Logo+App"
          alt="Logo dell'App"
          class="app-logo"
        />
        <h1 class="ion-text-center">BENVENUTO NELLA NOSTRA APP!</h1>
        <ion-button expand="block" @click="startOnboarding">Iniziamo!</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { IonPage, IonContent, IonButton } from '@ionic/vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Funzione per navigare alla prossima schermata
const startOnboarding = () => {
  router.push('/input-dati') // Naviga alla pagina di inserimento dati
}
</script>

<style scoped>
.welcome-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 20px;
}

.app-logo {
  margin-bottom: 40px;
  border-radius: 15px; /* Angoli arrotondati per il logo */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Ombra leggera */
}

h1 {
  font-size: 1.8em;
  margin-bottom: 50px;
  color: #333;
}

ion-button {
  --border-radius: 10px; /* Angoli arrotondati per il pulsante */
  height: 50px;
  font-size: 1.1em;
  --background: #4caf50; /* Colore di sfondo del pulsante */
  --background-activated: #45a049; /* Colore al click */
  --box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* Ombra per il pulsante */
}
</style>
