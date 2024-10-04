import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // To check the current page
import { fetchAllRecipes } from "../services/services"; // Adjust the path
import RecipeCard from "../components/RecipeCard"; // Adjust the path

const AllRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]); // To store favorite recipe IDs
  const [loading, setLoading] = useState(true);
  const [filteredRecipes, setFilteredRecipes] = useState([]); // Filtered list of recipes

  const location = useLocation(); // Get the current path to check if the user is on the profile page

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const recipeList = await fetchAllRecipes();
        setRecipes(recipeList);
        setFilteredRecipes(recipeList); // Initially, show all recipes
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, []);

  // Function to toggle a recipe's favorite status
  const handleToggleFavorite = (recipeId) => {
    setFavorites(
      (prevFavorites) =>
        prevFavorites.includes(recipeId)
          ? prevFavorites.filter((id) => id !== recipeId) // Remove if it's already a favorite
          : [...prevFavorites, recipeId] // Add to favorites if not already present
    );
  };

  // Function to handle recipe deletion
  const handleDeleteRecipe = (recipeId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this recipe?"
    );

    if (confirmDelete) {
      setRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe.id !== recipeId)
      );
      setFilteredRecipes((prevRecipes) =>
        prevRecipes.filter((recipe) => recipe.id !== recipeId)
      );
      // Optionally, make an API call to delete the recipe from the backend
      console.log(`Recipe with ID ${recipeId} deleted`);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  return (
    <div className="all-recipes-page">
      {/* Carousel component displaying 5 random recipes */}

      <h1>All Recipes</h1>

      <div className="recipe-container">
        <div className="recipe-grid">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              isFavorite={favorites.includes(recipe.id)} // Check if recipe is a favorite
              onToggleFavorite={handleToggleFavorite} // Pass function to toggle favorite
              onDelete={handleDeleteRecipe} // Pass function to handle delete
              size="large"
              showDeleteButton={location.pathname === "/profile"} // Show delete button only on profile page
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default AllRecipes;
