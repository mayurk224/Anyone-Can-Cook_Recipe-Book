import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { db, storage } from "../firebase/firebaseConfig"; // Import Firebase config
import {
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  serverTimestamp,
  addDoc,
  collection,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import Header from "../components/Header";
import DynamicBreadcrumb from "../components/DynamicBreadcrumb";

const AddRecipe = () => {
  const { currentUser } = useAuth(); // Get the current user from AuthContext
  const [selectedImage, setSelectedImage] = useState(null);
  const [image, setImage] = useState(null); // State to hold the selected image

  const [recipe, setRecipe] = useState({
    name: "",
    ingredients: "",
    instructions: "",
    prepTimeMinutes: "",
    cookTimeMinutes: "",
    servings: "",
    difficulty: "Easy",
    cuisine: "",
    caloriesPerServing: "",
    tags: "",
    rating: "",
    mealType: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRecipe((prev) => ({ ...prev, [name]: value }));
  };

  // Function to handle image file selection
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setSelectedImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Add the recipe (without the image) to the 'recipes' collection
      const newRecipeRef = await addDoc(collection(db, "recipes"), {
        ...recipe,
        ingredients: recipe.ingredients.split(";"),
        instructions: recipe.instructions.split(";"),
        prepTimeMinutes: parseInt(recipe.prepTimeMinutes, 10),
        cookTimeMinutes: parseInt(recipe.cookTimeMinutes, 10),
        servings: parseInt(recipe.servings, 10),
        caloriesPerServing: parseInt(recipe.caloriesPerServing, 10),
        tags: recipe.tags.split(","),
        mealType: recipe.mealType.split(","),
        rating: parseFloat(recipe.rating),
        userId: currentUser?.uid,
        createdAt: serverTimestamp(),
        image: "", // Initially empty, will be updated later with the image URL
      });

      // Step 2: Upload the image to Firebase Storage if an image is selected
      if (image) {
        const storageRef = ref(
          storage,
          `recipesImage/${newRecipeRef.id}/${image.name}`
        );
        const uploadTask = uploadBytesResumable(storageRef, image);

        // Wait for the image to upload and get the download URL
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            console.error("Error uploading image:", error);
            alert("Failed to upload image");
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            await updateDoc(newRecipeRef, { image: downloadURL });

            const userDocRef = doc(db, "users", currentUser?.uid);
            await updateDoc(userDocRef, {
              recipes: arrayUnion(newRecipeRef.id),
            });
            alert("Recipe added successfully with image!");
          }
        );
      } else {
        const userDocRef = doc(db, "users", currentUser?.uid);
        await updateDoc(userDocRef, { recipes: arrayUnion(newRecipeRef.id) });
        alert("Recipe added successfully without image.");
      }

      // Reset form fields after submission
      setRecipe({
        name: "",
        ingredients: "",
        instructions: "",
        prepTimeMinutes: "",
        cookTimeMinutes: "",
        servings: "",
        difficulty: "Easy",
        cuisine: "",
        caloriesPerServing: "",
        tags: "",
        rating: "",
        mealType: "",
      });
      setImage(null);
      setSelectedImage(null); // Clear the image preview
    } catch (error) {
      console.error("Error adding recipe:", error);
      alert("Failed to add recipe");
    }
  };

  return (
    <div>
      <Header />

      <div className="max-md:ml-5 max-md:my-5">
        <DynamicBreadcrumb />
      </div>
      <form
        className="lg:mx-20 sm:mx-10 flex max-md:flex-col max-md:gap-5"
        onSubmit={handleSubmit}
      >
        <div className="recipeGeneralInfo w-[40%] max-md:w-full">
          <h1 className="text-2xl font-semibold text-gray-500 max-md:ml-10 max-md:mb-3">
            Recipe General Information
          </h1>
          <div className="lg:p-10 sm:p-5 max-sm:mx-10 space-y-5">
            <div className="flex items-center justify-center">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-52 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
              >
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="object-cover w-full h-full rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      SVG, PNG, JPG or GIF (MAX. 800x400px)
                    </p>
                  </div>
                )}
                <input
                  id="dropzone-file"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>

            <div>
              <label
                htmlFor="recipeName"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Recipe Name
              </label>
              <input
                type="text"
                id="recipeName"
                name="name"
                value={recipe.name}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                required
              />
            </div>

            <div className="flex gap-5">
              <div className="w-full">
                <label
                  htmlFor="cuisine"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Cuisine
                </label>
                <input
                  type="text"
                  id="cuisine"
                  name="cuisine"
                  value={recipe.cuisine}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>

              <div className="w-full">
                <label
                  htmlFor="serving"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  No of Serving
                </label>
                <input
                  type="number"
                  id="serving"
                  name="servings"
                  value={recipe.servings}
                  onChange={handleChange}
                  min="0"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                />
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-full">
                <label
                  htmlFor="preptime"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Preparation Time
                </label>
                <input
                  type="number"
                  id="preptime"
                  name="prepTimeMinutes"
                  value={recipe.prepTimeMinutes}
                  onChange={handleChange}
                  min="0"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                />
              </div>

              <div className="w-full">
                <label
                  htmlFor="cookingtime"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Cooking Time
                </label>
                <input
                  type="number"
                  id="cookingtime"
                  name="cookTimeMinutes"
                  value={recipe.cookTimeMinutes}
                  onChange={handleChange}
                  min="0"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                />
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-full">
                <label
                  htmlFor="difficulty"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Select Difficulty Level
                </label>
                <select
                  id="difficulty"
                  name="difficulty"
                  value={recipe.difficulty}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  required
                >
                  <option value="">Choose Difficulty Level</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="w-full">
                <label
                  htmlFor="calperserve"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Calories Per Serving
                </label>
                <input
                  type="number"
                  id="calperserve"
                  name="caloriesPerServing"
                  value={recipe.caloriesPerServing}
                  onChange={handleChange}
                  min="0"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
            </div>

            <div className="flex gap-5">
              <div className="w-full">
                <label
                  htmlFor="rating"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Rating
                </label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  value={recipe.rating}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>

              <div className="w-full">
                <label
                  htmlFor="mealType"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Meal Type
                </label>
                <input
                  type="text"
                  id="mealType"
                  name="mealType"
                  value={recipe.mealType}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                />
              </div>
            </div>

            <div className="w-full">
              <label
                htmlFor="tag"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Tag
              </label>
              <input
                type="text"
                id="tag"
                name="tags"
                value={recipe.tags}
                onChange={handleChange}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
              />
            </div>
          </div>
        </div>
        <div className="recipeDetails w-[60%] max-md:w-full">
          <h1 className="text-2xl font-semibold text-gray-500 cursor-default max-md:ml-10 max-md:mb-3">
            Recipe Details
          </h1>
          <div className="lg:p-10 sm:p-5 max-sm:mx-10 space-y-5">
            <div>
              <label
                htmlFor="ingredients"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Your Ingredients
              </label>
              <textarea
                id="ingredients"
                name="ingredients"
                rows="10"
                value={recipe.ingredients}
                onChange={handleChange}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Write your Ingredients here..."
                required
              ></textarea>
            </div>

            <div>
              <label
                htmlFor="instructions"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Instruction
              </label>
              <textarea
                id="instructions"
                name="instructions"
                rows="10"
                value={recipe.instructions}
                onChange={handleChange}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Write your Instructions here..."
                required
              ></textarea>
            </div>

            <div className="flex justify-center items-center">
              <button
                className="mt-10 max-md:my-5 flex bg-black text-white px-5 py-2 rounded-full"
                type="submit"
              >
                <svg
                  className="w-6 h-6 text-white mr-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 5v9m-5 0H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2M8 9l4-5 4 5m1 8h.01"
                  />
                </svg>
                Publish Recipe
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddRecipe;
