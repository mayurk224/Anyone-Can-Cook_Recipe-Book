import { createContext, useContext, useState, useEffect } from "react";
import { auth, db, storage } from "../firebase/firebaseConfig"; // Importing db to interact with Firestore
import {
  deleteUser,
  signOut,
  EmailAuthProvider,
  GoogleAuthProvider,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
} from "firebase/auth";
import {
  collection,
  deleteDoc,
  getDocs,
  query,
  where,
  doc,
  writeBatch,
  arrayRemove,
  updateDoc,
  getDoc,
} from "firebase/firestore"; // Added arrayRemove and updateDoc
import { ref, listAll, deleteObject } from "firebase/storage";

// Create AuthContext
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state

  // Load user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Save user to state and localStorage
        const userInfo = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        };
        setCurrentUser(userInfo);
        localStorage.setItem("currentUser", JSON.stringify(userInfo));
      } else {
        // Clear state and localStorage if no user
        setCurrentUser(null);
        localStorage.removeItem("currentUser");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      // Clear localStorage on logout
      localStorage.removeItem("currentUser");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const deleteAccount = async (password = null) => {
    const user = auth.currentUser;

    if (!user) return; // Return early if no user is logged in

    try {
      // Check if the user signed in with Google or email/password
      if (
        user.providerData.some(
          (provider) => provider.providerId === "google.com"
        )
      ) {
        // Reauthenticate using Google provider
        const googleProvider = new GoogleAuthProvider();
        await reauthenticateWithPopup(user, googleProvider);
      } else if (password) {
        // Reauthenticate using email and password
        const credential = EmailAuthProvider.credential(user.email, password);
        await reauthenticateWithCredential(user, credential);
      } else {
        alert("Password is required for reauthentication.");
        return;
      }

      // Proceed with deleting user data and account
      await deleteUserRecipes(user.uid); // Delete user's recipes
      await deleteUserFromCollection(user.uid); // Remove user from 'users' collection
      await deleteUser(user); // Delete the user from Firebase Auth

      // Clear state and localStorage on account deletion
      setCurrentUser(null);
      localStorage.removeItem("currentUser");

      alert("Account successfully deleted.");
    } catch (error) {
      console.error("Error deleting user account:", error);
      alert("Failed to delete account. Please try again.");
      throw error; // Rethrow the error to be handled in the calling component
    }
  };

  // Function to delete the user's recipes and remove references from other users' documents
  const deleteUserRecipes = async (userId) => {
    try {
      const userRecipesRef = collection(db, "recipes");
      const q = query(userRecipesRef, where("userId", "==", userId));

      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db); // Correct way to initialize batch

      // For each recipe created by the user
      for (const recipeDoc of querySnapshot.docs) {
        const recipeId = recipeDoc.id;

        // Delete the recipe document from the "recipes" collection
        batch.delete(doc(db, "recipes", recipeId));

        // Delete the recipe's images from Firebase Storage
        const storageRef = ref(storage, `recipesImage/${recipeId}`); // Reference to the folder

        // List all files in the folder
        const listResponse = await listAll(storageRef);

        // Delete each file in the folder
        const deletePromises = listResponse.items.map((fileRef) => {
          return deleteObject(fileRef); // Delete each file
        });

        // Wait for all file deletions to complete
        await Promise.all(deletePromises);

        // Remove recipe ID from other users' "favorites" and "recipes" fields
        const usersCollection = collection(db, "users");
        const userSnapshot = await getDocs(usersCollection);

        userSnapshot.forEach((userDoc) => {
          const userData = userDoc.data();
          const userRef = doc(db, "users", userDoc.id);

          const updates = {};

          // Remove recipeId from 'favorites' field if it exists
          if (userData.favorites?.includes(recipeId)) {
            updates.favorites = arrayRemove(recipeId);
          }

          // Remove recipeId from 'recipes' field if it exists
          if (userData.recipes?.includes(recipeId)) {
            updates.recipes = arrayRemove(recipeId);
          }

          // If there are updates, apply them
          if (Object.keys(updates).length > 0) {
            batch.update(userRef, updates); // Add update to batch
          }
        });
      }

      // Commit the batch operation to delete recipes and update users
      await batch.commit();
    } catch (error) {
      console.error("Error deleting user recipes:", error);
      throw error; // Rethrow the error to handle it in the calling function
    }
  };

  // Function to delete a specific user's document from Firestore
  const deleteUserFromCollection = async (userId) => {
    try {
      const userDocRef = doc(db, "users", userId); // Reference to the specific user's document
      await deleteDoc(userDocRef);
    } catch (error) {
      console.error("Error deleting user from Firestore:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ currentUser, logout, deleteAccount, loading }}
    >
      {!loading && children} {/* This renders the wrapped components */}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
