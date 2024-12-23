import AddRecipeForm from '../components/AddRecipeForm'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState, useCallback } from 'react'

function AddRecipePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isEditing = location.state?.isEditing;
  const existingRecipe = location.state?.recipe;

  // Initialize form data with existing recipe or default values
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ingredients: [''],
    instructions: [''],
    image: '',
    cookingTime: 30,
    servings: 4,
    ...(existingRecipe || {}) // Spread existing recipe data if available
  });

  useEffect(() => {
    // Only load temp data if not editing an existing recipe
    if (!isEditing) {
      const tempData = localStorage.getItem('tempRecipeData');
      if (tempData) {
        try {
          const { data, timestamp } = JSON.parse(tempData);
          const hours = (Date.now() - timestamp) / (1000 * 60 * 60);
          
          if (hours < 48) {
            setFormData(data);
          } else {
            localStorage.removeItem('tempRecipeData');
          }
        } catch (error) {
          console.error('Error loading temp data:', error);
          localStorage.removeItem('tempRecipeData');
        }
      }
    }
  }, [isEditing]);

  const handleFormChange = useCallback((newData) => {
    setFormData(newData);
  }, []); // No dependencies needed

  const isFormEmpty = (data) => {
    if (!data) return true;
    
    const { title, description, ingredients, instructions } = data;
    return (
      (!title || !title.trim()) &&
      (!description || !description.trim()) &&
      (!ingredients || ingredients.every(i => !i || !i.trim())) &&
      (!instructions || instructions.every(i => !i || !i.trim()))
    );
  };

  const handleBackNavigation = (currentData) => {
    console.log('Current form data:', currentData);
    
    if (!currentData || isFormEmpty(currentData)) {
      console.log('Form is empty, navigating directly');
      navigate('/Home');
      return;
    }

    if (window.confirm('Do you want to leave this page? Your changes may be lost.')) {
      if (window.confirm('Would you like to save your current progress?')) {
        const saveData = {
          data: currentData,
          timestamp: Date.now()
        };
        localStorage.setItem('tempRecipeData', JSON.stringify(saveData));
      } else {
        // Clear the temporary data if user doesn't want to save
        localStorage.removeItem('tempRecipeData');
        setFormData({
          title: '',
          description: '',
          ingredients: [''],
          instructions: [''],
          image: ''
        });
      }
      navigate('/Home');
    }
  };

  const handleSubmit = async (recipeData) => {
    try {
      const recipe = {
        ...recipeData,
        id: existingRecipe?.id || Date.now(), // Use existing ID if editing
      };

      const existingRecipes = JSON.parse(localStorage.getItem('createdRecipes') || '[]');
      let updatedRecipes;
      
      if (isEditing) {
        // Update existing recipe
        updatedRecipes = existingRecipes.map(r => 
          r.id === recipe.id ? recipe : r
        );
      } else {
        // Add new recipe
        updatedRecipes = [...existingRecipes, recipe];
      }
      
      localStorage.setItem('createdRecipes', JSON.stringify(updatedRecipes));
      console.log(`Recipe ${isEditing ? 'updated' : 'saved'} successfully:`, recipe);
      
      // Navigate back to home page after successful save
      navigate('/Home');
      
    } catch (error) {
      console.error('Error submitting recipe:', error);
      alert('Failed to save recipe. Please try again.');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => handleBackNavigation(formData)}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          <h1 className="text-4xl font-bold text-gray-800">
            {isEditing ? 'Edit Recipe' : 'Become A Chef!'}
          </h1>
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
          
          <AddRecipeForm 
            onSubmit={handleSubmit} 
            initialData={formData} 
            onFormChange={handleFormChange}
          />
        </div>
      </div>
    </div>
  )
}

export default AddRecipePage;