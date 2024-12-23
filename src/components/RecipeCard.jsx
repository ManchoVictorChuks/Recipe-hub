import React from 'react';
import { Clock } from 'lucide-react';

const RecipeCard = ({ recipe, onView }) => {
  return (
    <div 
      onClick={() => onView(recipe.id)}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
      </div>

      {/* Content Container */}
      <div className="p-5">
        <h3 className="font-semibold text-lg text-gray-800 group-hover:text-[#F77F00] transition-colors duration-300 line-clamp-2">
          {recipe.title}
        </h3>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center space-x-1 text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="text-sm">{recipe.readyInMinutes} mins</span>
          </div>
          
          {recipe.dishTypes && recipe.dishTypes.length > 0 && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-[#F77F00]/10 to-[#E63946]/10 text-[#F77F00]">
              {recipe.dishTypes[0]}
            </span>
          )}
        </div>
      </div>

      {/* Hover overlay with action hint */}
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <span className="text-white bg-[#F77F00] px-4 py-2 rounded-lg transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          View Recipe
        </span>
      </div>
    </div>
  );
};

export default RecipeCard;