import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function AddRecipeForm({ onSubmit }) {
  const navigate = useNavigate()
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    ingredients: [''],
    instructions: [''],
    image: ''
  })

  const [errors, setErrors] = useState({
    title: '',
    description: '',
    ingredients: [],
    instructions: [],
    image: ''
  })

  const [showSuccess, setShowSuccess] = useState(false)

  const [imagePreview, setImagePreview] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(recipe)
      setShowSuccess(true)
      setTimeout(() => {
        setShowSuccess(false)
        navigate('/Home')
      }, 3000)
    }
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

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setRecipe(prev => ({ ...prev, image: file }))
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const deleteIngredient = (indexToDelete) => {
    if (recipe.ingredients.length > 1) {
      setRecipe(prev => ({
        ...prev,
        ingredients: prev.ingredients.filter((_, index) => index !== indexToDelete)
      }))
    }
  }

  const deleteInstruction = (indexToDelete) => {
    if (recipe.instructions.length > 1) {
      setRecipe(prev => ({
        ...prev,
        instructions: prev.instructions.filter((_, index) => index !== indexToDelete)
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {
      title: '',
      description: '',
      ingredients: [],
      instructions: [],
      image: ''
    }
    let isValid = true

    // Title validation
    if (!recipe.title.trim()) {
      newErrors.title = 'Recipe title is required'
      isValid = false
    }

    // Description validation
    if (!recipe.description.trim()) {
      newErrors.description = 'Recipe description is required'
      isValid = false
    }

    // Ingredients validation
    recipe.ingredients.forEach((ing, index) => {
      if (!ing.trim()) {
        newErrors.ingredients[index] = 'Ingredient cannot be empty'
        isValid = false
      }
    })

    // Instructions validation
    recipe.instructions.forEach((inst, index) => {
      if (!inst.trim()) {
        newErrors.instructions[index] = 'Instruction cannot be empty'
        isValid = false
      }
    })

    // Image validation
    if (!recipe.image) {
      newErrors.image = 'Please upload a recipe image'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-gray-800 text-center">Create New Recipe</h2>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Give your recipe a name
            </label>
            <input
              id="title"
              type="text"
              placeholder="Recipe Title"
              value={recipe.title}
              onChange={e => setRecipe(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Write a brief description of your recipe
            </label>
            <textarea
              id="description"
              placeholder="Recipe Description"
              value={recipe.description}
              onChange={e => setRecipe(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-2 border border-gray-300 rounded-md h-32 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div className="image-upload-section space-y-3">
            <h3 className="text-xl font-semibold text-gray-700">Recipe Image</h3>
            <p className="text-sm text-gray-600">Upload a beautiful photo of your finished dish</p>
            <div className="flex items-center justify-center w-full">
              <label className="relative flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Recipe preview"
                    className="absolute inset-0 w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">Click to upload recipe image</p>
                  </div>
                )}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image}</p>
            )}
          </div>

          <div className="ingredients-section space-y-3">
            <h3 className="text-xl font-semibold text-gray-700">Ingredients</h3>
            <p className="text-sm text-gray-600">List all ingredients needed for your recipe</p>
            {recipe.ingredients.map((ingredient, index) => (
              <div key={index} className="space-y-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={ingredient}
                    placeholder={`Ingredient ${index + 1}`}
                    onChange={e => {
                      const newIngredients = [...recipe.ingredients]
                      newIngredients[index] = e.target.value
                      setRecipe(prev => ({ ...prev, ingredients: newIngredients }))
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                  {recipe.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => deleteIngredient(index)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
                {errors.ingredients[index] && (
                  <p className="text-red-500 text-sm">{errors.ingredients[index]}</p>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addIngredient}
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Ingredient
            </button>
          </div>

          <div className="instructions-section space-y-3">
            <h3 className="text-xl font-semibold text-gray-700">Instructions</h3>
            <p className="text-sm text-gray-600">Break down your recipe into clear, step-by-step instructions</p>
            {recipe.instructions.map((instruction, index) => (
              <div key={index} className="space-y-1">
                <div className="flex gap-2">
                  <textarea
                    value={instruction}
                    placeholder={`Step ${index + 1}`}
                    onChange={e => {
                      const newInstructions = [...recipe.instructions]
                      newInstructions[index] = e.target.value
                      setRecipe(prev => ({ ...prev, instructions: newInstructions }))
                    }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md h-24 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                  />
                  {recipe.instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => deleteInstruction(index)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors h-fit"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
                {errors.instructions[index] && (
                  <p className="text-red-500 text-sm">{errors.instructions[index]}</p>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addInstruction}
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Step
            </button>
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors mt-6"
          >
            Create Recipe
          </button>
        </div>
      </form>

      {showSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg animate-fade-in-out">
          Recipe added successfully!
        </div>
      )}
    </>
  )
}

export default AddRecipeForm