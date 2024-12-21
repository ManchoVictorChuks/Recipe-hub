import { useState, useEffect } from 'react'
import FavoritesList from '../components/FavoritesList'

function Favorites() {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    // Load favorites from localStorage or API
    const loadFavorites = () => {
      const savedFavorites = localStorage.getItem('favorites')
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites))
      }
    }
    loadFavorites()
  }, [])

  return (
    <div className="favorites-page">
      <h1>My Favorites</h1>
      <FavoritesList favorites={favorites} />
    </div>
  )
}

export default Favorites 