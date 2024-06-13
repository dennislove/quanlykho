import React, { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { routes } from "./routes";
import DefautComponent from "./components/DefautComponent/DefautComponent.jsx";
import { AuthContextProvider } from "./context/AuthContext";
import {
  getDatabase,
  ref,
  onValue,
  get,
  orderByChild,
  equalTo,
  set,
  push,
  serverTimestamp,
} from "firebase/database";
import {
  getAuth,
  GoogleAuthProvider,
  TwitterAuthProvider,
} from "firebase/auth";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { initializeApp } from "firebase/app";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAFz-_2pLc7DwYrivmRPo3NSdAH6LhbCGg",
  authDomain: "quanlykho-bigc.firebaseapp.com",
  databaseURL:
    "https://quanlykho-bigc-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "quanlykho-bigc",
  storageBucket: "quanlykho-bigc.appspot.com",
  messagingSenderId: "628510293537",
  appId: "1:628510293537:web:c03cf2804c2910e8dcad60",
  measurementId: "G-TKSBVDBNKD",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const twitterProvider = new TwitterAuthProvider();

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          {routes.map((route) => {
            const Page = route.element;
            const Layout = route.isShowHeader ? DefautComponent : Fragment;

            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <Layout>
                    <Page />
                  </Layout>
                }
              />
            );
          })}
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}

// Export Firebase utilities
export {
  database,
  storage,
  ref,
  onValue,
  set,
  get,
  push,
  storageRef,
  orderByChild,
  equalTo,
  uploadBytes,
  getDownloadURL,
  serverTimestamp,
  auth,
  googleProvider,
  twitterProvider,
};

export default App;
