import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import heroBackground from '../assets/Hero-Background.jpg';
import { ChefHat, Menu, X, Search } from 'lucide-react';
import axios from 'axios';

const LandingPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeBenefit, setActiveBenefit] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const benefits = [
    {
      title: "Convenience and Efficiency",
      withoutApp: "Spending 30+ minutes searching through endless websites...",
      withApp: "Find perfect recipes in seconds using ingredients you already have!",
      icon: "⏱️",
      color: "from-orange-500 to-red-500"
    },
    {
      title: "Personalization",
      withoutApp: "Scrolling through ads and irrelevant content...",
      withApp: "Clean, personalized interface with your favorite recipes always at hand!",
      icon: "🎯",
      color: "from-blue-500 to-indigo-500"
    },
    {
      title: "Smart Organization",
      withoutApp: "Losing recipes and forgetting measurements...",
      withApp: "All your recipes organized and accessible anywhere!",
      icon: "📱",
      color: "from-green-500 to-teal-500"
    },
    {
      title: "Community & Support",
      withoutApp: "Cooking alone with no guidance...",
      withApp: "Join a community of food lovers and share experiences!",
      icon: "👥",
      color: "from-purple-500 to-pink-500"
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowVideo(true);
    }, 3000);

    const fetchRandomRecipes = async () => {
      try {
        const response = await axios.get(
          `https://api.spoonacular.com/recipes/random?apiKey=${import.meta.env.VITE_SPOONACULAR_API_KEY}&number=10`
        );
        setFeaturedRecipes(response.data.recipes);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching recipes:', error);
        setLoading(false);
      }
    };

    fetchRandomRecipes();

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setActiveBenefit((prev) => (prev + 1) % benefits.length);
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, benefits.length]);

  const handleSecretLogin = () => {
    // Implement secret login functionality here
    console.log('Secret login button clicked');
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
      setIsOpen(false); // Close mobile menu after clicking
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Brand */}
            <a href="/" className="flex items-center space-x-2">
              <ChefHat className="h-8 w-8 text-[#F77F00]" />
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F77F00] to-teal-500">
                Recipe Hub
              </span>
            </a>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              <NavLink onClick={() => scrollToSection('featured')}>Featured</NavLink>
              <NavLink onClick={() => scrollToSection('benefits')}>Benefits</NavLink>
              <NavLink onClick={() => scrollToSection('cooking-videos')}>Videos</NavLink>
            </div>

            {/* Search Button (Secret Login) */}
            <button
              onClick={handleSecretLogin}
              className="p-2 text-gray-500 hover:text-[#F77F00] transition-colors duration-200"
              aria-label="Search"
            >
              <Search className="h-6 w-6" />
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-[#F77F00] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#F77F00]"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <NavLink mobile onClick={() => scrollToSection('featured')}>
                  Featured
                </NavLink>
                <NavLink mobile onClick={() => scrollToSection('benefits')}>
                  Benefits
                </NavLink>
                <NavLink mobile onClick={() => scrollToSection('cooking-videos')}>
                  Videos
                </NavLink>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-16">
        <div className="relative overflow-hidden bg-cover bg-center bg-no-repeat" style={{backgroundImage: `url(${heroBackground})`}}>
          <div className="absolute inset-0 bg-black opacity-50"></div>
          <div className="relative z-10 pb-8 text-white sm:pb-16 md:pb-20 lg:w-full lg:pb-28 xl:pb-32">
            <div className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="text-center">
                <motion.h1
                  className="text-5xl tracking-tight font-extrabold text-white sm:text-6xl md:text-7xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <span className="block font-liber">Discover Amazing</span>
                  <span className="block text-[#F77F00] font-liber">Recipes Today</span>
                </motion.h1>
                <motion.p
                  className="mt-3 text-base text-gray-200 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Find and share the best recipes from around the world. Start your culinary journey today!
                </motion.p>

                {/* Video Section First */}
                <div className="mt-5 sm:mt-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <div className="max-w-3xl mx-auto w-full rounded-lg shadow-xl overflow-hidden aspect-video">
                      {(!showVideo || videoError) ? (
                        <img
                          src="https://img.youtube.com/vi/srMEoe_5y6g/maxresdefault.jpg"
                          alt="Video thumbnail"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <iframe
                          className="w-full h-full"
                          src="https://www.youtube.com/embed/srMEoe_5y6g?autoplay=1&mute=1"
                          title="Recipe Video"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          onError={() => setVideoError(true)}
                        />
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Search Input Section */}
                <motion.div
                  className="mt-8 max-w-xl mx-auto"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <p className="mb-2 text-gray-200 text-lg md:text-xl">
                    👇 Use me! 👇
                  </p>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search for recipes..."
                      className="w-full px-6 py-4 rounded-full text-gray-900 bg-white/90 backdrop-blur-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-[#F77F00]/50"
                    />
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-gradient-to-r from-[#F77F00] to-[#E63946] rounded-full text-white hover:opacity-90 transition-opacity"
                      aria-label="Search"
                    >
                      <Search className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="mt-2 text-gray-200 text-sm">
                    ☝️ Let's try it out? Search your favourite recipe ☝️
                  </p>
                </motion.div>

                <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
                  <motion.div
                    className="w-full sm:w-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                  >
                    <a
                      href="/home"
                      className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#F77F00] to-[#E63946] p-0.5 text-sm font-medium text-white hover:text-[#E63946] focus:outline-none focus:ring-4 focus:ring-[#E63946]/50"
                    >
                      <span className="relative flex items-center rounded-full bg-transparent px-8 py-3 transition-all duration-75 ease-in group-hover:bg-white md:py-4 md:text-lg md:px-10">
                        <svg 
                          className="mr-2 h-5 w-5" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                        </svg>
                        Get Started
                      </span>
                    </a>
                  </motion.div>
                  <motion.div
                    className="w-full sm:w-auto"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                  >
                    <a
                      href="/add-recipe"
                      className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#F77F00] to-[#E63946] p-0.5 text-sm font-medium text-white hover:text-[#E63946] focus:outline-none focus:ring-4 focus:ring-[#E63946]/50"
                    >
                      <span className="relative flex items-center rounded-full bg-transparent px-8 py-3 transition-all duration-75 ease-in group-hover:bg-white md:py-4 md:text-lg md:px-10">
                        <svg 
                          className="mr-2 h-5 w-5" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                        </svg>
                        Add Recipe
                      </span>
                    </a>
                  </motion.div>
                </div>

                {/* Trusted Section */}
                <motion.div
                  className="mt-8 text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  <p className="text-gray-200 text-sm mb-3">
                    Over 500+ reviews from happy families
                  </p>
                  <div className="flex justify-center items-center -space-x-2">
                    <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
                        alt="Happy user 1"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c"
                        alt="Happy user 2"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6"
                        alt="Happy user 3"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Featured Recipes Section */}
      <section id="featured" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-center mb-12 font-liber">
              Featured Recipes
            </h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F77F00]"></div>
              </div>
            ) : (
              <div className="relative overflow-hidden py-4">
                <div className="flex animate-scroll">
                  {[...featuredRecipes, ...featuredRecipes].map((recipe, index) => (
                    <div
                      key={`${recipe.id}-${index}`}
                      className="flex-none w-80 mx-6"
                    >
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden transform transition-transform hover:scale-105 duration-300">
                        <img
                          src={recipe.image}
                          alt={recipe.title}
                          className="w-full h-56 object-cover"
                        />
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-gray-800 truncate mb-3">
                            {recipe.title}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4 flex items-center">
                            <svg className="w-5 h-5 mr-2 text-[#F77F00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Prepared in {recipe.readyInMinutes} minutes
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-[#F77F00] flex items-center text-lg">
                              ★ {(recipe.spoonacularScore / 20).toFixed(1)}/5
                            </span>
                            <a
                              href={`/recipe/${recipe.id}`}
                              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#F77F00] to-[#E63946] p-0.5 text-sm font-medium text-white hover:text-[#E63946] focus:outline-none focus:ring-4 focus:ring-[#E63946]/50"
                            >
                              <span className="relative flex items-center rounded-full bg-transparent px-4 py-2 transition-all duration-75 ease-in group-hover:bg-white">
                                <svg 
                                  className="mr-1 h-4 w-4" 
                                  fill="none" 
                                  stroke="currentColor" 
                                  viewBox="0 0 24 24" 
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                                View Recipe
                              </span>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Meet the Devs Section */}
      <section className="py-16 bg-gradient-to-b from-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6 font-liber">
              Meet the Devs
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              RecipeHub is crafted with love by a team of passionate developers who believe in making cooking accessible and enjoyable for everyone.
            </p>
          </motion.div>

          {/* Developer Cards */}
          <div className="space-y-20 md:space-y-24">
            {/* First Developer */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row items-center gap-8 md:gap-16"
            >
              <div className="w-64 h-64 rounded-full overflow-hidden shadow-xl flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
                  alt="Developer 1"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-2xl font-liber mb-4">Sarah Johnson</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Full Stack Developer and UI/UX enthusiast with a passion for creating seamless user experiences. Sarah leads the frontend development of RecipeHub, ensuring that every interaction feels natural and engaging.
                </p>
              </div>
            </motion.div>

            {/* Second Developer */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-16"
            >
              <div className="w-64 h-64 rounded-full overflow-hidden shadow-xl flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6"
                  alt="Developer 2"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-2xl font-liber mb-4">Michael Chen</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Backend wizard and database architect. Michael ensures that RecipeHub runs smoothly behind the scenes, handling complex recipe calculations and user data management with expertise.
                </p>
              </div>
            </motion.div>

            {/* Third Developer */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row items-center gap-8 md:gap-16"
            >
              <div className="w-64 h-64 rounded-full overflow-hidden shadow-xl flex-shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c"
                  alt="Developer 3"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-2xl font-liber mb-4">Emily Rodriguez</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Quality Assurance lead and DevOps engineer. Emily ensures that every feature works flawlessly across all devices and maintains the high standards of RecipeHub's performance.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Video Grid Section */}
      <section id="cooking-videos" className="py-16 bg-gradient-to-b from-green-50 to-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold font-liber mb-6">
              Cooking in Action
            </h2>
            <p className="text-xl text-gray-600">
              Watch and learn from our curated cooking guides
            </p>
          </motion.div>

          {/* Desktop: 2x2 Grid, Mobile: Vertical Stack */}
          <div className="grid md:grid-cols-2 grid-cols-1 gap-4 md:gap-6 max-w-4xl mx-auto relative">
            {/* Video 1 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="aspect-video rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 relative group"
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300 z-10"></div>
              {!showVideo ? (
                <img
                  src="https://img.youtube.com/vi/RivD2AicW9U/maxresdefault.jpg"
                  alt="Cooking Video Thumbnail"
                  className="w-full h-full object-cover"
                />
              ) : (
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/RivD2AicW9U?autoplay=1&mute=1"
                  title="Cooking Video 1"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </motion.div>

            {/* Video 2 - Hidden on Mobile */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="hidden md:block aspect-video rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 relative group"
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300 z-10"></div>
              {!showVideo ? (
                <img
                  src="https://img.youtube.com/vi/NNGZvgE4rks/maxresdefault.jpg"
                  alt="Cooking Video Thumbnail"
                  className="w-full h-full object-cover"
                />
              ) : (
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/NNGZvgE4rks?autoplay=1&mute=1"
                  title="Cooking Video 2"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </motion.div>

            {/* Centered Get Started Button */}
            <div className="md:absolute relative md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-20 py-8 md:py-0">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                whileHover={{ scale: 1.05 }}
                className="bg-white/90 backdrop-blur-sm p-1.5 rounded-full shadow-xl mx-auto"
              >
                <a
                  href="/home"
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#F77F00] to-[#E63946] p-0.5 text-sm font-medium text-white hover:text-[#E63946] focus:outline-none focus:ring-4 focus:ring-[#E63946]/50"
                >
                  <span className="relative flex items-center rounded-full bg-transparent px-6 py-3 transition-all duration-75 ease-in group-hover:bg-white md:px-8 md:py-4">
                    <svg 
                      className="mr-2 h-5 w-5" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    Start Cooking
                  </span>
                </a>
              </motion.div>
            </div>

            {/* Video 3 - Hidden on Mobile */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="hidden md:block aspect-video rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 relative group"
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300 z-10"></div>
              {!showVideo ? (
                <img
                  src="https://img.youtube.com/vi/P8hhbJK8ADg/maxresdefault.jpg"
                  alt="Cooking Video Thumbnail"
                  className="w-full h-full object-cover"
                />
              ) : (
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/P8hhbJK8ADg?autoplay=1&mute=1"
                  title="Cooking Video 3"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </motion.div>

            {/* Video 4 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="aspect-video rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300 relative group"
            >
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300 z-10"></div>
              {!showVideo ? (
                <img
                  src="https://img.youtube.com/vi/EaKA3Wc-49s/maxresdefault.jpg"
                  alt="Cooking Video Thumbnail"
                  className="w-full h-full object-cover"
                />
              ) : (
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/EaKA3Wc-49s?autoplay=1&mute=1"
                  title="Cooking Video 4"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              )}
            </motion.div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -left-10 top-1/4 w-24 h-24 bg-gradient-to-br from-[#F77F00]/20 to-[#E63946]/20 rounded-full blur-xl"></div>
        <div className="absolute -right-10 bottom-1/4 w-32 h-32 bg-gradient-to-br from-[#F77F00]/20 to-[#E63946]/20 rounded-full blur-xl"></div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gradient-to-b from-white to-orange-50 relative overflow-hidden">
        {/* Attention Grabber */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 10 }}
          transition={{ duration: 0.5 }}
          className="absolute -top-6 right-10 z-10"
        >
          <div className="bg-red-50 p-4 rounded-lg shadow-xl border-2 border-red-500 transform hover:scale-105 transition-transform cursor-pointer">
            <div className="flex items-center gap-2 text-red-500">
              <svg className="w-8 h-8 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-bold text-lg whitespace-nowrap">Stop Wasting Time!</span>
            </div>
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold font-liber mb-6"
            >
              Why Choose RecipeHub?
            </motion.h2>
          </div>

          {/* Interactive Benefit Display */}
          <div className="relative">
            <motion.div
              key={activeBenefit}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl">{benefits[activeBenefit].icon}</span>
                  <h3 className="text-2xl font-bold font-liber">{benefits[activeBenefit].title}</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="p-6 bg-red-50 rounded-xl">
                    <h4 className="font-semibold mb-4 text-red-600">Without RecipeHub:</h4>
                    <p className="text-gray-700">{benefits[activeBenefit].withoutApp}</p>
                  </div>
                  <div className="p-6 bg-green-50 rounded-xl">
                    <h4 className="font-semibold mb-4 text-green-600">With RecipeHub:</h4>
                    <p className="text-gray-700">{benefits[activeBenefit].withApp}</p>
                  </div>
                </div>
              </div>

              {/* Benefit Navigation */}
              <div className="flex justify-center items-center gap-4 mb-8">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
                >
                  {isPlaying ? "⏸️" : "▶️"}
                </button>
                {benefits.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveBenefit(index);
                      setIsPlaying(false);
                    }}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === activeBenefit
                        ? "bg-[#F77F00] w-6"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>

              {/* CTA Button - Now always visible */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <a
                  href="/signup"
                  className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[#F77F00] to-[#E63946] p-0.5 text-sm font-medium text-white hover:text-[#E63946] focus:outline-none focus:ring-4 focus:ring-[#E63946]/50"
                >
                  <span className="relative flex items-center rounded-full bg-transparent px-8 py-3 transition-all duration-75 ease-in group-hover:bg-white md:py-4 md:text-lg md:px-10">
                    <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Transform Your Cooking Journey
                  </span>
                </a>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute left-0 top-1/4 w-64 h-64 bg-gradient-to-br from-[#F77F00]/10 to-[#E63946]/10 rounded-full blur-3xl"></div>
        <div className="absolute right-0 bottom-1/4 w-64 h-64 bg-gradient-to-br from-[#F77F00]/10 to-[#E63946]/10 rounded-full blur-3xl"></div>
      </section>

      {/* Footer Section */}
      <footer className="bg-white/80 backdrop-blur-md shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo Column */}
            <div className="flex flex-col items-center md:items-start space-y-4">
              <div className="flex items-center space-x-2">
                <ChefHat className="h-8 w-8 text-[#F77F00]" />
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#F77F00] to-teal-500">
                  Recipe Hub
                </span>
              </div>
              <p className="text-gray-600 text-sm text-center md:text-left">
                Making cooking accessible and enjoyable for everyone.
              </p>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col items-center space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Quick Links</h3>
              <div className="flex flex-col items-center space-y-2">
                <a href="/home" className="text-gray-600 hover:text-[#F77F00] transition-colors duration-200">Home</a>
                <a href="/favorites" className="text-gray-600 hover:text-[#F77F00] transition-colors duration-200">Favorites</a>
                <a href="/add-recipe" className="text-gray-600 hover:text-[#F77F00] transition-colors duration-200">Add Recipe</a>
              </div>
            </div>

            {/* Contact/Social */}
            <div className="flex flex-col items-center md:items-end space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="p-2 rounded-full bg-gradient-to-br from-[#F77F00] to-[#E63946] text-white hover:opacity-90 transition-opacity">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a href="#" className="p-2 rounded-full bg-gradient-to-br from-[#F77F00] to-[#E63946] text-white hover:opacity-90 transition-opacity">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                  </svg>
                </a>
                <a href="#" className="p-2 rounded-full bg-gradient-to-br from-[#F77F00] to-[#E63946] text-white hover:opacity-90 transition-opacity">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 mt-8 pt-8">
            <p className="text-center text-gray-500 text-sm">
              Built with ❤️ by{' '}
              <span className="bg-gradient-to-r from-[#F77F00] to-[#E63946] bg-clip-text text-transparent font-medium">
                Victor Mancho, Anita Olang & Ayomikun Abass
              </span>
            </p>
            <p className="text-center text-gray-400 text-xs mt-2">
              © {new Date().getFullYear()} Recipe Hub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const NavLink = ({ onClick, children, mobile }) => {
  const baseClasses = "text-gray-700 hover:text-[#F77F00] transition-colors duration-200 cursor-pointer";
  const desktopClasses = "px-3 py-2 rounded-md text-sm font-medium";
  const mobileClasses = "block px-3 py-2 rounded-md text-base font-medium";

  return (
    <span 
      className={`${baseClasses} ${mobile ? mobileClasses : desktopClasses}`} 
      onClick={onClick}
    >
      {children}
    </span>
  );
};

LandingPage.displayName = 'LandingPage';

// Add this CSS to your global styles or as a style tag
const styles = `
  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }
  
  .animate-scroll {
    animation: scroll 30s linear infinite;
  }
`;

// Add the styles to the document
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

export default LandingPage;

