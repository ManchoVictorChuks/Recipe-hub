import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Favorites from './pages/Favorites'
import RecipeDetailPage from './pages/RecipeDetailPage'
import AddRecipePage from './pages/AddRecipePage'
import LandingPage from './pages/LandingPage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/favorites" element={<Favorites />} />
      <Route path="/recipe/:id" element={<RecipeDetailPage />} />
      <Route path="/add-recipe" element={<AddRecipePage />} />
    </Routes>
  )
}

export default App
