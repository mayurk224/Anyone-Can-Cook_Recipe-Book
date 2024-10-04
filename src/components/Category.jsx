import React, { useEffect, useState } from "react";

const Category = () => {
  const [mealTypes, setMealTypes] = useState([]);
  const [mealTypeImages, setMealTypeImages] = useState({});

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
  return (
    <div className="mt-8">
      <div className="flex items-center">
        <h1 className="text-4xl cursor-default font-semibold text-center p-3">
          Categories
        </h1>
      </div>
      <div className="flex flex-wrap categoryGroup gap-10 mt-5 mx-auto">
        {mealTypes.map((mealType, index) => (
          <div
            key={index}
            className="flex flex-col items-center p-8 gap-3 shadow-md rounded-lg hover:scale-105 transition-all ease-in-out cursor-pointer"
          >
            <div className="">
              <img
                src={mealTypeImages[mealType]} // Use the image corresponding to the mealType
                alt={mealType}
                className="h-24 object-cover w-24 rounded-full"
              />
            </div>
            <div className="">
              <h3 className="text-base font-semibold">{mealType}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
