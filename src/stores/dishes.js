import { defineStore } from 'pinia'

export const useDishesStore = defineStore('dishes', {
  state: () => ({
    folders: [
      { id: 'f1', name: 'Preferiti', dishIds: ['d1', 'd2'] },
      { id: 'f2', name: 'Ricette Veloci', dishIds: ['d3'] },
      { id: 'f3', name: 'Cene Speciali', dishIds: [] },
    ],
    dishes: [
      {
        id: 'd1',
        name: 'Pasta al Pesto',
        kcal: 450,
        carbs: 60,
        proteins: 15,
        fats: 18,
        ingredients: ['Pasta (100g)', 'Pesto (50g)', 'Parmigiano (10g)'],
      },
      {
        id: 'd2',
        name: 'Petto di Pollo e Verdure',
        kcal: 320,
        carbs: 20,
        proteins: 40,
        fats: 10,
        ingredients: ['Petto di pollo (150g)', 'Broccoli (100g)', 'Carote (50g)', 'Olio EVO (5g)'],
      },
      {
        id: 'd3',
        name: 'Insalata Mista con Tonno',
        kcal: 280,
        carbs: 10,
        proteins: 25,
        fats: 15,
        ingredients: [
          'Lattuga (80g)',
          'Pomodori (100g)',
          "Tonno sott'olio (80g)",
          'Mais (30g)',
          'Olio EVO (5g)',
        ],
      },
      {
        id: 'd4',
        name: 'Smoothie Proteico',
        kcal: 180,
        carbs: 25,
        proteins: 20,
        fats: 2,
        ingredients: ['Banana (100g)', 'Proteine in polvere (30g)', 'Latte scremato (200ml)'],
      },
    ],
  }),
  actions: {
    addDish(dish) {
      // Genera un ID semplice per ora, in un'app reale useresti qualcosa di più robusto
      dish.id = 'd' + (this.dishes.length + 1)
      this.dishes.push(dish)
    },
    updateDish(updatedDish) {
      const index = this.dishes.findIndex((d) => d.id === updatedDish.id)
      if (index !== -1) {
        this.dishes[index] = { ...updatedDish }
      }
    },
    duplicateDish(dishId, newName = null) {
      const originalDish = this.dishes.find((d) => d.id === dishId)
      if (originalDish) {
        const duplicated = { ...originalDish }
        duplicated.id = 'd' + (this.dishes.length + 1) // Nuovo ID
        duplicated.name = newName || `${originalDish.name} (copia)`
        this.dishes.push(duplicated)
      }
    },
    deleteDish(dishId) {
      this.dishes = this.dishes.filter((d) => d.id !== dishId)
      // Rimuovi il piatto anche dalle cartelle
      this.folders.forEach((folder) => {
        folder.dishIds = folder.dishIds.filter((id) => id !== dishId)
      })
    },
    addFolder(folderName) {
      const newFolder = { id: 'f' + (this.folders.length + 1), name: folderName, dishIds: [] }
      this.folders.push(newFolder)
    },
    deleteFolder(folderId) {
      this.folders = this.folders.filter((f) => f.id !== folderId)
      // Non eliminiamo i piatti contenuti, li lasciamo nell'elenco generale se non sono in altre cartelle
    },
    addDishToFolder(dishId, folderId) {
      const folder = this.folders.find((f) => f.id === folderId)
      if (folder && !folder.dishIds.includes(dishId)) {
        folder.dishIds.push(dishId)
      }
    },
    removeDishFromFolder(dishId, folderId) {
      const folder = this.folders.find((f) => f.id === folderId)
      if (folder) {
        folder.dishIds = folder.dishIds.filter((id) => id !== dishId)
      }
    },
  },
  getters: {
    getDishById: (state) => (id) => {
      return state.dishes.find((dish) => dish.id === id)
    },
    getDishesInFolder: (state) => (folderId) => {
      const folder = state.folders.find((f) => f.id === folderId)
      if (folder) {
        return folder.dishIds
          .map((dishId) => state.dishes.find((d) => d.id === dishId))
          .filter(Boolean)
      }
      return []
    },
  },
})
