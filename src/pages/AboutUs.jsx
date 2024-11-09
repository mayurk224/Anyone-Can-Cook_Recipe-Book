import React from "react";

const AboutUs = () => {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-16 px-8">
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white mb-6">
          About Us
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Welcome to <span className="font-bold">Anyone Can Cook</span>! This is
          a community-driven platform where food enthusiasts can share and
          discover amazing recipes from around the world. Whether you're a
          beginner or a seasoned chef, you'll find something delicious to try.
        </p>
        <div className="text-left max-w-3xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Features of Our Website:
          </h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-6">
            <li>
              🔐 **User Authentication**: Secure login and registration using
              Firebase.
            </li>
            <li>
              ⭐ **Favorites**: Save your favorite recipes for easy access.
            </li>
            <li>
              📋 **Recipe Management**: Upload, edit, and delete your personal
              recipes.
            </li>
            <li>
              📄 **Download as PDF**: Save recipes offline by downloading them
              as PDF.
            </li>
            <li>
              🌍 **Pre-built Recipes**: Browse pre-built recipes fetched from
              external APIs.
            </li>
            <li>
              🔍 **Google OAuth**: Sign up and log in easily using your Google
              account.
            </li>
          </ul>

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Meet the Creator
          </h2>
          <div className="flex items-center space-x-4 mb-8">
            <img
              src="https://via.placeholder.com/100"
              alt="Owner"
              className="w-24 h-24 rounded-full border-2 border-blue-500"
            />
            <div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Mayur Dilip Kamble
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Hi, I'm Mayur, the creator of{" "}
                <span className="font-bold">Anyone Can Cook</span>. I’m a
                passionate web developer with a love for food. This project
                combines my interest in coding and culinary arts to help others
                explore and share their cooking adventures. Let's make cooking
                fun and accessible to everyone!
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
            Connect with Us
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Have any questions or feedback? Feel free to reach out. We're here
            to help!
          </p>
          <a
            href="mailto:mayurkamble0250@gmail.com"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
          >
            Contact Us
          </a>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
