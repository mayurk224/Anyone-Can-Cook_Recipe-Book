import axios from "axios";

export const fetchAllRecipes = async () => {
  try {
    const response = await axios.get("https://dummyjson.com/recipes?limit=0");
    return response.data.recipes; // Assuming 'recipes' is the array in the response
  } catch (error) {
    console.error("Error fetching recipes:", error);
    throw error;
  }
};
