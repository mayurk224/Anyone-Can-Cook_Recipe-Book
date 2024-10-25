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
import { onAuthStateChanged } from "firebase/auth";
import Spinner from "../components/Spinner";
import { TbBowlSpoonFilled } from "react-icons/tb";
import { FaHeart } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Profile = () => {
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]); // State to manage user's favorites
  const [favoriteRecipes, setFavoriteRecipes] = useState([]); // State to store fetched favorite recipes
  const { currentUser, deleteAccount } = useAuth(); // Get the logged-in user (assuming you're using Firebase Auth)

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
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid)); // Fetch user data
          if (userDoc.exists()) {
            setUserData(userDoc.data()); // Store fetched data
          } else {
            setError("User data not found.");
          }
        } catch (err) {
          setError(err.message); // Handle fetch errors
        } finally {
          setLoading(false); // Stop loading spinner
        }
      } else {
        setError("No user is logged in."); // Handle user not found
        navigate("/");
        setLoading(false); // Stop loading spinner
      }
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, []);

  const formatDate = (isoString) => {
    const date = new Date(isoString); // Convert ISO string to Date object
    return date.toLocaleDateString(); // Extract and format only the date
  };

  if (loading) return <Spinner />;
  if (error) return <p>Error: {error}</p>;

  const handleDeleteAccount = async () => {
    await deleteAccount(); // No password needed for Google reauthentication
  };
  return (
    <div>
      <Header />
      <div className="mx-20 max-sm:mx-5">
        <div className="my-5">
          <DynamicBreadcrumb />
        </div>

        <div className="flex items-center gap-7 bg-slate-400 rounded-3xl p-8 max-sm:flex-col max-sm:gap-5">
          <div className="">
            <img
              src={userData?.imageUrl}
              alt=""
              className="h-32 w-32 object-cover rounded-full ring-2 ring-gray-300 p-1 max-sm:w-24 max-sm:h-24"
            />
          </div>
          <div className="space-y-1 max-sm:text-center">
            <h3 className="text-3xl font-semibold">{userData.displayName}</h3>
            <h4 className="text-xl font-medium text-gray-800">
              {userData.email}
            </h4>
            <p className="text-base font-medium">
              Joined At: {formatDate(userData.createdAt)}
            </p>
          </div>
        </div>

        <div class="border-b border-gray-200 dark:border-gray-700 my-5">
          <ul class="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
            <li class="me-2">
              <div
                className={`flex p-4 border-b-2 rounded-t-lg cursor-pointer ${
                  activeTab === "myRecipe"
                    ? "text-purple-600 border-purple-600"
                    : "text-gray-500 border-transparent"
                }`}
                onClick={() => handleTabClick("myRecipe")}
                type="button"
                role="tab"
              >
                <TbBowlSpoonFilled size={18} className="mr-1" />
                Recipes
              </div>
            </li>
            <li class="me-2">
              <div
                className={`flex p-4 border-b-2 rounded-t-lg cursor-pointer text-center ${
                  activeTab === "bookmark"
                    ? "text-purple-600 border-purple-600"
                    : "text-gray-500 border-transparent"
                }`}
                onClick={() => handleTabClick("bookmark")}
                type="button"
                role="tab"
              >
                <FaHeart size={18} className="mr-1" />
                Favorite
              </div>
            </li>
            <li class="me-2">
              <div
                className={`flex p-4 border-b-2 rounded-t-lg cursor-pointer ${
                  activeTab === "following"
                    ? "text-purple-600 border-purple-600"
                    : "text-gray-500 border-transparent"
                }`}
                onClick={() => handleTabClick("following")}
                type="button"
                role="tab"
              >
                <svg
                  class="w-4 h-4 me-2 text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M5 11.424V1a1 1 0 1 0-2 0v10.424a3.228 3.228 0 0 0 0 6.152V19a1 1 0 1 0 2 0v-1.424a3.228 3.228 0 0 0 0-6.152ZM19.25 14.5A3.243 3.243 0 0 0 17 11.424V1a1 1 0 0 0-2 0v10.424a3.227 3.227 0 0 0 0 6.152V19a1 1 0 1 0 2 0v-1.424a3.243 3.243 0 0 0 2.25-3.076Zm-6-9A3.243 3.243 0 0 0 11 2.424V1a1 1 0 0 0-2 0v1.424a3.228 3.228 0 0 0 0 6.152V19a1 1 0 1 0 2 0V8.576A3.243 3.243 0 0 0 13.25 5.5Z" />
                </svg>
                Settings
              </div>
            </li>
          </ul>
        </div>

        <div className="my-3">
          {activeTab === "myRecipe" && (
            <div>
              {recipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {recipes.map((recipe) => (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      onDelete={handleDeleteRecipe}
                      isFavorite={favorites.includes(recipe.id)}
                      onToggleFavorite={handleToggleFavorite}
                      hideDelete={false} // Show delete button
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="text-gray-500 text-xl font-semibold">
                    You haven't written any recipe.
                  </h3>
                  <Link
                    to="/addRecipe"
                    className="font-semibold text-gray-500 hover:text-gray-700"
                  >
                    Tap here to create one.
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === "bookmark" && (
            <div>
              {favoriteRecipes.length > 0 ? (
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
              ) : (
                <h3 className="text-gray-500 text-xl font-semibold">
                  You didn't liked any recipe
                </h3>
              )}
            </div>
          )}

          {activeTab === "following" && (
            <div className="settings ">
              <div className="max-sm:flex max-sm:items-center max-sm:flex-col">
                <h2 className="text-2xl font-semibold mb-2">Manage Account</h2>
                <p className="font-semibold max-sm:text-center">
                  Once you delete your account, there is no going back. Please
                  be certain.
                </p>

                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  class="px-3 py-2 text-xs font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
