import React from 'react'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar'
import RecipeCard from '../components/RecipeCard'
import { searchRecipes, getRandomRecipes } from '../utils/api'
import { BiBookmark, BiHeart, BiPlus, BiCategory, BiX } from 'react-icons/bi'
import { ChefHat } from 'lucide-react';

function Home() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [clearSearch, setClearSearch] = useState(false);
  const [favorites, setFavorites] = useState([])
  const [likedRecipes, setLikedRecipes] = useState([])
  const [createdRecipes, setCreatedRecipes] = useState([]) // Add this line
  const [openDropdown, setOpenDropdown] = useState(null)
  const navigate = useNavigate()

  // Close dropdown when clicking outside
  const dropdownRef = useRef(null)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleDropdownClick = (dropdownName) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName)
  }

  const navigateToAddRecipe = () => {
    navigate('/add-recipe')
  }

  useEffect(() => {
    loadRandomRecipes()
  }, [])

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    const savedLikes = localStorage.getItem('likedRecipes');
    const savedCreatedRecipes = localStorage.getItem('createdRecipes'); // Add this line
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));
    if (savedLikes) setLikedRecipes(JSON.parse(savedLikes));
    if (savedCreatedRecipes) setCreatedRecipes(JSON.parse(savedCreatedRecipes)); // Add this line
  }, []);

  // Add this new useEffect to listen for storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      const savedCreatedRecipes = localStorage.getItem('createdRecipes');
      if (savedCreatedRecipes) {
        setCreatedRecipes(JSON.parse(savedCreatedRecipes));
      }
    };

    // Listen for storage changes
    window.addEventListener('storage', handleStorageChange);
    
    // Initial load
    handleStorageChange();

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLikeRecipe = (recipe) => {
    setLikedRecipes(prev => {
      const isLiked = prev.some(r => r.id === recipe.id);
      const newLikes = isLiked 
        ? prev.filter(r => r.id !== recipe.id)
        : [...prev, recipe];
      localStorage.setItem('likedRecipes', JSON.stringify(newLikes));
      return newLikes;
    });
  };

  const handleFavoriteRecipe = (recipe) => {
    setFavorites(prev => {
      const isFavorited = prev.some(r => r.id === recipe.id);
      const newFavorites = isFavorited 
        ? prev.filter(r => r.id !== recipe.id)
        : [...prev, recipe];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  const loadRandomRecipes = async () => {
    try {
      setLoading(true);
      setError(null); // Reset error state
      const response = await fetch(
        `https://api.spoonacular.com/recipes/random?apiKey=${import.meta.env.VITE_SPOONACULAR_API_KEY}&number=12`
      );
      
      if (!response.ok) {
        if (response.status === 402) {
          throw new Error('API quota exceeded. Please try again later.');
        }
        throw new Error('Failed to fetch recipes');
      }

      const data = await response.json();
      
      // Check if data and recipes exist before mapping
      if (data && data.recipes && Array.isArray(data.recipes)) {
        const transformedRecipes = data.recipes.map(recipe => ({
          id: recipe.id,
          title: recipe.title,
          image: recipe.image || 'default-recipe-image.jpg', // Add a fallback image
          readyInMinutes: recipe.readyInMinutes || '??',
          dishTypes: recipe.dishTypes || [],
        }));
        setRecipes(transformedRecipes);
      } else {
        throw new Error('Invalid data format received from API');
      }
    } catch (err) {
      setError(err.message || 'Failed to load recipes');
      console.error('Recipe loading error:', err);
      setRecipes([]); // Set empty array instead of undefined
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (searchTerm) => {
    try {
      setLoading(true);
      setError(null); // Reset error state
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=${import.meta.env.VITE_SPOONACULAR_API_KEY}&query=${searchTerm}&number=12&addRecipeInformation=true&instructionsRequired=true&fillIngredients=true`
      );

      if (!response.ok) {
        if (response.status === 402) {
          throw new Error('API quota exceeded. Please try again later.');
        }
        throw new Error('Failed to search recipes');
      }

      const data = await response.json();
      
      // Check if data and results exist before mapping
      if (data && data.results && Array.isArray(data.results)) {
        const transformedRecipes = data.results.map(recipe => ({
          id: recipe.id,
          title: recipe.title,
          image: recipe.image || 'default-recipe-image.jpg',
          readyInMinutes: recipe.readyInMinutes || '??',
          dishTypes: recipe.dishTypes || [],
        }));
        setRecipes(transformedRecipes);
      } else {
        throw new Error('Invalid search results format');
      }
    } catch (err) {
      setError(err.message || 'Failed to search recipes');
      console.error('Recipe search error:', err);
      setRecipes([]); // Set empty array instead of undefined
    } finally {
      setLoading(false);
    }
  };

  const handleRecipeClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`)
  }

  const categoryToDishTypes = {
    breakfast: ['breakfast', 'brunch', 'morning meal'],
    lunch: ['lunch', 'main course', 'main dish', 'dinner'],
    dinner: ['dinner', 'main course', 'main dish', 'supper'],
    desserts: ['dessert', 'cookies', 'cakes'],
    snacks: ['snack', 'appetizer', 'starter']
  };

  const handleCategoryClick = async (category) => {
    setActiveCategory(category.toLowerCase());
    if (category.toLowerCase() === 'all') {
      setClearSearch(true);
      loadRandomRecipes();
      setTimeout(() => setClearSearch(false), 100);
      return;
    }
  
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `https://api.spoonacular.com/recipes/complexSearch?apiKey=${
          import.meta.env.VITE_SPOONACULAR_API_KEY
        }&type=${category.toLowerCase()}&number=12&addRecipeInformation=true`
      );
  
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
  
      const data = await response.json();
      
      if (data && data.results && Array.isArray(data.results)) {
        const filteredRecipes = data.results.filter(recipe => 
          recipe.dishTypes && recipe.dishTypes.some(type => 
            categoryToDishTypes[category.toLowerCase()]?.includes(type.toLowerCase())
          )
        );
  
        const transformedRecipes = filteredRecipes.map(recipe => ({
          id: recipe.id,
          title: recipe.title,
          image: recipe.image || 'default-recipe-image.jpg',
          readyInMinutes: recipe.readyInMinutes || '??',
          dishTypes: recipe.dishTypes || [],
        }));
        
        setRecipes(transformedRecipes);
      }
    } catch (err) {
      setError(err.message || 'Failed to load recipes');
      console.error('Recipe loading error:', err);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSurpriseMe = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://api.spoonacular.com/recipes/random?apiKey=${import.meta.env.VITE_SPOONACULAR_API_KEY}&number=1`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch random recipe');
      }

      const data = await response.json();
      if (data && data.recipes && data.recipes[0]) {
        navigate(`/recipe/${data.recipes[0].id}`);
      }
    } catch (err) {
      console.error('Error getting random recipe:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCreatedRecipe = (e, recipeId) => {
    e.stopPropagation();
    setCreatedRecipes(prev => {
      const newRecipes = prev.filter(r => r.id !== recipeId);
      localStorage.setItem('createdRecipes', JSON.stringify(newRecipes));
      return newRecipes;
    });
  };
  
  const handleRemoveFavorite = (e, recipeId) => {
    e.stopPropagation();
    setFavorites(prev => {
      const newFavorites = prev.filter(r => r.id !== recipeId);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  };
  
  const handleRemoveLiked = (e, recipeId) => {
    e.stopPropagation();
    setLikedRecipes(prev => {
      const newLiked = prev.filter(r => r.id !== recipeId);
      localStorage.setItem('likedRecipes', JSON.stringify(newLiked));
      return newLiked;
    });
  };

  const handleEditRecipe = (e, recipe) => {
    e.stopPropagation();
    const existingRecipe = {
      id: recipe.id,
      title: recipe.title,
      description: recipe.description || '',
      ingredients: recipe.ingredients || [''],
      instructions: recipe.instructions || [''],
      image: recipe.image || '',
      cookingTime: recipe.cookingTime || 30,
      servings: recipe.servings || 4
    };
    navigate('/add-recipe', { state: { recipe: existingRecipe, isEditing: true } });
  };

  const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Desserts', 'Snacks']

  return (
    <div className="flex h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="w-64 bg-white/80 backdrop-blur-md shadow-lg h-full flex flex-col">
        <div className="p-6">
          <div className="flex items-center space-x-2">
            <ChefHat className="h-8 w-8 text-[#F77F00]" />
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F77F00] to-teal-500">
              Recipe Hub
            </span>
          </div>
        </div>
        <nav className="flex-grow overflow-y-auto" ref={dropdownRef}>
          <div className="px-4 space-y-2">
            {/* Add this new button before the Favorites button */}
            <div className="transition-all duration-200">
              <button
                onClick={() => handleDropdownClick('created')}
                className="group relative inline-flex items-center justify-between w-full p-3 rounded-lg bg-white hover:bg-gradient-to-br from-[#F77F00] to-[#E63946] transition-all duration-300"
              >
                <span className="relative flex items-center text-gray-600 group-hover:text-white transition-colors duration-300">
                  <ChefHat className="mr-2 h-5 w-5" />
                  My Recipes
                </span>
                <span className="bg-gray-200 rounded-full px-2 py-1 text-xs">
                  {createdRecipes.length}
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${
                openDropdown === 'created' ? 'max-h-48' : 'max-h-0'
              }`}>
                <div className="bg-white shadow-inner">
                  {createdRecipes.length > 0 ? (
                    createdRecipes.map(recipe => (
                      <div 
                        key={recipe.id} 
                        className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                        onClick={() => handleRecipeClick(recipe.id)}
                      >
                        <span className="truncate pr-2">{recipe.title}</span>
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) => handleEditRecipe(e, recipe)}
                            className="p-1 hover:bg-blue-100 rounded-full text-blue-500"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => handleRemoveCreatedRecipe(e, recipe.id)}
                            className="p-1 hover:bg-red-100 rounded-full text-red-500"
                          >
                            <BiX className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500">No created recipes yet</div>
                  )}
                </div>
              </div>
            </div>

            {/* Favorites Button with Dropdown */}
            <div className="transition-all duration-200">
              <button
                onClick={() => handleDropdownClick('favorites')}
                className="group relative inline-flex items-center justify-between w-full p-3 rounded-lg bg-white hover:bg-gradient-to-br from-[#F77F00] to-[#E63946] transition-all duration-300"
              >
                <span className="relative flex items-center text-gray-600 group-hover:text-white transition-colors duration-300">
                  <BiBookmark className="mr-2 h-5 w-5" />
                  Favorites
                </span>
                <span className="bg-gray-200 rounded-full px-2 py-1 text-xs">
                  {favorites.length}
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${
                openDropdown === 'favorites' ? 'max-h-48' : 'max-h-0'
              }`}>
                <div className="bg-white shadow-inner">
                  {favorites.length > 0 ? (
                    favorites.map(recipe => (
                      <div 
                        key={recipe.id} 
                        className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                        onClick={() => handleRecipeClick(recipe.id)}
                      >
                        <span className="truncate pr-2">{recipe.title}</span>
                        <button
                          onClick={(e) => handleRemoveFavorite(e, recipe.id)}
                          className="p-1 hover:bg-red-100 rounded-full text-red-500"
                        >
                          <BiX className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500">No favorites yet</div>
                  )}
                </div>
              </div>
            </div>

            {/* Liked Recipes Button with Dropdown */}
            <div className="transition-all duration-200">
              <button
                onClick={() => handleDropdownClick('liked')}
                className="group relative inline-flex items-center justify-between w-full p-3 rounded-lg bg-white hover:bg-gradient-to-br from-[#F77F00] to-[#E63946] transition-all duration-300"
              >
                <span className="relative flex items-center text-gray-600 group-hover:text-white transition-colors duration-300">
                  <BiHeart className="mr-2 h-5 w-5" />
                  Liked Recipes
                </span>
                <span className="bg-gray-200 rounded-full px-2 py-1 text-xs">
                  {likedRecipes.length}
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${
                openDropdown === 'liked' ? 'max-h-48' : 'max-h-0'
              }`}>
                <div className="bg-white shadow-inner">
                  {likedRecipes.length > 0 ? (
                    likedRecipes.map(recipe => (
                      <div 
                        key={recipe.id} 
                        className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                        onClick={() => handleRecipeClick(recipe.id)}
                      >
                        <span className="truncate pr-2">{recipe.title}</span>
                        <button
                          onClick={(e) => handleRemoveLiked(e, recipe.id)}
                          className="p-1 hover:bg-red-100 rounded-full text-red-500"
                        >
                          <BiX className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500">No liked recipes yet</div>
                  )}
                </div>
              </div>
            </div>

            {/* Add New Recipe Button */}
            <button
              onClick={navigateToAddRecipe}
              className="group relative inline-flex items-center justify-start w-full p-3 rounded-lg bg-white hover:bg-gradient-to-br from-[#F77F00] to-[#E63946] transition-all duration-300"
            >
              <span className="relative flex items-center text-gray-600 group-hover:text-white transition-colors duration-300">
                <BiPlus className="mr-2 h-5 w-5" />
                Add New Recipe
              </span>
            </button>

            {/* Categories Button with Dropdown */}
            <div className="transition-all duration-200">
              <button
                onClick={() => handleDropdownClick('categories')}
                className="group relative inline-flex items-center justify-start w-full p-3 rounded-lg bg-white hover:bg-gradient-to-br from-[#F77F00] to-[#E63946] transition-all duration-300"
              >
                <span className="relative flex items-center text-gray-600 group-hover:text-white transition-colors duration-300">
                  <BiCategory className="mr-2 h-5 w-5" />
                  Categories
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${
                openDropdown === 'categories' ? 'max-h-48' : 'max-h-0'
              }`}>
                <div className="bg-white shadow-inner">
                  {categories.map(category => (
                    <div
                      key={category}
                      onClick={() => handleCategoryClick(category)}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {category}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </nav>
        <div className="p-6">
          <button 
            onClick={handleSurpriseMe}
            className="group relative inline-flex items-center justify-center w-full overflow-hidden rounded-full bg-gradient-to-br from-[#F77F00] to-[#E63946] p-0.5 text-sm font-medium text-white hover:text-[#E63946] focus:outline-none focus:ring-4 focus:ring-[#E63946]/50"
          >
            <span className="relative flex items-center justify-center w-full rounded-full bg-transparent px-6 py-3 transition-all duration-75 ease-in group-hover:bg-white">
              Surprise Me!
            </span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Search Section with higher z-index */}
          <div className="relative z-50">
            <SearchBar onSearch={handleSearch} shouldClear={clearSearch} />
            <div className="absolute inset-0 bg-gradient-to-r from-[#F77F00]/10 to-teal-500/10 blur-3xl -z-10"></div>
          </div>
          
          {/* Categories with lower z-index */}
          <div className="relative z-40">
            <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`px-6 py-2.5 rounded-full whitespace-nowrap transition-all duration-200 ${
                    activeCategory === category.toLowerCase()
                      ? 'bg-gradient-to-r from-[#F77F00] to-[#E63946] text-white shadow-lg'
                      : 'bg-white/80 backdrop-blur-sm text-gray-600 hover:bg-white hover:shadow-md'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Recipe Grid with lowest z-index */}
          <div className="relative z-30">
            {loading ? (
              <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F77F00]"></div>
              </div>
            ) : error ? (
              <div className="text-center text-red-500 p-4">{error}</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 max-w-[1200px] mx-auto px-4">
                {recipes.slice(0, 9).map(recipe => (
                  <div key={recipe.id} className="relative group">
                    <RecipeCard
                      recipe={{
                        id: recipe.id,
                        title: recipe.title,
                        image: recipe.image || 'default-recipe-image.jpg',
                        readyInMinutes: recipe.readyInMinutes || '??',
                        dishTypes: recipe.dishTypes || [],
                      }}
                      onView={handleRecipeClick}
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        onClick={() => handleLikeRecipe(recipe)}
                        className={`p-2 rounded-full ${
                          likedRecipes.some(r => r.id === recipe.id)
                            ? 'bg-red-500 text-white'
                            : 'bg-white/80 text-gray-600'
                        } hover:scale-110 transition-transform duration-200`}
                      >
                        <BiHeart className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleFavoriteRecipe(recipe)}
                        className={`p-2 rounded-full ${
                          favorites.some(r => r.id === recipe.id)
                            ? 'bg-yellow-500 text-white'
                            : 'bg-white/80 text-gray-600'
                        } hover:scale-110 transition-transform duration-200`}
                      >
                        <BiBookmark className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;