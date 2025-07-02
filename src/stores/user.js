import { defineStore } from 'pinia'

// Definisci lo store 'user'
export const useUserStore = defineStore('user', {
  // Lo stato è una funzione che restituisce l'oggetto reattivo
  state: () => ({
    userData: {
      sesso: '',
      altezza: null,
      eta: null,
      peso: null,
      livelloAttivita: '',
      obiettivoPercorso: '',
      pesoObiettivo: null,
      tipoDieta: '',
      cibiEsclusi: [],
    },
  }),
  // Le azioni sono metodi per modificare lo stato
  actions: {
    setUserData(data) {
      this.userData = { ...data } // Aggiorna l'intero oggetto userData
    },
    resetUserData() {
      // Puoi aggiungere una funzione per resettare i dati se necessario
      this.userData = {
        sesso: '',
        altezza: null,
        eta: null,
        peso: null,
        livelloAttivita: '',
        obiettivoPercorso: '',
        pesoObiettivo: null,
        tipoDieta: '',
        cibiEsclusi: [],
      }
    },
  },
  // I getters sono funzioni per derivare lo stato
  getters: {
    // Esempio: un getter per verificare se i dati utente sono stati inseriti
    hasUserData: (state) => state.userData.sesso !== '' && state.userData.peso !== null,
  },
})
