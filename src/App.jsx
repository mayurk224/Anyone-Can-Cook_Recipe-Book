import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import Register from "./pages/Register";
import AllRecipes from "./pages/AllRecipes";
import RecipeDetails from "./pages/RecipeDetails";
import AddRecipe from "./pages/AddRecipe";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/aboutUs" element={<AboutUs />} />
        <Route path="/contactUs" element={<ContactUs />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/addRecipe" element={<AddRecipe />} />
        <Route path="/editRecipe/:id" element={<ContactUs />} />
        <Route path="/recipes" element={<AllRecipes />} />
        <Route path="/recipes/:id" element={<RecipeDetails />} />
        <Route path="/recipes/meal-type/:type" element={<AllRecipes />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
