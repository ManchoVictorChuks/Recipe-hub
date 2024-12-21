import { useState } from 'react'

function AddRecipeForm({ onSubmit }) {
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    ingredients: [''],
    instructions: [''],
    image: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(recipe)
  }

  const addIngredient = () => {
    setRecipe(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, '']
    }))
  }

  const addInstruction = () => {
    setRecipe(prev => ({
      ...prev,
      instructions: [...prev.instructions, '']
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="add-recipe-form">
      <input
        type="text"
        placeholder="Recipe Title"
        value={recipe.title}
        onChange={e => setRecipe(prev => ({ ...prev, title: e.target.value }))}
      />
      <textarea
        placeholder="Recipe Description"
        value={recipe.description}
        onChange={e => setRecipe(prev => ({ ...prev, description: e.target.value }))}
      />
      
      <div className="ingredients-section">
        <h3>Ingredients</h3>
        {recipe.ingredients.map((ingredient, index) => (
          <input
            key={index}
            type="text"
            value={ingredient}
            onChange={e => {
              const newIngredients = [...recipe.ingredients]
              newIngredients[index] = e.target.value
              setRecipe(prev => ({ ...prev, ingredients: newIngredients }))
            }}
          />
        ))}
        <button type="button" onClick={addIngredient}>Add Ingredient</button>
      </div>

      <button type="submit">Create Recipe</button>
    </form>
  )
}

export default AddRecipeForm 