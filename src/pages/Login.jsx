import React, { useState } from "react";
import { login } from "../firebase/auth"; // Importing login function from auth.js
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/HeaderLogo.png";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig"; // Ensure Firebase config imports are correct

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function to handle login with email and password
  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setError("");
  //   setLoading(true);

  //   try {
  //     await login(email, password);
  //     navigate("/"); // Redirect to home page on successful login
  //   } catch (error) {
  //     setError("Failed to login. Please check your credentials.");
  //     console.error("Login Error:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // Function to handle Google Sign-In
  // const handleGoogleSignIn = async () => {
  //   const provider = new GoogleAuthProvider();

  //   try {
  //     const result = await signInWithPopup(auth, provider);
  //     const user = result.user;

  //     if (user) {
  //       // Check if the user exists in Firestore
  //       const userDocRef = doc(db, "users", user.uid);
  //       const userDoc = await getDoc(userDocRef);

  //       if (userDoc.exists()) {
  //         console.log("User found in Firestore:", userDoc.data());
  //       } else {
  //         alert("User not found");
  //       }

  //       navigate("/"); // Redirect to home page
  //     }
  //   } catch (error) {
  //     console.error("Google sign-in error:", error);
  //     alert(`Error: ${error.message}`);
  //   }
  // };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("first login successful");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className="flex items-center justify-center w-full"
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      <section className="bg-[#fdf1f1] dark:bg-gray-900">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
          <Link
            to="/"
            className="flex items-center text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <img className="h-16 rounded-lg" src={Logo} alt="logo" />
          </Link>
          <div className="w-96 bg-[#fdf1f1] rounded-lg md:mt-0 sm:max-w-md xl:p-0">
            <div className="p-6">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white mb-3">
                Welcome Back 👋
              </h1>
              <p className="text-sm">
                Cooking is where creativity meets nourishment, turning simple
                ingredients into memorable moments.
              </p>
              <form className="space-y-3 mt-4" onSubmit={handleLogin}>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="name@company.com"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    placeholder="••••••••"
                    required
                  />
                </div>
                {error && <p className="text-red-600 text-sm">{error}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700"
                >
                  {loading ? "Logging in..." : "Login"}
                </button>
                <div className="flex items-center justify-center">
                  <hr className="w-64 h-px my-3 bg-gray-400 border-0 dark:bg-gray-700" />
                  <span className="absolute px-3 font-medium text-gray-900 bg-[#fdf1f1] dark:text-white dark:bg-gray-900">
                    or
                  </span>
                </div>
                {/* <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 inline-flex items-center"
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 19"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.842 18.083a8.8 8.8 0 0 1-8.65-8.948 8.841 8.841 0 0 1 8.8-8.652h.153a8.464 8.464 0 0 1 5.7 2.257l-2.193 2.038A5.27 5.27 0 0 0 9.09 3.4a5.882 5.882 0 0 0-.2 11.76h.124a5.091 5.091 0 0 0 5.248-4.057L14.3 11H9V8h8.34c.066.543.095 1.09.088 1.636-.086 5.053-3.463 8.449-8.4 8.449l-.186-.002Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Sign in with Google
                </button> */}
              </form>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400 mt-3">
                Don’t have an account yet?{" "}
                <Link
                  to="/register"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Login;
