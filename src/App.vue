<!--
<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

    <div class="wrapper">
      <HelloWorld msg="You did itt!" />
    </div>
  </header>

  <main>
    <TheWelcome />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
-->
<template>
  <!-- ion-app è il contenitore principale per le app Ionic -->
  <ion-app>
    <!-- ion-router-outlet è dove Vue Router renderà i tuoi componenti di pagina -->
    <ion-router-outlet />
  </ion-app>
</template>

<script setup>
import { IonApp, IonRouterOutlet } from '@ionic/vue'
// Non sono necessari altri script o logiche complesse qui,
// App.vue serve principalmente come contenitore per il router.
</script>

<style>
/* Puoi aggiungere stili globali qui se necessario,
   ma per la maggior parte degli stili userai i file CSS di Ionic
   e gli stili scoped nei singoli componenti delle pagine. */
</style>
