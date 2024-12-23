import React from 'react'
import { FaClock, FaUsers, FaUtensils, FaPrint, FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

function RecipeDetails({ recipe = {}, instructions = [] }) {
  const navigate = useNavigate();
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-4xl mx-auto p-4 flex items-center gap-4">
          <button 
            onClick={() => navigate('/Home')}
            className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-[#F77F00] transition-colors duration-300"
          >
            <FaArrowLeft /> Back
          </button>
          <h2 className="text-2xl font-bold text-gray-800 font-['Libre_Baskerville'] tracking-tight flex-grow">{recipe?.title}</h2>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-8">
        {/* Hero Image Section */}
        <div className="relative mb-12">
          {recipe?.image && (
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.01] transition-transform duration-500">
              <img 
                src={recipe.image} 
                alt={recipe.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
          )}
          <button 
            onClick={handlePrint} 
            className="absolute top-4 right-4 flex items-center gap-2 px-4 py-2 bg-white/90 text-gray-800 rounded-lg hover:bg-[#F77F00] hover:text-white transition-all duration-300 shadow-md"
          >
            <FaPrint /> Print Recipe
          </button>
        </div>

        {/* Recipe Meta */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <FaClock className="text-[#F77F00] text-xl" />
            <div>
              <p className="text-sm text-gray-500">Cook Time</p>
              <p className="font-semibold">{recipe?.readyInMinutes || '–'} mins</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <FaUsers className="text-[#F77F00] text-xl" />
            <div>
              <p className="text-sm text-gray-500">Servings</p>
              <p className="font-semibold">{recipe?.servings || '–'} servings</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <FaUtensils className="text-[#F77F00] text-xl" />
            <div>
              <p className="text-sm text-gray-500">Difficulty</p>
              <p className="font-semibold">{recipe?.difficulty || 'Medium'}</p>
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-[2fr_3fr] gap-12">
          <div className="ingredients-panel bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-2xl font-['Libre_Baskerville'] mb-6 text-gray-800 flex items-center gap-3">
              <span className="w-10 h-10 bg-[#F77F00] text-white rounded-full flex items-center justify-center text-lg shadow-md">1</span>
              Ingredients
            </h3>
            <ul className="space-y-4">
              {recipe?.extendedIngredients?.map((ingredient, index) => (
                <li key={index} className="flex items-start gap-3 group">
                  <span className="block w-2 h-2 mt-2 rounded-full bg-[#F77F00] group-hover:scale-125 transition-transform duration-300" />
                  <span className="text-gray-700 leading-relaxed">{ingredient.original}</span>
                </li>
              )) || <p className="text-gray-600">No ingredients available.</p>}
            </ul>
          </div>

          <div className="instructions-panel bg-white p-8 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <h3 className="text-2xl font-['Libre_Baskerville'] mb-6 text-gray-800 flex items-center gap-3">
              <span className="w-10 h-10 bg-[#F77F00] text-white rounded-full flex items-center justify-center text-lg shadow-md">2</span>
              Instructions
            </h3>
            <ol className="space-y-8">
              {instructions?.map((instruction, index) => (
                <li key={index} className="flex gap-4 group">
                  <span className="font-bold text-[#F77F00] text-xl group-hover:scale-110 transition-transform duration-300">{index + 1}.</span>
                  <p className="text-gray-700 leading-relaxed">{instruction.step}</p>
                </li>
              )) || <p className="text-gray-600">No instructions available.</p>}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RecipeDetails