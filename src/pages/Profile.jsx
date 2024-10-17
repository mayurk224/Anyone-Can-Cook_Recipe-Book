import React, { useEffect, useState } from "react";
import {
  doc,
  getDocs,
  collection,
  query,
  where,
  deleteDoc,
  updateDoc,
  arrayRemove,
  arrayUnion,
  getDoc,
} from "firebase/firestore"; // Firestore functions
import { auth, db, storage } from "../firebase/firebaseConfig"; // Firebase configuration
import Header from "../components/Header";
import DynamicBreadcrumb from "../components/DynamicBreadcrumb";
import RecipeCard from "../components/RecipeCard";
import { useAuth } from "../context/AuthContext";
import { deleteObject, ref, listAll } from "firebase/storage";
import axios from "axios"; // Import Axios for API calls

const Profile = () => {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]); // State to manage user's favorites
  const [favoriteRecipes, setFavoriteRecipes] = useState([]); // State to store fetched favorite recipes
  const { currentUser } = useAuth(); // Get the logged-in user (assuming you're using Firebase Auth)

  useEffect(() => {
    const fetchUserRecipes = async () => {
      if (!currentUser) return;

      // Fetch user's recipes from Firestore
      const q = query(
        collection(db, "recipes"),
        where("userId", "==", currentUser.uid)
      );

      const querySnapshot = await getDocs(q);
      const userRecipes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRecipes(userRecipes);

      // Fetch user's favorite recipes
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      if (userDoc.exists()) {
        const userFavorites = userDoc.data().favorites || [];
        setFavorites(userFavorites);

        // Fetch favorite recipes based on ID type (number or string)
        const favoriteRecipesPromises = userFavorites.map((recipeId) => {
          if (typeof recipeId === "number") {
            // Fetch from external API
            return axios
              .get(`https://dummyjson.com/recipes/${recipeId}`)
              .then((response) => response.data)
              .catch((error) =>
                console.error("Error fetching API recipe:", error)
              );
          } else {
            // Fetch from Firestore
            return getDoc(doc(db, "recipes", recipeId)).then((docSnapshot) => ({
              id: docSnapshot.id,
              ...docSnapshot.data(),
            }));
          }
        });

        const favoriteRecipesSnapshot = await Promise.all(
          favoriteRecipesPromises
        );
        setFavoriteRecipes(favoriteRecipesSnapshot);
      }
    };

    fetchUserRecipes();
  }, [currentUser]);

  // Handle toggle favorite functionality
  const handleToggleFavorite = async (recipeId) => {
    if (!currentUser) return;

    const userRef = doc(db, "users", currentUser.uid);
    try {
      if (favorites.includes(recipeId)) {
        // If already a favorite, remove it
        await updateDoc(userRef, {
          favorites: arrayRemove(recipeId),
        });
        setFavorites((prev) => prev.filter((id) => id !== recipeId)); // Update local state
        setFavoriteRecipes((prev) =>
          prev.filter((recipe) => recipe.id !== recipeId)
        ); // Update favorite recipes state
      } else {
        // Add to favorites
        await updateDoc(userRef, {
          favorites: arrayUnion(recipeId),
        });
        setFavorites((prev) => [...prev, recipeId]); // Update local state

        // Fetch the new favorite recipe based on the ID type (number or string)
        if (typeof recipeId === "number") {
          const response = await axios.get(
            `https://dummyjson.com/recipes/${recipeId}`
          );
          setFavoriteRecipes((prev) => [...prev, response.data]);
        } else {
          const recipeDoc = await getDoc(doc(db, "recipes", recipeId));
          setFavoriteRecipes((prev) => [
            ...prev,
            { id: recipeDoc.id, ...recipeDoc.data() },
          ]);
        }
      }
    } catch (error) {
      console.error("Error updating favorites: ", error);
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      // 1. Delete the recipe from Firestore
      const recipeRef = doc(db, "recipes", recipeId);
      await deleteDoc(recipeRef);

      // 2. Delete the image folder from Firebase Storage
      const imageRef = ref(storage, `recipesImage/${recipeId}`);
      await deleteFolder(imageRef);

      // 3. Remove recipe ID from all users' favorite arrays
      const usersSnapshot = await getDocs(collection(db, "users"));
      const batchPromises = [];

      usersSnapshot.forEach((userDoc) => {
        const userData = userDoc.data();

        if (userData.favorites && userData.favorites.includes(recipeId)) {
          const userRef = doc(db, "users", userDoc.id);
          batchPromises.push(
            updateDoc(userRef, {
              favorites: arrayRemove(recipeId),
            })
          );
        }
      });

      await Promise.all(batchPromises);

      // 4. Remove recipe ID from current user's recipes field
      const currentUserRef = doc(db, "users", currentUser.uid);
      await updateDoc(currentUserRef, {
        recipes: arrayRemove(recipeId),
      });

      alert("Recipe deleted successfully!");

      // Refresh the recipes list
      setRecipes((prev) => prev.filter((recipe) => recipe.id !== recipeId));
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert("Failed to delete the recipe. Please try again.");
    }
  };

  const deleteFolder = async (folderRef) => {
    const listResult = await listAll(folderRef);
    const deletePromises = listResult.items.map((itemRef) =>
      deleteObject(itemRef)
    );
    await Promise.all(deletePromises);
  };

  const [activeTab, setActiveTab] = useState("myRecipe");

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };

  const [userData, setUserData] = useState(null); // Store user data
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser; // Get current authenticated user

        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid)); // Fetch user data from Firestore

          if (userDoc.exists()) {
            setUserData(userDoc.data()); // Store fetched data
          } else {
            throw new Error("User data not found.");
          }
        } else {
          throw new Error("No user is logged in.");
        }
      } catch (err) {
        setError(err.message); // Handle errors
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    fetchUserData();
  }, []);

  const formatDate = (isoString) => {
    const date = new Date(isoString); // Convert ISO string to Date object
    return date.toLocaleDateString(); // Extract and format only the date
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="mx-4 md:mx-10 lg:mx-24">
      <Header />
      <div className="container mt-10 md:mt-24">
        <DynamicBreadcrumb />
        <div className="profileSection flex flex-col lg:flex-row rounded-xl bg-slate-500 w-full p-5 justify-between mt-8">
          <div className="flex md:flex-row gap-6 items-center">
            <div>
              <img
                src="https://images.pexels.com/photos/432059/pexels-photo-432059.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Profile"
                className="rounded-full h-24 w-24 md:h-40 md:w-40 object-cover"
              />
            </div>
            <div className="space-y-1 md:text-left">
              <h1 className="text-3xl md:text-4xl font-semibold">
                {userData.displayName}
              </h1>
              <h3 className="font-medium text-base md:text-lg">
                {userData.email}
              </h3>
              <p className="text-sm md:text-base font-medium">
                Joined At: {formatDate(userData.createdAt)}
              </p>
            </div>
          </div>
          <hr className="bg-slate-950 my-5" />
          <div className="flex justify-center items-center lg:justify-end gap-8 lg:mt-0 lg:mr-10">
            <div className="text-center">
              <h3 className="text-xl font-medium lg:text-2xl">Following</h3>
              <h2 className="text-2xl font-semibold lg:text-3xl">20</h2>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-medium lg:text-2xl">Followers</h3>
              <h2 className="text-2xl font-semibold lg:text-3xl">20</h2>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-medium lg:text-2xl">Posts</h3>
              <h2 className="text-2xl font-semibold lg:text-3xl">20</h2>
            </div>
          </div>
        </div>

        <div className="mt-10 max-[500px]:mt-5">
          <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
            <ul
              className="flex flex-wrap text-sm font-medium text-center"
              role="tablist"
            >
              <li className="mr-2" role="presentation">
                <button
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    activeTab === "myRecipe"
                      ? "text-purple-600 border-purple-600"
                      : "text-gray-500 border-transparent"
                  }`}
                  onClick={() => handleTabClick("myRecipe")}
                  type="button"
                  role="tab"
                >
                  My Recipes
                </button>
              </li>
              <li className="mr-2" role="presentation">
                <button
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    activeTab === "bookmark"
                      ? "text-purple-600 border-purple-600"
                      : "text-gray-500 border-transparent"
                  }`}
                  onClick={() => handleTabClick("bookmark")}
                  type="button"
                  role="tab"
                >
                  Bookmark
                </button>
              </li>
              <li role="presentation">
                <button
                  className={`inline-block p-4 border-b-2 rounded-t-lg ${
                    activeTab === "following"
                      ? "text-purple-600 border-purple-600"
                      : "text-gray-500 border-transparent"
                  }`}
                  onClick={() => handleTabClick("following")}
                  type="button"
                  role="tab"
                >
                  Following
                </button>
              </li>
            </ul>
          </div>

          <div className="tab-content">
            {activeTab === "myRecipe" && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {recipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onDeleteRecipe={handleDeleteRecipe}
                      isFavorite={favorites.includes(recipe.id)}
                      onToggleFavorite={handleToggleFavorite}
                      hideDelete={false}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "bookmark" && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {favoriteRecipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onDeleteRecipe={handleDeleteRecipe}
                      isFavorite={favorites.includes(recipe.id)}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "following" && <div>Following recipes</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
