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
    dailyTargetCarbs: 250,
    dailyTargetProteins: 150,
    dailyTargetFats: 67,
    waterTargetLiters: 2.5,

    dailyBurnedKcal: 0,

    historicalDailyData: {
      '2025-07-01': {
        kcal: 1900,
        targetKcal: 2000,
        carbs: 200,
        proteins: 100,
        fats: 60,
        burnedKcal: 300,
        waterConsumedLiters: 2.0,
      },
      '2025-07-02': {
        kcal: 1500,
        targetKcal: 2000,
        carbs: 150,
        proteins: 70,
        fats: 50,
        burnedKcal: 250,
        waterConsumedLiters: 1.5,
      },
      '2025-07-03': {
        kcal: 2050,
        targetKcal: 2000,
        carbs: 220,
        proteins: 110,
        fats: 70,
        burnedKcal: 400,
        waterConsumedLiters: 2.8,
      },
      '2025-07-04': {
        kcal: 1850,
        targetKcal: 2000,
        carbs: 190,
        proteins: 95,
        fats: 65,
        burnedKcal: 350,
        waterConsumedLiters: 2.2,
      },
    },
    currentDateString: new Date().toISOString().slice(0, 10),

    // NUOVO: Stato per le attività fisiche
    physicalActivities: [], // Assicurati che questa riga sia presente
    // NUOVO: Stato per le misurazioni del peso
    weightMeasurements: [], // Assicurati che questa riga sia presente
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
      this.dailyTargetCarbs = 250
      this.dailyTargetProteins = 150
      this.dailyTargetFats = 67
      this.waterTargetLiters = 2.5
      this.dailyBurnedKcal = 0
      this.historicalDailyData = {}
      this.currentDateString = new Date().toISOString().slice(0, 10)
      this.physicalActivities = [] // Reset anche delle attività
      this.weightMeasurements = [] // Reset anche delle misurazioni peso
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
      // Aggiorna historicalDailyData per il giorno corrente
      if (!this.historicalDailyData[this.currentDateString]) {
        this.historicalDailyData[this.currentDateString] = {
          kcal: 0,
          carbs: 0,
          proteins: 0,
          fats: 0,
          targetKcal: this.dailyTargetKcal,
          burnedKcal: this.dailyBurnedKcal,
          waterConsumedLiters: 0,
        }
      }
      this.historicalDailyData[this.currentDateString].kcal = this.dailyTotals.kcal
      this.historicalDailyData[this.currentDateString].carbs = this.dailyTotals.carbs
      this.historicalDailyData[this.currentDateString].proteins = this.dailyTotals.proteins
      this.historicalDailyData[this.currentDateString].fats = this.dailyTotals.fats
    },
    setDailyBurnedKcal(burnedKcal) {
      this.dailyBurnedKcal = burnedKcal
      if (!this.historicalDailyData[this.currentDateString]) {
        this.historicalDailyData[this.currentDateString] = {
          kcal: 0,
          carbs: 0,
          proteins: 0,
          fats: 0,
          targetKcal: this.dailyTargetKcal,
          waterConsumedLiters: 0,
        }
      }
      this.historicalDailyData[this.currentDateString].burnedKcal = burnedKcal
    },
    setWaterConsumedLiters(liters) {
      if (!this.historicalDailyData[this.currentDateString]) {
        this.historicalDailyData[this.currentDateString] = {
          kcal: this.dailyTotals.kcal,
          carbs: this.dailyTotals.carbs,
          proteins: this.dailyTotals.proteins,
          fats: this.dailyTotals.fats,
          targetKcal: this.dailyTargetKcal,
          burnedKcal: this.dailyBurnedKcal,
          waterConsumedLiters: 0,
        }
      }
      this.historicalDailyData[this.currentDateString].waterConsumedLiters = liters
    },
    setGoals(goals) {
      if (goals.dailyTargetKcal !== undefined) this.dailyTargetKcal = goals.dailyTargetKcal
      if (goals.dailyTargetCarbs !== undefined) this.dailyTargetCarbs = goals.dailyTargetCarbs
      if (goals.dailyTargetProteins !== undefined)
        this.dailyTargetProteins = goals.dailyTargetProteins
      if (goals.dailyTargetFats !== undefined) this.dailyTargetFats = goals.dailyTargetFats
      if (goals.waterTargetLiters !== undefined) this.waterTargetLiters = goals.waterTargetLiters
    },
    resetDailyLog() {
      this.dailyLog = { Colazione: [], Pranzo: [], Cena: [], Spuntino: [] }
      this.dailyTotals = { kcal: 0, carbs: 0, proteins: 0, fats: 0 }
      this.dailyBurnedKcal = 0
      if (this.historicalDailyData[this.currentDateString]) {
        this.historicalDailyData[this.currentDateString].waterConsumedLiters = 0
      }
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
        this.waterConsumedLiters = data.waterConsumedLiters || 0
        this.dailyLog = { Colazione: [], Pranzo: [], Cena: [], Spuntino: [] }
        this.currentDateString = dateString
      } else {
        this.dailyTotals = { kcal: 0, carbs: 0, proteins: 0, fats: 0 }
        this.dailyBurnedKcal = 0
        this.waterConsumedLiters = 0
        this.dailyLog = { Colazione: [], Pranzo: [], Cena: [], Spuntino: [] }
        this.currentDateString = dateString
      }
    },

    // NUOVO: Azioni per le attività fisiche
    addPhysicalActivity(activity) {
      const newId = Date.now().toString() // ID unico basato sul timestamp
      this.physicalActivities.push({ id: newId, ...activity })
    },
    updatePhysicalActivity(updatedActivity) {
      const index = this.physicalActivities.findIndex((act) => act.id === updatedActivity.id)
      if (index !== -1) {
        this.physicalActivities[index] = { ...updatedActivity }
      }
    },
    deletePhysicalActivity(activityId) {
      this.physicalActivities = this.physicalActivities.filter((act) => act.id !== activityId)
    },

    // NUOVO: Azioni per le misurazioni del peso
    addWeightMeasurement(measurement) {
      const newId = Date.now().toString() // ID unico basato sul timestamp
      this.weightMeasurements.push({ id: newId, ...measurement })
      // Ordina le misurazioni per data (più recente in cima)
      this.weightMeasurements.sort((a, b) => new Date(b.date) - new Date(a.date))
    },
    updateWeightMeasurement(updatedMeasurement) {
      const index = this.weightMeasurements.findIndex((meas) => meas.id === updatedMeasurement.id)
      if (index !== -1) {
        this.weightMeasurements[index] = { ...updatedMeasurement }
        // Riordina dopo l'aggiornamento
        this.weightMeasurements.sort((a, b) => new Date(b.date) - new Date(a.date))
      }
    },
    deleteWeightMeasurement(measurementId) {
      this.weightMeasurements = this.weightMeasurements.filter((meas) => meas.id !== measurementId)
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
    getCurrentWaterConsumedLiters: (state) => {
      return state.historicalDailyData[state.currentDateString]?.waterConsumedLiters || 0
    },
    getDailySummary: (state) => (dateString) => {
      return state.historicalDailyData[dateString]
    },
  },
})
