import React from "react";
import Header from "../components/Header";
import RecipeCarousel from "../components/RecipeCarousel";
import Category from "../components/Category";

const Home = () => {
  return (
    <div>
      <Header />
      <RecipeCarousel />
      <Category />
    </div>
  );
};

export default Home;
