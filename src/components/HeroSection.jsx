import React from "react";

const HeroSection = () => {
  return (
    <div>
      <div className="hero-section bg-cover bg-center h-screen flex flex-col justify-center items-center text-center">
        {/* Background image or video */}
        <div className="overlay bg-black bg-opacity-50 absolute inset-0 overflow-hidden">
          <img
            src="https://images.pexels.com/photos/1040685/pexels-photo-1040685.jpeg"
            alt=""
          />
        </div>

        {/* Content */}
        <div className="relative z-10 text-white space-y-4">
          <h1 className="text-5xl font-bold">
            Discover Delicious Recipes from Around the World
          </h1>
          <p className="text-lg">
            Explore thousands of easy-to-follow recipes and cook like a pro.
          </p>

          {/* Search Bar */}
          

          {/* Call to Action */}
          <div className="mt-4">
            <button className="bg-yellow-500 text-white font-semibold px-8 py-3 rounded-full hover:bg-yellow-600 transition">
              Explore Recipes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
