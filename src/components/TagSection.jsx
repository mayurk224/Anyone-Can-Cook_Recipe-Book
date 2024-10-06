import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // To navigate on tag click

const TagSection = () => {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAllTags, setShowAllTags] = useState(false); // Track whether to show all tags or not
  const navigate = useNavigate(); // For navigation

  // Function to fetch recipes and extract unique tags
  const fetchUniqueTags = async () => {
    try {
      const response = await fetch("https://dummyjson.com/recipes?limit=0");
      const data = await response.json();

      // Extract all tags from recipes and flatten them into a single array
      const allTags = data.recipes.flatMap((recipe) => recipe.tags || []);

      // Get unique tags using Set
      const uniqueTags = [...new Set(allTags)];

      setTags(uniqueTags);
    } catch (error) {
      console.error("Error fetching recipes or tags:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniqueTags();
  }, []);

  // Handle tag click and navigate to AllRecipes page with the selected tag
  const handleTagClick = (tag) => {
    navigate(`/recipes?tag=${encodeURIComponent(tag)}`);
  };

  // Toggle view between showing all tags and limited tags
  const toggleShowAllTags = () => {
    setShowAllTags(!showAllTags);
  };

  if (loading) {
    return <p>Loading tags...</p>;
  }

  // Limit to show only 20 tags initially
  const displayedTags = showAllTags ? tags : tags.slice(0, 20);

  return (
    <div className="tag-section">
      <h2 className="text-lg font-bold mb-4">Tags</h2>
      <div className="flex flex-wrap gap-2">
        {displayedTags.map((tag, index) => (
          <span
            key={index}
            className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm cursor-pointer"
            onClick={() => handleTagClick(tag)} // Trigger navigation on tag click
          >
            {tag}
          </span>
        ))}
      </div>

      {/* "View More" / "View Less" button */}
      {tags.length > 20 && (
        <div className="mt-4">
          <button
            onClick={toggleShowAllTags}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded"
          >
            {showAllTags ? "View Less" : "View More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default TagSection;
