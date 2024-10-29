# **Anyone Can Cook** 🍳

**Anyone Can Cook** is a recipe-sharing platform built with **Vite React** on the frontend and **Firebase** for backend services. This platform allows users to explore, upload, and manage their recipes while providing several additional features like authentication, favorites, Google OAuth, and the ability to download recipes as PDFs.

---

## **Features** ✨

1. **User Authentication**  
   - Users can **register** and **log in** using email and password.  
   - **Google OAuth** is available for seamless login and registration.  

2. **Manage Recipes**  
   - Users can **upload** new recipes and **edit or delete** their own recipes.  
   - Mark recipes as **favorites** for easy access.  
   - **Download recipes as PDFs** for offline access.  

3. **Explore Pre-Built Recipes**  
   - View and try pre-built recipes fetched from the **DummyJSON API**.

4. **User Account Management**  
   - Users can **delete their profile** along with their uploaded recipes.  

---

## **Tech Stack** 🛠️

### **Frontend:**  
- **Vite** (for fast React development)  
- **React** (JavaScript library for building UI)  
- **TailwindCSS** / **Flowbite** (for styling)

### **Backend:**  
- **Firebase Authentication** (for secure login, registration, and Google OAuth)  
- **Firebase Firestore** (for storing user data and recipes)  
- **Firebase Storage** (for handling recipe images)  

### **APIs:**  
- **DummyJSON API** (for pre-built recipes)  

---

## **How to Run the Project Locally** 🚀

### **Prerequisites:**
- Node.js installed
- Firebase project configured
- Vite project setup locally

### **Steps:**

1. **Clone the Repository:**  
   ```bash
   git clone https://github.com/mayurk224/Anyone-Can-Cook_Recipe-Book
   cd anyone-can-cook
   ```

2. **Install Dependencies:**  
   ```bash
   npm install
   ```

3. **Configure Firebase:**  
   - Create a Firebase project and enable **Authentication (Email/Password & Google)**.  
   - Enable **Firestore** and **Storage**.  
   - Copy the Firebase config and add it to your React project in a `.env` file:

     ```
     VITE_FIREBASE_API_KEY=<your-api-key>
     VITE_FIREBASE_AUTH_DOMAIN=<your-auth-domain>
     VITE_FIREBASE_PROJECT_ID=<your-project-id>
     VITE_FIREBASE_STORAGE_BUCKET=<your-storage-bucket>
     VITE_FIREBASE_MESSAGING_SENDER_ID=<your-messaging-sender-id>
     VITE_FIREBASE_APP_ID=<your-app-id>
     ```

4. **Run the Project:**  
   ```bash
   npm run dev
   ```

5. **Access the Application:**  
   Open your browser and navigate to:  
   `http://localhost:5173`

---

## **Usage Instructions** 📝

### **1. Register and Login**  
- Users can **register** with their email and password or **login using Google** OAuth.

### **2. Explore Pre-Built Recipes**  
- Visit the **Recipes** section to browse **pre-built recipes** from the DummyJSON API.

### **3. Upload and Manage Recipes**  
- Users can **upload recipes** with details like ingredients, instructions, and images.  
- Users can **edit or delete** their own uploaded recipes.

### **4. Favorite Recipes**  
- Mark your favorite recipes for quick access on your profile page.

### **5. Download Recipes**  
- Users can **download any recipe as a PDF** to access it offline.

### **6. Profile Management**  
- Users can **delete their profile** along with all their uploaded recipes.

---

## **API Endpoints Used** 🔗

- **DummyJSON API:**  
  `https://dummyjson.com/recipes`  

---

## **Screenshots** 📸  
Add relevant screenshots here (e.g., Home page, Recipe upload, Profile page, Google login).

---

## **License** 📝  
This project is licensed under the **MIT License**.

---

## **Contributors** 🤝  
- **Mayur Kamble** – Project Owner & Developer  

---

## **Feedback & Contact** 📧  
If you have any issues, feedback, or suggestions, feel free to reach out at **mayurkamble0250@gmail.com**.

---

## **Acknowledgements** 💡  
- **Vite** for fast React development  
- **Firebase** for backend services  
- **DummyJSON API** for pre-built recipes  
- **Flowbite** for UI components  

---

Enjoy cooking and sharing your favorite recipes with **Anyone Can Cook**! 🍲
