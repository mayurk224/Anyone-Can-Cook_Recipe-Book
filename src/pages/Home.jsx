import React from "react";
import Header from "../components/Header";
import Category from "../components/Category";
import FeaturedRecipe from "../components/FeaturedRecipes";
import TipsSection from "../components/TipsSection";
import SocialMediaPost from "../components/SocialMediaPost";
import Footer from "../components/Footer";
import ScrollToTopButton from "../components/ScrollToTopButton";
import TagSection from "../components/TagSection";
import HeroSection from "../components/HeroSection";

const Home = () => {
  return (
    <div className="overflow-hidden mx-4 sm:mx-6 md:mx-12 lg:mx-24">
      <Header />
      <HeroSection />
      <ScrollToTopButton />
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
