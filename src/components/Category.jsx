import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate to handle navigation

const Category = () => {
  const [mealTypes, setMealTypes] = useState([]);
  const [mealTypeImages, setMealTypeImages] = useState({});
  const navigate = useNavigate(); // Hook to navigate programmatically

  useEffect(() => {
    const fetchMealTypes = async () => {
      try {
        const response = await fetch("https://dummyjson.com/recipes?limit=0");
        const data = await response.json();

        // Extract all mealTypes and their corresponding recipes
        const mealTypeMap = {};

        data.recipes.forEach((recipe) => {
          recipe.mealType.forEach((mealType) => {
            if (!mealTypeMap[mealType]) {
              mealTypeMap[mealType] = recipe.image; // Assign the first recipe image for each mealType
            }
          });
        });

        // Extract unique mealTypes and their images
        setMealTypes(Object.keys(mealTypeMap));
        setMealTypeImages(mealTypeMap);
      } catch (error) {
        console.error("Error fetching meal types:", error);
      }
    };

    fetchMealTypes();
  }, []);

  const handleCategoryClick = (mealType) => {
    navigate(`/recipes?mealType=${mealType}`); // Navigate to AllRecipes page with the mealType query param
  };

  return (
    <div className="mt-8">
      {/* Title */}
      <div className="flex items-center justify-center">
        <h1 className="text-3xl md:text-4xl cursor-default font-semibold text-center p-3">
          Categories
        </h1>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-6 mt-5 justify-center">
        {mealTypes.map((mealType, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-5 sm:p-8 gap-3 shadow-md rounded-lg 
        hover:scale-105 transition-all ease-in-out cursor-pointer
        w-28 sm:w-32 md:w-40 lg:w-48" // Adjust width based on screen size
            onClick={() => handleCategoryClick(mealType)} // Navigate on click
          >
            <div className="">
              <img
                src={mealTypeImages[mealType]} // Use the image corresponding to the mealType
                alt={mealType}
                className="h-20 w-20 sm:h-24 sm:w-24 md:h-28 md:w-28 lg:h-32 lg:w-32 rounded-full object-cover"
              />
            </div>
            <div className="">
              <h3 className="text-sm sm:text-base md:text-lg font-semibold">
                {mealType}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
