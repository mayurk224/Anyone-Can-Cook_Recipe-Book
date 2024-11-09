// Register.jsx
import React, { useState } from "react";
import { register } from "../firebase/auth"; // Import the register function from auth.js
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/HeaderLogo.png";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/firebaseConfig";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState(""); // New displayName
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // const handleRegister = async (e) => {

  //   e.preventDefault();
  //   setError(""); // Clear any previous errors

  //   if (password !== confirmPassword) {
  //     setError("Passwords do not match.");
  //     return;
  //   }

  //   setLoading(true); // Set loading state

  //   try {
  //     await register(email, password, displayName); // Pass displayName to the register function
  //     navigate("/"); // Redirect to home page after successful registration
  //   } catch (error) {
  //     setError("Failed to create account. Please try again.");
  //     console.error("Registration Error:", error);
  //   } finally {
  //     setLoading(false); // Stop loading
  //   }
  // };

  // const handleGoogleSignUp = async () => {
  //   const provider = new GoogleAuthProvider();
  //   setLoading(true); // Start loading spinner

  //   try {
  //     const result = await signInWithPopup(auth, provider); // Google sign-in popup
  //     const user = result.user; // Extract user data

  //     const userRef = doc(db, "users", user.uid); // Firestore reference

  //     // Check if user already exists
  //     const userDoc = await getDoc(userRef);
  //     if (!userDoc.exists()) {
  //       // Save new user to Firestore
  //       await setDoc(userRef, {
  //         displayName: user.displayName,
  //         imageUrl: user.photoURL,
  //         email: user.email,
  //         createdAt: new Date().toISOString(),

  //       });

  //       alert(`Welcome, ${user.displayName}!`);
  //       navigate("/");
  //     } else {
  //       console.log("User already exists:", user.displayName);
  //       alert(`Welcome back, ${user.displayName}!`);
  //     }
  //   } catch (error) {
  //     console.error("Google Sign-Up Error:", error);
  //     alert(`Error: ${error.message}`);
  //   } finally {
  //     setLoading(false); // Stop loading spinner
  //   }
  // };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      console.error("Passwords do not match");
      return;
    }

    try {
      // Register user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update the user's profile with the displayName
      await updateProfile(user, {
        displayName: displayName,
      });

      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          displayName: user.displayName,
          createdAt: new Date().toISOString(),
        });
      }

      alert("Updated");
    } catch (error) {
      console.error("Registration Error:", error);
    }
  };

  return (
    <div
      class="bg-gray-50 dark:bg-gray-900 flex items-center justify-center"
      style={{
        backgroundImage: `url('https://images.pexels.com/photos/8165345/pexels-photo-8165345.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        width: "100%",
      }}
    >
      <section class=" dark:bg-gray-900 w-fit rounded-3xl bg-[#fdf1f1]">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto lg:py-0">
          <a
            href="/"
            class="flex items-center text-2xl font-semibold text-gray-900 dark:text-white"
          >
            <img class="h-16 rounded-lg" src={Logo} alt="logo" />
          </a>
          <div class="w-96 bg-[#fdf1f1] rounded-lg md:mt-0 sm:max-w-md xl:p-0">
            <div class="p-6">
              <form class="space-y-3 mt-4" onSubmit={handleRegister}>
                <div>
                  <label
                    for="displayName"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Username
                  </label>
                  <input
                    type="name"
                    name="displayName"
                    id="displayName"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="Mayur"
                    required=""
                  />
                </div>
                <div>
                  <label
                    for="email"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@company.com"
                    required=""
                  />
                </div>
                <div>
                  <label
                    for="password"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required=""
                  />
                </div>
                <div>
                  <label
                    for="confirmPassword"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Confirm password
                  </label>
                  <input
                    type="confirmPassword"
                    name="confirmPassword"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required=""
                  />
                </div>
                <div class="flex items-start">
                  <div class="flex items-center h-5">
                    <input
                      id="terms"
                      aria-describedby="terms"
                      type="checkbox"
                      class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                      required=""
                    />
                  </div>
                  <div class="ml-3 text-sm">
                    <label
                      for="terms"
                      class="font-light text-gray-500 dark:text-gray-300"
                    >
                      I accept the{" "}
                      <a
                        class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                        href="#"
                      >
                        Terms and Conditions
                      </a>
                    </label>
                  </div>
                </div>
                <button
                  type="submit"
                  class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                >
                  {loading ? "Creating Account..." : "Register"}
                </button>
                <div class="flex items-center justify-center">
                  <hr class="w-64 h-px my-3 bg-gray-400 border-0 dark:bg-gray-700" />
                  <span class="absolute px-3 font-medium text-gray-900 bg-[#fdf1f1] dark:text-white dark:bg-gray-900">
                    or
                  </span>
                </div>
                <div className="flex justify-center">
                  {/* <button
                    type="button"
                    onClick={handleGoogleSignUp}
                    className="text-white bg-[#4285F4] hover:bg-[#4285F4]/90 focus:ring-4 focus:outline-none focus:ring-[#4285F4]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:focus:ring-[#4285F4]/55 me-2 mb-2"
                    disabled={loading} // Disable button during loading
                  >
                    {loading ? (
                      <span>Signing Up...</span> // Display loading text
                    ) : (
                      <>
                        <svg
                          className="w-4 h-4 me-2"
                          aria-hidden="true"
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
                        Sign Up with Google
                      </>
                    )}
                  </button> */}
                </div>
              </form>
              <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  class="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
