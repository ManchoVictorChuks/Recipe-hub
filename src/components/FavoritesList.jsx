import RecipeCard from './RecipeCard'

function FavoritesList({ favorites }) {
  return (
    <div className="favorites-list">
      <h2>My Favorite Recipes</h2>
      <div className="favorites-grid">
        {favorites.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  )
}

export default FavoritesList 