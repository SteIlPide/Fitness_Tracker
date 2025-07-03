<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <template v-slot:start>
          <ion-buttons>
            <ion-back-button></ion-back-button>
          </ion-buttons>
        </template>
        <ion-title>Obiettivi</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding ion-text-center">
      <h1>Questa è la pagina Obiettivi</h1>
      <p>Qui potrai impostare e monitorare i tuoi obiettivi di fitness.</p>
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
