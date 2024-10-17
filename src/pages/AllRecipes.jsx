import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // To retrieve query params
import { fetchAllRecipes } from "../services/services"; // Adjust the path
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Firebase Auth
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  getFirestore,
} from "firebase/firestore"; // Firestore operations
import RecipeCard from "../components/RecipeCard"; // Adjust the path
import Header from "../components/Header";
import Spinner from "../components/Spinner";

const AllRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]); // To store favorite recipe IDs
  const [loading, setLoading] = useState(true);
  const [filteredRecipes, setFilteredRecipes] = useState([]); // Filtered list of recipes
  const [user, setUser] = useState(null); // Store authenticated user
  const [updatingFavorites, setUpdatingFavorites] = useState(false); // Prevent multiple clicks while updating

  const location = useLocation(); // Get the current path to check query params
  const searchParams = new URLSearchParams(location.search); // Get query parameters
  const mealType = searchParams.get("mealType"); // Get the 'mealType' parameter
  const tag = searchParams.get("tag"); // Get the 'tag' parameter
  const navigate = useNavigate(); // To navigate to login

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
    const loadRecipes = async () => {
      try {
        const recipeList = await fetchAllRecipes();
        setRecipes(recipeList);

        // Filter recipes based on mealType if it's present
        let filtered = recipeList;
        if (mealType) {
          filtered = filtered.filter((recipe) =>
            recipe.mealType.includes(mealType)
          );
        }

        // Further filter recipes based on tag if it's present
        if (tag) {
          filtered = filtered.filter(
            (recipe) => recipe.tags?.includes(tag) // Make sure to check if tags exist
          );
        }

        setFilteredRecipes(filtered); // Set the filtered recipes
      } catch (error) {
        console.error("Error fetching recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRecipes();
  }, [mealType, tag]); // Reload when mealType or tag changes

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
      console.log(`Recipe with ID ${recipeId} deleted`);
    }
  };

  const handleSearch = (query) => {
    const filtered = recipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredRecipes(filtered);
  };

  if (loading) {
    return <Spinner />; // Loading state
  }

  return (
    <div className="all-recipes-page px-4 sm:px-6 lg:px-8 my-8">
      <Header onSearch={handleSearch} />

      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6">
        All Recipes
      </h1>

      <div className="recipe-container">
        <div className="recipe-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
