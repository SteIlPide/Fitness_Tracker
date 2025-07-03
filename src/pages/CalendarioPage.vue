<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <template v-slot:start>
          <ion-buttons>
            <ion-back-button></ion-back-button>
          </ion-buttons>
        </template>
        <ion-title>Calendario</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding ion-text-center">
      <h1>Questa è la pagina Calendario</h1>
      <p>Qui potrai visualizzare il tuo storico e pianificare i pasti.</p>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
} from '@ionic/vue'
</script>

<style scoped>
h1 {
  margin-top: 50px;
  color: #333;
}
p {
  color: #666;
}
</style>
