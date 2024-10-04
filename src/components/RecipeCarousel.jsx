import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/RecipeCarousel.css"; // For carousel styling

const RecipeCarousel = () => {
  const [recipes, setRecipes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          "https://dummyjson.com/recipes?limit=0"
        );
        const shuffledRecipes = response.data.recipes
          .sort(() => 0.5 - Math.random())
          .slice(0, 5); // Get 5 random recipes
        setRecipes(shuffledRecipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % recipes.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [recipes]);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % recipes.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? recipes.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="carousel-container">
      {recipes.length > 0 && (
        <>
          <div className="carousel-slide">
            {recipes.map((recipe, index) => (
              <div
                key={recipe.id}
                className={`carousel-item ${
                  index === currentIndex ? "active" : ""
                }`}
              >
                <img
                  src={recipe.image}
                  alt={recipe.name}
                  className="recipe-image"
                />
                <div className="recipe-info">
                  <h2>{recipe.name}</h2>
                  <p>Rating: {recipe.rating}</p>
                  <p>Cooking Time: {recipe.cookTimeMinutes} mins</p>
                  <p>Meal Type: {recipe.mealType}</p>
                  <p>Cuisine: {recipe.cuisine}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Buttons */}
          <button className="carousel-prev" onClick={goToPrev}>
            &#10094; {/* Left arrow */}
          </button>
          <button className="carousel-next" onClick={goToNext}>
            &#10095; {/* Right arrow */}
          </button>
        </>
      )}
    </div>
  );
};

export default RecipeCarousel;
