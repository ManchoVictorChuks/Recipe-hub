import RecipeCard from './RecipeCard'

function CustomRecipeList({ recipes }) {
  return (
    <div className="custom-recipes">
      <h2>My Custom Recipes</h2>
      <div className="recipes-grid">
        {recipes.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  )
}

export default CustomRecipeList 