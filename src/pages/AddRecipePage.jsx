import AddRecipeForm from '../components/AddRecipeForm'
import { useNavigate } from 'react-router-dom' // Add this import

function AddRecipePage() {
  const navigate = useNavigate(); // Add this

  const handleSubmit = async (recipeData) => {
    try {
      const recipe = {
        ...recipeData,
        id: Date.now(),
      };

      const existingRecipes = JSON.parse(localStorage.getItem('createdRecipes') || '[]');
      const updatedRecipes = [...existingRecipes, recipe];
      
      localStorage.setItem('createdRecipes', JSON.stringify(updatedRecipes));
      console.log('Recipe saved successfully:', recipe);
      
      // Navigate back to home page after successful save
      navigate('/');
      
    } catch (error) {
      console.error('Error submitting recipe:', error);
      alert('Failed to save recipe. Please try again.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Create New Recipe</h1>
          <p className="text-gray-600">Share your culinary masterpiece with the world</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <div className="mb-6">
            <div className="flex items-center justify-center">
              <div className="h-1 w-24 bg-amber-500 rounded-full"></div>
              <div className="mx-4">
                <span className="inline-block p-3 rounded-full bg-amber-100">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </span>
              </div>
              <div className="h-1 w-24 bg-amber-500 rounded-full"></div>
            </div>
          </div>
          
          <AddRecipeForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  )
}

export default AddRecipePage