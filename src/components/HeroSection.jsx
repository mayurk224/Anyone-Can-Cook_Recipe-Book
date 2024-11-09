import React from "react";

const HeroSection = () => {
  return (
    <div
      className="rounded-3xl"
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/4551832/pexels-photo-4551832.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "80vh",
        width: "100%",
      }}
    >
      <div className="w-full sm:w-3/4 lg:w-1/2 bg-gradient-to-r from-gray-300 to-transparent p-6 sm:p-8 md:p-10 h-full flex flex-col justify-center rounded-3xl space-y-4 min-[425px]:justify-center">
        <h1 className="text-5xl sm:text-6xl font-semibold mb-3 leading-normal">
          Discover the secrets of the world's best recipes
        </h1>
        <p className="text-lg sm:text-xl leading-relaxed">
          Experience the magic of cooking with our recipes, tips, and
          inspiration.
        </p>
        <a href="#category" className="px-8 py-3 rounded-full text-lg font-semibold w-fit text-white bg-black hover:bg-gray-800">
          Get Started
        </a>
      </div>
    </div>
  );
};

export default HeroSection;
