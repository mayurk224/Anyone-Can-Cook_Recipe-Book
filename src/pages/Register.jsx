// Register.jsx
import React, { useState } from "react";
// import { register } from "../firebase/auth"; // Import the register function from auth.js
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState(""); // New displayName state
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

     const handleRegister = async (e) => {
       e.preventDefault();
      setError(""); // Clear any previous errors

      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      setLoading(true); // Set loading state

      try {
         await register(email, password, displayName); // Pass displayName to the register function
        navigate("/"); // Redirect to home page after successful registration
      } catch (error) {
        setError("Failed to create account. Please try again.");
        console.error("Registration Error:", error);
     } finally {
       setLoading(false); // Stop loading
     }
    };

  return (
    // <div className="register-container">
    //   <h2>Register</h2>
    //   {error && <p style={{ color: "red" }}>{error}</p>}
    //   <form
    //   //    onSubmit={handleRegister}
    //   >
    //     <div>
    //       <label htmlFor="displayName">Display Name</label>
    //       <input
    //         type="text"
    //         id="displayName"
    //         value={displayName}
    //         onChange={(e) => setDisplayName(e.target.value)}
    //       />
    //     </div>
    //     <div>
    //       <label htmlFor="email">Email</label>
    //       <input
    //         type="email"
    //         id="email"
    //         value={email}
    //         onChange={(e) => setEmail(e.target.value)}
    //         required
    //       />
    //     </div>
    //     <div>
    //       <label htmlFor="password">Password</label>
    //       <input
    //         type="password"
    //         id="password"
    //         value={password}
    //         onChange={(e) => setPassword(e.target.value)}
    //         required
    //       />
    //     </div>
    //     <div>
    //       <label htmlFor="confirmPassword">Confirm Password</label>
    //       <input
    //         type="password"
    //         id="confirmPassword"
    //         value={confirmPassword}
    //         onChange={(e) => setConfirmPassword(e.target.value)}
    //         required
    //       />
    //     </div>
    //     <button type="submit" disabled={loading}>
    //       {loading ? "Creating Account..." : "Register"}
    //     </button>
    //   </form>
    // </div>
    <div className="flex justify-center items-center h-screen">
      <div id="webcrumbs">
        <div className="w-[480px] min-h-[600px] bg-neutral-50 shadow-lg rounded-lg p-8">
          <h1 className="text-3xl font-title text-center mb-6">
            Create an Account
          </h1>
          <form className="space-y-6" onSubmit={handleRegister} >
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full p-3 border border-neutral-300 rounded-md focus:ring focus:ring-primary outline-none"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-neutral-300 rounded-md focus:ring focus:ring-primary outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-neutral-300 rounded-md focus:ring focus:ring-primary outline-none"
                placeholder="••••••••"
              />
            </div>

            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-medium mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border border-neutral-300 rounded-md focus:ring focus:ring-primary outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-primary text-white font-medium rounded-md hover:bg-primary-dark"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <p className="text-center text-sm mt-6">
            Already have an account?
            <Link to="/login" className="text-primary font-medium ml-1">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
