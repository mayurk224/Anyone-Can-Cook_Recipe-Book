import React, { useEffect, useState } from "react";
import RecipeCard from "./RecipeCard"; // Import the RecipeCard component
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase Auth
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  getFirestore,
} from "firebase/firestore"; // Firestore operations
import "../styles/FeaturedRecipes.css"; // Optional: Add any styles for featured recipes

const FeaturedRecipe = () => {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]); // To store favorite recipe IDs
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null); // Store authenticated user
  const [updatingFavorites, setUpdatingFavorites] = useState(false); // Prevent multiple clicks while updating

  const db = getFirestore(); // Firestore instance
  const auth = getAuth(); // Firebase auth instance

  // Fetch user favorites from Firestore
  const fetchUserFavorites = async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setFavorites(userData.favorites || []); // Set favorites or empty array if none
      }
    } catch (error) {
      console.error("Error fetching user favorites:", error);
    }
  };

  useEffect(() => {
    // Monitor authentication state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch user favorites when logged in
        fetchUserFavorites(currentUser.uid);
      } else {
        setUser(null);
        setFavorites([]); // Clear favorites when user logs out
      }
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, [auth]);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await fetch("https://dummyjson.com/recipes?limit=0");
        const data = await response.json();

        // Shuffle the recipes array to get random recipes
        const shuffledRecipes = data.recipes.sort(() => 0.5 - Math.random());

        // Get the first 9 recipes
        const randomRecipes = shuffledRecipes.slice(0, 9);

        setRecipes(randomRecipes);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  // Function to toggle a recipe's favorite status
  const handleToggleFavorite = async (recipeId) => {
    if (!user) {
      alert("Please log in to favorite a recipe");
      return;
    }

    if (updatingFavorites) return; // Prevent multiple clicks
    setUpdatingFavorites(true);

    const userDocRef = doc(db, "users", user.uid); // Reference to user's document in Firestore

    try {
      if (favorites.includes(recipeId)) {
        // Remove favorite
        await updateDoc(userDocRef, {
          favorites: arrayRemove(recipeId),
        });
        setFavorites((prevFavorites) =>
          prevFavorites.filter((id) => id !== recipeId)
        );
      } else {
        // Add favorite
        await updateDoc(userDocRef, {
          favorites: arrayUnion(recipeId),
        });
        setFavorites((prevFavorites) => [...prevFavorites, recipeId]);
      }
    } catch (error) {
      console.error("Error updating favorites:", error);
    } finally {
      setUpdatingFavorites(false);
    }
  };

  if (loading) {
    return <p>Loading featured recipes...</p>;
  }

  return (
    <div className="featured-recipes-container">
      <h2 className="featured-title py-10 font-semibold text-4xl">
        Featured Recipes
      </h2>
      <div className="featured-recipes-grid">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            isFavorite={favorites.includes(recipe.id)} // Check if recipe is a favorite
            onToggleFavorite={handleToggleFavorite} // Pass function to toggle favorite
            onDelete={() => {}} // No delete option in featured section
            size="large" // You can define custom sizes like "small", "medium", "large" in your CSS
          />
        ))}
      </div>
    </div>
  );
};

export default FeaturedRecipe;
