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
    <div className={cardClass} onClick={handleCardClick}>
      <img
        src={recipe.image || "https://via.placeholder.com/150"}
        alt={recipe.name}
        className="recipe-image"
      />
      <h2>{recipe.name}</h2>
      <p>{recipe.mealType}</p>
      <p>
        <strong>Servings:</strong> {recipe.servings}
      </p>
      <p>
        <strong>Prep Time:</strong> {recipe.prepTimeMinutes} mins
      </p>
      <p>
        <strong>Cook Time:</strong> {recipe.cookTimeMinutes} mins
      </p>

      {/* Favorite Button */}
      <button
        className={`favorite-button ${isFavorite ? "favorited" : ""}`}
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering navigation on button click
          onToggleFavorite(recipe.id);
        }}
      >
        {isFavorite ? "❤️" : "♡"} Favorite
      </button>

      {/* Conditionally render delete button only on /profile page */}
      {location.pathname === "/profile" && (
        <button
          className="delete-button"
          onClick={(e) => {
            e.stopPropagation(); // Prevent triggering navigation on button click
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
