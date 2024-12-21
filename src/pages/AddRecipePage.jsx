import AddRecipeForm from '../components/AddRecipeForm'

function AddRecipePage() {
  const handleSubmit = async (recipeData) => {
    try {
      // Implement recipe submission logic
      console.log('Submitting recipe:', recipeData)
    } catch (error) {
      console.error('Error submitting recipe:', error)
    }
  }

  return (
    <div className="add-recipe-page">
      <h1>Create New Recipe</h1>
      <AddRecipeForm onSubmit={handleSubmit} />
    </div>
  )
}

export default AddRecipePage 