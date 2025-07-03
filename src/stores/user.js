import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
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
    // Nuovo: Log giornaliero dei cibi consumati
    dailyLog: {
      Colazione: [],
      Pranzo: [],
      Cena: [],
      Spuntino: [],
    },
    // Nuovi: Totali giornalieri calcolati
    dailyTotals: {
      kcal: 0,
      carbs: 0,
      proteins: 0,
      fats: 0,
    },
    dailyTargetKcal: 2000, // Esempio: questo andrebbe calcolato in base a userData
    dailyBurnedKcal: 0, // Calorie bruciate con l'attività
  }),
  actions: {
    setUserData(data) {
      this.userData = { ...data }
      // Qui potresti anche calcolare il dailyTargetKcal in base ai dati utente
      // this.calculateDailyTargetKcal();
    },
    resetUserData() {
      this.userData = {
        /* ... */
      }
      this.dailyLog = { Colazione: [], Pranzo: [], Cena: [], Spuntino: [] }
      this.dailyTotals = { kcal: 0, carbs: 0, proteins: 0, fats: 0 }
      this.dailyTargetKcal = 2000
      this.dailyBurnedKcal = 0
    },
    // Azione per aggiungere un cibo a un pasto specifico
    addFoodEntryToMeal(mealType, foodEntry) {
      if (this.dailyLog[mealType]) {
        this.dailyLog[mealType].push(foodEntry)
        this.updateDailyTotals(foodEntry.kcal, foodEntry.carbs, foodEntry.proteins, foodEntry.fats)
      } else {
        console.error(`Tipo di pasto non valido: ${mealType}`)
      }
    },
    // Azione per aggiornare i totali giornalieri
    updateDailyTotals(kcal, carbs, proteins, fats) {
      this.dailyTotals.kcal += kcal
      this.dailyTotals.carbs += carbs
      this.dailyTotals.proteins += proteins
      this.dailyTotals.fats += fats
    },
    // Azione per aggiornare le calorie bruciate
    setDailyBurnedKcal(burnedKcal) {
      this.dailyBurnedKcal = burnedKcal
    },
    // Azione per resettare il log giornaliero (es. a fine giornata)
    resetDailyLog() {
      this.dailyLog = { Colazione: [], Pranzo: [], Cena: [], Spuntino: [] }
      this.dailyTotals = { kcal: 0, carbs: 0, proteins: 0, fats: 0 }
      this.dailyBurnedKcal = 0
    },
    // calculateDailyTargetKcal() {
    //   // Logica per calcolare il fabbisogno calorico giornaliero
    //   // in base a this.userData (sesso, età, peso, altezza, livelloAttivita, obiettivoPercorso)
    //   // Questo è un calcolo complesso che andrebbe implementato qui.
    //   // Per ora, dailyTargetKcal è un valore fisso.
    // }
  },
  getters: {
    hasUserData: (state) => state.userData.sesso !== '' && state.userData.peso !== null,
    // Getter per le calorie rimanenti
    remainingKcal: (state) => {
      return state.dailyTargetKcal - state.dailyTotals.kcal + state.dailyBurnedKcal
    },
    // Getter per le calorie mangiate per pasto (per la HomePage)
    getMealKcal: (state) => (mealType) => {
      return state.dailyLog[mealType]
        ? state.dailyLog[mealType].reduce((sum, entry) => sum + entry.kcal, 0)
        : 0
    },
  },
})
