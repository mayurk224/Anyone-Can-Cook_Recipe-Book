import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  FaClock,
  FaUtensils,
  FaFire,
  FaGlobeAmericas,
  FaTags,
} from "react-icons/fa";
import { MdRestaurantMenu } from "react-icons/md";
import { db } from "../firebase/firebaseConfig"; // Assuming Firebase setup is in place
import { doc, getDoc } from "firebase/firestore";

const RecipeDetails = () => {
  const { id } = useParams(); // Get recipe ID from the URL
  const [recipe, setRecipe] = useState(null); // State to store the recipe details
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state
  const [uploadedBy, setUploadedBy] = useState(""); // Store uploader display name

  // Fetch recipe details and uploader's displayName
  useEffect(() => {
    const fetchRecipeAndUser = async () => {
      try {
        // Fetch recipe from Firestore
        const recipeDoc = await getDoc(doc(db, "recipes", id));

        if (recipeDoc.exists()) {
          const fetchedRecipe = recipeDoc.data();

          // Fetch uploader's displayName using userId
          if (fetchedRecipe.userId) {
            const userDoc = await getDoc(
              doc(db, "users", fetchedRecipe.userId)
            );
            if (userDoc.exists()) {
              setUploadedBy(userDoc.data().displayName);
            }
          }

          setRecipe(fetchedRecipe); // Set recipe data
        } else {
          // If recipe is not in Firestore, try fetching from the API
          const response = await fetch(`https://dummyjson.com/recipes/${id}`);
          if (!response.ok) {
            throw new Error("Failed to fetch recipe");
          }
          const data = await response.json();
          setRecipe(data); // Set API recipe data
        }
      } catch (err) {
        setError(err.message); // Handle errors
      } finally {
        setLoading(false); // Stop loading spinner
      }
    };

    fetchRecipeAndUser();
  }, [id]);

  if (loading) {
    return <p>Loading recipe...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!recipe) {
    return <p>Recipe not found.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <img
        src={recipe.image}
        alt={recipe.name}
        className="w-full h-96 object-cover rounded-lg mb-6"
      />
      <h1 className="text-4xl font-bold mb-4 text-gray-800">{recipe.name}</h1>

      {/* Conditionally display "Uploaded by" if the user was found */}
      {uploadedBy && (
        <p className="text-gray-700 mb-4">
          <strong>Uploaded by:</strong> {uploadedBy}
        </p>
      )}

      <div className="flex flex-wrap gap-4 mb-6">
        <InfoItem
          icon={<FaClock />}
          label="Prep Time"
          value={`${recipe.prepTimeMinutes} mins`}
        />
        <InfoItem
          icon={<FaClock />}
          label="Cook Time"
          value={`${recipe.cookTimeMinutes} mins`}
        />
        <InfoItem
          icon={<FaUtensils />}
          label="Servings"
          value={recipe.servings}
        />
        <InfoItem
          icon={<FaFire />}
          label="Difficulty"
          value={recipe.difficulty}
        />
        <InfoItem
          icon={<FaGlobeAmericas />}
          label="Cuisine"
          value={recipe.cuisine}
        />
        <InfoItem
          icon={<MdRestaurantMenu />}
          label="Meal Type"
          value={
            Array.isArray(recipe.mealType)
              ? recipe.mealType.join(", ")
              : recipe.mealType
          }
        />
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">
          Ingredients
        </h2>
        <ul className="list-disc pl-6">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index} className="text-gray-700 mb-1">
              {ingredient}
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">
          Instructions
        </h2>
        <ol className="list-decimal pl-6">
          {recipe.instructions.map((instruction, index) => (
            <li key={index} className="text-gray-700 mb-2">
              {instruction}
            </li>
          ))}
        </ol>
      </div>

      <div className="flex items-center mb-4">
        <FaTags className="text-gray-600 mr-2" />
        <div className="flex flex-wrap gap-2">
          {recipe.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="text-gray-700">
        <strong>Calories per serving:</strong> {recipe.caloriesPerServing}
      </div>
    </div>
  );
};

const InfoItem = ({ icon, label, value }) => (
  <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg">
    <span className="text-gray-600 mr-2">{icon}</span>
    <span className="text-sm">
      <strong>{label}:</strong> {value}
    </span>
  </div>
);

export default RecipeDetails;
