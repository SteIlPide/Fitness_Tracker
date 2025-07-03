import { defineStore } from 'pinia'

export const useFoodStore = defineStore('food', {
  state: () => ({
    // Lista di piatti/cibi di esempio (valori per 100g)
    availableFoods: [
      {
        id: '1',
        name: 'Pasta al pomodoro',
        kcal: 150,
        carbs: 25,
        proteins: 5,
        fats: 3,
        ingredients: [
          { name: 'Pasta', quantity: 80, unit: 'g' },
          { name: 'Pomodoro', quantity: 70, unit: 'g' },
          { name: 'Olio', quantity: 5, unit: 'g' },
        ],
      },
      {
        id: '2',
        name: 'Petto di pollo alla griglia',
        kcal: 165,
        carbs: 0,
        proteins: 31,
        fats: 3.6,
        ingredients: [{ name: 'Pollo', quantity: 100, unit: 'g' }],
      },
      {
        id: '3',
        name: 'Insalata mista',
        kcal: 20,
        carbs: 4,
        proteins: 1,
        fats: 0.5,
        ingredients: [
          { name: 'Lattuga', quantity: 50, unit: 'g' },
          { name: 'Pomodoro', quantity: 30, unit: 'g' },
          { name: 'Cetrioli', quantity: 20, unit: 'g' },
          { name: 'Olio', quantity: 5, unit: 'g' },
        ],
      },
      {
        id: '4',
        name: 'Mela',
        kcal: 52,
        carbs: 14,
        proteins: 0.3,
        fats: 0.2,
        ingredients: [{ name: 'Mela', quantity: 150, unit: 'g' }],
      },
      {
        id: '5',
        name: 'Yogurt greco',
        kcal: 59,
        carbs: 3.6,
        proteins: 10,
        fats: 0.4,
        ingredients: [{ name: 'Yogurt', quantity: 170, unit: 'g' }],
      },
    ],
    // Database di ingredienti di esempio (valori per 100g)
    // In un'app reale, questi verrebbero da un'API o un database più esteso
    ingredientDatabase: [
      { name: 'Pasta', kcal: 131, carbs: 25, proteins: 5, fats: 1.5 },
      { name: 'Pomodoro', kcal: 18, carbs: 3.9, proteins: 0.9, fats: 0.2 },
      { name: 'Olio', kcal: 884, carbs: 0, proteins: 0, fats: 100 },
      { name: 'Pollo', kcal: 165, carbs: 0, proteins: 31, fats: 3.6 },
      { name: 'Lattuga', kcal: 15, carbs: 2.9, proteins: 1.4, fats: 0.2 },
      { name: 'Cetrioli', kcal: 15, carbs: 3.6, proteins: 0.7, fats: 0.1 },
      { name: 'Mela', kcal: 52, carbs: 14, proteins: 0.3, fats: 0.2 },
      { name: 'Yogurt', kcal: 59, carbs: 3.6, proteins: 10, fats: 0.4 },
      { name: 'Farina', kcal: 364, carbs: 76, proteins: 10, fats: 1 },
      { name: 'Uovo', kcal: 155, carbs: 1.1, proteins: 13, fats: 11 },
      // Aggiungi altri ingredienti a seconda delle necessità
    ],
    // Piatto che l'utente sta attualmente creando/modificando
    currentPlate: {
      name: '',
      kcal: null, // Sarà calcolato e salvato per 100g
      carbs: null, // Sarà calcolato e salvato per 100g
      proteins: null, // Sarà calcolato e salvato per 100g
      fats: null, // Sarà calcolato e salvato per 100g
      ingredients: [], // Lista di oggetti { name: string, quantity: number, unit: string }
    },
    selectedMealType: '',
    selectedFoodForQuantity: null,
  }),
  actions: {
    setSelectedMealType(mealType) {
      this.selectedMealType = mealType
    },
    resetCurrentPlate() {
      this.currentPlate = {
        name: '',
        kcal: null,
        carbs: null,
        proteins: null,
        fats: null,
        ingredients: [],
      }
    },
    addIngredientToCurrentPlate(ingredient) {
      this.currentPlate.ingredients.push(ingredient)
    },
    removeIngredientFromCurrentPlate(index) {
      this.currentPlate.ingredients.splice(index, 1)
    },
    setSelectedFoodForQuantity(food) {
      this.selectedFoodForQuantity = food
    },
    addNewPlate(plate) {
      this.availableFoods.push({
        id: (this.availableFoods.length + 1).toString(), // ID semplice per esempio
        ...plate,
      })
    },
    addTrackedFoodToMeal(foodId, quantity, mealType) {
      console.log(`Aggiunto cibo ID: ${foodId}, Quantità: ${quantity}, Pasto: ${mealType}`)
      // La logica per aggiornare le calorie e i macro nel userStore
      // dovrà sempre considerare che i dati dello store 'food' sono per 100g.
    },
  },
  getters: {
    filteredFoods: (state) => (query) => {
      if (!query) return state.availableFoods
      return state.availableFoods.filter((food) =>
        food.name.toLowerCase().includes(query.toLowerCase()),
      )
    },
    // Getter per trovare un ingrediente dal database
    getIngredientNutritionalData: (state) => (ingredientName) => {
      return state.ingredientDatabase.find(
        (ing) => ing.name.toLowerCase() === ingredientName.toLowerCase(),
      )
    },
  },
})
