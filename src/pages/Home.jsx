import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import RecipeCard from '../components/RecipeCard'
import { searchRecipes, getRandomRecipes } from '../utils/api'

function Home() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    loadRandomRecipes()
  }, [])

  const loadRandomRecipes = async () => {
    try {
      setLoading(true)
      const randomRecipes = await getRandomRecipes()
      setRecipes(randomRecipes)
    } catch (err) {
      setError('Failed to load recipes')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (searchTerm) => {
    try {
      setLoading(true)
      const data = await searchRecipes(searchTerm)
      setRecipes(data.results)
    } catch (err) {
      setError('Failed to search recipes')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`)
  }

  if (loading) return <div className="text-center p-4">Loading...</div>
  if (error) return <div className="text-center text-red-500 p-4">{error}</div>

  return (
    <div className="home">
      <h1 className="text-3xl font-bold mb-6">Recipe Discovery Hub</h1>
      <SearchBar onSearch={handleSearch} />
      <div className="recipes-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {recipes.map(recipe => (
          <div key={recipe.id} onClick={() => handleRecipeClick(recipe.id)}>
            <RecipeCard recipe={recipe} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home 