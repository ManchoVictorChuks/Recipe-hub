const API_BASE_URL = 'https://api.spoonacular.com/recipes'
const API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY

// Search recipes by query
export const searchRecipes = async (query, offset = 0) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/complexSearch?apiKey=${API_KEY}&query=${query}&offset=${offset}&number=12&addRecipeInformation=true`
    )
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error searching recipes:', error)
    throw error
  }
}

// Get recipe by ID with full details
export const getRecipeById = async (id) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/${id}/information?apiKey=${API_KEY}`
    )
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching recipe:', error)
    throw error
  }
}

// Get random recipes
export const getRandomRecipes = async (number = 6) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/random?apiKey=${API_KEY}&number=${number}`
    )
    const data = await response.json()
    return data.recipes
  } catch (error) {
    console.error('Error fetching random recipes:', error)
    throw error
  }
}

// Search recipes by ingredients
export const searchByIngredients = async (ingredients) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/findByIngredients?apiKey=${API_KEY}&ingredients=${ingredients.join(',')}&number=12`
    )
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error searching by ingredients:', error)
    throw error
  }
}

// Get recipe instructions by ID
export const getRecipeInstructions = async (id) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/${id}/analyzedInstructions?apiKey=${API_KEY}`
    )
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching recipe instructions:', error)
    throw error
  }
} 