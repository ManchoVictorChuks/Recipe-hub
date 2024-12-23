import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import RecipeDetails from '../components/RecipeDetails'
import { getRecipeById, getRecipeInstructions } from '../utils/api'

function RecipeDetailPage() {
  const { id } = useParams()
  const [recipe, setRecipe] = useState(null)
  const [instructions, setInstructions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadRecipeData = async () => {
      try {
        setLoading(true)
        setError(null)

        // First check if it's a created recipe
        const createdRecipes = JSON.parse(localStorage.getItem('createdRecipes') || '[]')
        const createdRecipe = createdRecipes.find(recipe => recipe.id.toString() === id.toString())

        if (createdRecipe) {
          const defaultImagePath = '/default-recipe-image.jpg';
          
          // Better image validation
          const getImagePath = (img) => {
            if (!img) return defaultImagePath;
            if (typeof img !== 'string') return defaultImagePath;
            return img.startsWith('data:') ? img : defaultImagePath;
          };
          
          setRecipe({
            ...createdRecipe,
            extendedIngredients: createdRecipe.ingredients?.map(ing => ({
              original: ing,
              id: Math.random()
            })) || [],
            instructions: createdRecipe.instructions,
            readyInMinutes: createdRecipe.cookingTime || 30, // Changed to use cookingTime
            servings: createdRecipe.servings || 4, // Changed to use servings
            image: getImagePath(createdRecipe.image)
          });
          // Ensure instructions is a string and handle different formats
          const instructionsText = typeof createdRecipe.instructions === 'string' 
            ? createdRecipe.instructions 
            : Array.isArray(createdRecipe.instructions)
              ? createdRecipe.instructions.join('\n')
              : String(createdRecipe.instructions || '');

          const instructionsArray = instructionsText
            .split('\n')
            .filter(step => step.trim())
            .map((step, index) => ({
              number: index + 1,
              step: step.trim()
            }));
          
          setInstructions(instructionsArray);
          setLoading(false);
          return;
        }

        if (id === 'not-found' || id === 'error') {
          if (id === 'not-found') {
            setError('No recipes found matching your search criteria.')
          } else {
            setError('An error occurred while searching for recipes. Please try again.')
          }
          setLoading(false)
          return
        }

        const [recipeData, instructionsData] = await Promise.all([
          getRecipeById(id),
          getRecipeInstructions(id)
        ])

        if (!recipeData) {
          setError('Recipe not found')
        } else {
          setRecipe(recipeData)
          // Ensure instructions are properly formatted
          const formattedInstructions = instructionsData?.[0]?.steps || []
          setInstructions(formattedInstructions)
        }
      } catch (err) {
        setError('Failed to load recipe details. Please try again later.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadRecipeData()
  }, [id])

  if (loading) return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#F77F00] border-t-transparent"></div>
      <p className="mt-4 text-lg text-gray-600">Loading recipe details...</p>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
      <div className="text-center max-w-md bg-white p-8 rounded-lg shadow-lg">
        <div className="w-16 h-16 mx-auto mb-4">
          <svg className="w-full h-full text-[#F77F00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{error}</h2>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-[#F77F00] text-white rounded-full hover:bg-[#E63946] transition-colors duration-300 shadow-md hover:shadow-lg"
        >
          Go Back
        </button>
      </div>
    </div>
  )

  if (!recipe) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <p className="text-xl text-gray-700">Recipe not found</p>
      </div>
    </div>
  )

  return (
    <div className="recipe-detail-page min-h-screen bg-gray-50 bg-opacity-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <RecipeDetails recipe={recipe} instructions={instructions} />
        </div>
      </div>
    </div>
  )
}

export default RecipeDetailPage;