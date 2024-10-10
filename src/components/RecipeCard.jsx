import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/RecipeCard.css";

const RecipeCard = ({
  recipe,
  isFavorite,
  onToggleFavorite,
  onDelete,
  size,
}) => {
  const location = useLocation(); // Get current route
  const navigate = useNavigate(); // For navigation

  const handleCardClick = () => {
    // Navigate to the RecipeDetails page with the recipe id
    navigate(`/recipes/${recipe.id}`);
  };

  const cardClass = `recipe-card ${size}`;

  return (
    <div
      className="flex flex-col items-center p-6 bg-white shadow-md rounded-lg transition-transform duration-300 ease-in-out hover:scale-105 w-full max-w-xs sm:max-w-sm mx-auto"
      onClick={handleCardClick}
    >
      <img
        src={recipe.image || "https://via.placeholder.com/150"}
        alt={recipe.name}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />

      {/* Truncated Recipe Name */}
      <h2 className="text-xl font-semibold text-center mb-2 truncate w-full">
        {recipe.name}
      </h2>

      <p className="text-gray-600">{recipe.mealType.join(", ")}</p>

      <p className="text-gray-800">
        <strong>Servings:</strong> {recipe.servings}
      </p>
      <p className="text-gray-800">
        <strong>Cuisine:</strong> {recipe.cuisine}
      </p>
      <p className="text-gray-800 mb-4">
        <strong>Cook Time:</strong> {recipe.cookTimeMinutes} mins
      </p>

      {/* Favorite Button */}
      <button
        className={`bg-red-200 hover:bg-red-400 text-red-600 font-bold py-2 px-4 rounded-full ${
          isFavorite ? "bg-red-400 text-white" : ""
        }`}
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(recipe.id);
        }}
      >
        {isFavorite ? "❤️ Favorited" : "🤍 Favorite"}
      </button>

      {/* Delete Button - only visible on the profile page */}
      {location.pathname === "/profile" && (
        <button
          className="bg-red-500 text-white font-bold py-2 px-4 rounded-full mt-3"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(recipe.id);
          }}
        >
          🗑️ Delete
        </button>
      )}
    </div>
  );
};

export default RecipeCard;
