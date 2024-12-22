import React, { useState, useEffect, useRef } from 'react';
import { BiSearch, BiTime } from 'react-icons/bi';

function SearchBar({ onSearch, shouldClear }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Add effect to watch for clear trigger
  useEffect(() => {
    if (shouldClear) {
      setSearchTerm('');
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [shouldClear]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      onSearch(searchTerm);
      setShowSuggestions(false);
    }
  };

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 2) {
      try {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/complexSearch?apiKey=${import.meta.env.VITE_SPOONACULAR_API_KEY}&query=${value}&number=5`
        );
        const data = await response.json();
        setSuggestions(data.results.map(item => ({
          id: item.id,
          title: item.title
        })));
        setShowSuggestions(true);
      } catch (err) {
        console.error('Failed to fetch suggestions:', err);
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.title);
    setShowSuggestions(false);
    onSearch(suggestion.title);
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto z-50" ref={searchRef}>
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-[#F77F00]/20 to-teal-500/20 rounded-2xl blur transition duration-300 group-hover:blur-xl" />
        <div className="relative bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/20">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Search for your next culinary adventure..."
            className="w-full px-8 py-5 text-lg bg-transparent rounded-2xl outline-none text-gray-700 placeholder:text-gray-400"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <BiSearch className="w-6 h-6 text-[#F77F00]" />
          </div>
        </div>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute w-full mt-2 bg-white/80 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-2">
            <div className="text-xs text-gray-400 px-3 py-2">Suggestions</div>
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="flex items-center px-3 py-2.5 hover:bg-[#F77F00]/10 rounded-lg cursor-pointer transition-colors duration-200 group"
              >
                <BiSearch className="w-4 h-4 mr-2 text-gray-400 group-hover:text-[#F77F00]" />
                <span className="text-gray-600 group-hover:text-[#F77F00]">{suggestion.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchBar;