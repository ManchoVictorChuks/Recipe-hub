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

        if (id === 'not-found') {
          setError('No recipes found matching your search criteria.')
          setLoading(false)
          return
        }

        if (id === 'error') {
          setError('An error occurred while searching for recipes. Please try again.')
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
          setInstructions(instructionsData)
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
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F77F00]"></div>
    </div>
  )

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops!</h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <button
          onClick={() => window.history.back()}
          className="px-6 py-3 bg-[#F77F00] text-white rounded-full hover:bg-[#E63946] transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  )

  if (!recipe) return <div className="text-center p-4">Recipe not found</div>

  return (
    <div className="recipe-detail-page">
      <RecipeDetails recipe={recipe} instructions={instructions} />
    </div>
  )
}

export default RecipeDetailPage