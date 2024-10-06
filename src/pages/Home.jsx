import React from "react";
import Header from "../components/Header";
import RecipeCarousel from "../components/RecipeCarousel";
import Category from "../components/Category";
import FeaturedRecipe from "../components/FeaturedRecipes";
import TipsSection from "../components/TipsSection";
import SocialMediaPost from "../components/SocialMediaPost";
import Footer from "../components/Footer";
import ScrollToTopButton from "../components/ScrollToTopButton";
import TagSection from "../components/TagSection";

const Home = () => {
  return (
    <div>
      <Header />
      <ScrollToTopButton />
      <RecipeCarousel />
      <Category />
      <FeaturedRecipe />
      <TipsSection />
      <TagSection />
      <SocialMediaPost />
      <Footer />
    </div>
  );
};

export default Home;
