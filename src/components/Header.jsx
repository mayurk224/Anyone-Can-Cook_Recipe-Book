import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Logo from "../assets/HeaderLogo.png";
import { useAuth } from "../context/AuthContext";

const Header = ({ onSearch }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Get the current route
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState(""); // Track search input

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleAddRecipe = () => {
    navigate("/addRecipe");
  };

  const handleMyRecipe = () => {
    navigate("/my-recipe");
  };

  // Check if current route matches recipes page or related routes
  const isRecipesRoute =
    location.pathname.startsWith("/recipes") ||
    location.search.includes("mealType");

  // Check if the current route is /addRecipe to hide the menu and search bar
  const isAddRecipeRoute = location.pathname === "/addRecipe";

  // Check if the current route is /profile to hide profile dropdown and search bar
  const isProfileRoute = location.pathname === "/profile";

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value); // Pass the search query to parent component for filtering
  };

  return (
    <header className="mb-[85px]">
      <nav className="bg-[#fdf1f1] dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div
          className={`max-w-screen-xl flex flex-wrap items-center ${
            isProfileRoute ? "justify-center" : "justify-between"
          } mx-auto p-4`}
        >
          <a
            href="/"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img src={Logo} className="h-12" alt="Logo" />
          </a>
          <div className="flex md:order-2">
            {currentUser && !isProfileRoute ? ( // Hide dropdown in profile route
              <div className="flex items-center space-x-3 md:space-x-0 rtl:space-x-reverse md:ml-3">
                <button
                  type="button"
                  className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                  aria-expanded={isDropdownOpen ? "true" : "false"}
                  onClick={toggleDropdown}
                >
                  <span className="sr-only">Open user menu</span>
                  <img
                    className="w-8 h-8 rounded-full"
                    src="/docs/images/people/profile-picture-3.jpg"
                    alt="user photo"
                  />
                </button>

                {/* Dropdown menu */}
                <div
                  ref={dropdownRef}
                  className={`${
                    isDropdownOpen ? "block" : "hidden"
                  } absolute top-14 right-16 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600`}
                >
                  <div className="px-4 py-3">
                    <span className="block text-sm text-gray-900 dark:text-white">
                      {currentUser.displayName}
                    </span>
                    <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                      {currentUser.email}
                    </span>
                  </div>
                  <ul className="py-2">
                    <li>
                      <a
                        onClick={handleProfile}
                        className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Profile
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={handleAddRecipe}
                        className="block px-4 py-2 text-sm cursor-pointer text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Add Recipe
                      </a>
                    </li>
                    <li>
                      <a
                        onClick={handleLogout}
                        className="block px-4 py-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Sign out
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            ) : !currentUser ? (
              <button
                type="button"
                onClick={handleLogin}
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 max-[450px]:mr-3 md:ml-3"
              >
                Login
              </button>
            ) : null}
          </div>

          <div className="flex items-center justify-between w-full md:w-auto md:order-1">
            {!isAddRecipeRoute && isRecipesRoute && !isProfileRoute ? (
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search for recipes"
                className="p-2 border border-gray-300 rounded-lg w-full md:w-auto"
              />
            ) : !isAddRecipeRoute && !isProfileRoute ? (
              <ul className="flex flex-col p-4 mt-4 font-medium border border-gray-100 rounded-lg bg-[#fdf1f1] md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-[#fdf1f1] dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
                <li>
                  <a
                    href="/"
                    className="block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="/categories"
                    className="block py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:text-blue-700 dark:text-white"
                  >
                    Category
                  </a>
                </li>
                <li>
                  <Link
                    to="/recipes"
                    className="block py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:text-blue-700 dark:text-white"
                  >
                    All Recipes
                  </Link>
                </li>
                <li>
                  <Link
                    to="/aboutUs"
                    className="block py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:text-blue-700 dark:text-white"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/contactUs"
                    className="block py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:text-blue-700 dark:text-white"
                  >
                    Contact Us
                  </Link>
                </li>
              </ul>
            ) : null}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
