import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import { useSelector } from "react-redux";
import getCurrentUser from "./hooks/getCurrentUser";
import getSuggestedUser from "./hooks/getSuggestedUser";
import Profile from "./pages/Profile";
import { useEffect } from "react";
import EditProfile from "./pages/EditProfile";

export const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8050";

 function App() {
   getCurrentUser()
    getSuggestedUser()
const {userData}=useSelector(state=>state.user)

const [isInitializing, setIsInitializing] = useState(true);
useEffect(() => {
const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 500); 

    return () => clearTimeout(timer);
  }, []);

if (isInitializing && !userData) {
    return (
      <div className="h-screen bg-black flex items-center justify-center text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-white"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/signup" element={!userData?<SignUp/>:<Navigate to={"/"}/>} />
      <Route path="/signin" element={!userData?<SignIn/>:<Navigate to={"/"}/>} />
      <Route path="/" element={userData?<Home/>:<Navigate to={"/signin"}/>} />
      <Route path="/forgot-password" element={!userData?<ForgotPassword/>:<Navigate to={"/"}/>} />
      <Route path="/profile/:userName" element={userData?<Profile/>:<Navigate to={"/signin"}/>} />
      <Route path="/editprofile" element={userData?<EditProfile/>:<Navigate to={"/signin"}/>} />
    </Routes>
  );
}

export default App;
