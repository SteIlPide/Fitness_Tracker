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
    dailyLog: {
      Colazione: [],
      Pranzo: [],
      Cena: [],
      Spuntino: [],
    },
    dailyTotals: {
      kcal: 0,
      carbs: 0,
      proteins: 0,
      fats: 0,
    },
    dailyTargetKcal: 2000,
    dailyBurnedKcal: 0,

    historicalDailyData: {
      '2025-07-01': { kcal: 1900, targetKcal: 2000, carbs: 200, proteins: 100, fats: 60 },
      '2025-07-02': { kcal: 1500, targetKcal: 2000, carbs: 150, proteins: 70, fats: 50 },
      '2025-07-03': { kcal: 2050, targetKcal: 2000, carbs: 220, proteins: 110, fats: 70 },
      '2025-07-04': { kcal: 1850, targetKcal: 2000, carbs: 190, proteins: 95, fats: 65 },
    },
    currentDateString: new Date().toISOString().slice(0, 10),
  }),
  actions: {
    setUserData(data) {
      this.userData = { ...data }
    },
    resetUserData() {
      this.userData = {
        /* ... */
      }
      this.dailyLog = { Colazione: [], Pranzo: [], Cena: [], Spuntino: [] }
      this.dailyTotals = { kcal: 0, carbs: 0, proteins: 0, fats: 0 }
      this.dailyTargetKcal = 2000
      this.dailyBurnedKcal = 0
      this.historicalDailyData = {}
      this.currentDateString = new Date().toISOString().slice(0, 10)
    },
    addFoodEntryToMeal(mealType, foodEntry) {
      if (this.dailyLog[mealType]) {
        this.dailyLog[mealType].push(foodEntry)
        this.updateDailyTotals(foodEntry.kcal, foodEntry.carbs, foodEntry.proteins, foodEntry.fats)
      } else {
        console.error(`Tipo di pasto non valido: ${mealType}`)
      }
    },
    updateDailyTotals(kcal, carbs, proteins, fats) {
      this.dailyTotals.kcal += kcal
      this.dailyTotals.carbs += carbs
      this.dailyTotals.proteins += proteins
      this.dailyTotals.fats += fats
      this.historicalDailyData[this.currentDateString] = {
        ...this.dailyTotals,
        targetKcal: this.dailyTargetKcal,
      }
    },
    setDailyBurnedKcal(burnedKcal) {
      this.dailyBurnedKcal = burnedKcal
      // Aggiorna anche i dati storici per il giorno corrente
      // Assicurati che l'oggetto esista prima di aggiungere burnedKcal
      if (!this.historicalDailyData[this.currentDateString]) {
        this.historicalDailyData[this.currentDateString] = {
          kcal: 0,
          carbs: 0,
          proteins: 0,
          fats: 0,
          targetKcal: this.dailyTargetKcal,
        }
      }
      this.historicalDailyData[this.currentDateString].burnedKcal = burnedKcal
    },
    resetDailyLog() {
      this.dailyLog = { Colazione: [], Pranzo: [], Cena: [], Spuntino: [] }
      this.dailyTotals = { kcal: 0, carbs: 0, proteins: 0, fats: 0 }
      this.dailyBurnedKcal = 0
    },
    loadDailyData(dateString) {
      const data = this.historicalDailyData[dateString]
      if (data) {
        this.dailyTotals = {
          kcal: data.kcal || 0,
          carbs: data.carbs || 0,
          proteins: data.proteins || 0,
          fats: data.fats || 0,
        }
        this.dailyTargetKcal = data.targetKcal || 2000
        this.dailyBurnedKcal = data.burnedKcal || 0
        this.dailyLog = { Colazione: [], Pranzo: [], Cena: [], Spuntino: [] } // Per ora, log vuoto per storico
        this.currentDateString = dateString
      } else {
        this.dailyTotals = { kcal: 0, carbs: 0, proteins: 0, fats: 0 }
        this.dailyBurnedKcal = 0
        this.dailyLog = { Colazione: [], Pranzo: [], Cena: [], Spuntino: [] }
        this.currentDateString = dateString
      }
    },
  },
  getters: {
    hasUserData: (state) => state.userData.sesso !== '' && state.userData.peso !== null,
    remainingKcal: (state) => {
      return state.dailyTargetKcal - state.dailyTotals.kcal + state.dailyBurnedKcal
    },
    getMealKcal: (state) => (mealType) => {
      return state.dailyLog[mealType]
        ? state.dailyLog[mealType].reduce((sum, entry) => sum + entry.kcal, 0)
        : 0
    },
    getDailySummary: (state) => (dateString) => {
      return state.historicalDailyData[dateString]
    },
    // NUOVO: Getter per ottenere i macronutrienti di un pasto specifico
    getMealMacros: (state) => (mealType) => {
      const mealEntries = state.dailyLog[mealType] || []
      return mealEntries.reduce(
        (totals, entry) => {
          totals.carbs += entry.carbs || 0
          totals.proteins += entry.proteins || 0
          totals.fats += entry.fats || 0
          return totals
        },
        { carbs: 0, proteins: 0, fats: 0 },
      )
    },
  },
})
