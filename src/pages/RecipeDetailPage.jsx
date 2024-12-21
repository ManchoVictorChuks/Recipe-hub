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
        const [recipeData, instructionsData] = await Promise.all([
          getRecipeById(id),
          getRecipeInstructions(id)
        ])
        setRecipe(recipeData)
        setInstructions(instructionsData)
      } catch (err) {
        setError('Failed to load recipe details')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadRecipeData()
  }, [id])

  if (loading) return <div className="text-center p-4">Loading...</div>
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>
  if (!recipe) return <div className="text-center p-4">Recipe not found</div>

  return (
    <div className="recipe-detail-page">
      <RecipeDetails recipe={recipe} instructions={instructions} />
    </div>
  )
}

export default RecipeDetailPage 