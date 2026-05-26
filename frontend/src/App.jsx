import { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import { useDispatch, useSelector } from "react-redux";
import getCurrentUser from "./hooks/getCurrentUser";
import getSuggestedUser from "./hooks/getSuggestedUser";
import Profile from "./pages/Profile";
import { useEffect } from "react";
import EditProfile from "./pages/EditProfile";
import Upload from "./pages/Upload";
import getAllPost from "./hooks/getAllPost";
import Reels from "./pages/Reels";
import getAllReels from "./hooks/getAllReels";
import Story from "./pages/Story";
import getAllStories from "./hooks/getAllStories";
import Messages from "./pages/Messages";
import MessageArea from "./pages/MessageArea";
import {io} from "socket.io-client"
import { setOnlineUsers, setSocket } from "./redux/socketSlice";
import getfollowingList from "./hooks/getFollowingList";
import getPreviousChatUsers from "./hooks/getPreviousChatUsers";
import Search from "./pages/Search";
import getAllNotifications from "./hooks/getAllNotifications";


export const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:8050";

 function App() {
    getCurrentUser()
    getSuggestedUser()
    getAllPost()
    getAllReels()
    getAllStories()
    getfollowingList()
    getPreviousChatUsers()
    getAllNotifications()
const {userData}=useSelector(state=>state.user)
const {socket}=useSelector(state=>state.socket)
const dispatch=useDispatch()

const [isInitializing, setIsInitializing] = useState(true);
useEffect(() => {
const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 500); 

    return () => clearTimeout(timer);
  }, []);


  useEffect(()=>{
    
    if(userData){
      const socketIo=io(backendUrl,{
        query:{
          userId:userData._id
        },
      })
      dispatch(setSocket(socketIo))
      socketIo.on('getOnlineUsers',(users)=>{
         dispatch(setOnlineUsers(users))
      })
      return ()=>socketIo.close()
    }else{
      if(socket){
        socket.close()
        dispatch(setSocket(null))
      }
    }
  },[userData])

  
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
      <Route path="/upload" element={userData?<Upload/>:<Navigate to={"/signin"}/>} />
      <Route path="/reels" element={userData?<Reels/>:<Navigate to={"/signin"}/>} />
      <Route path="/story/:userName" element={userData?<Story/>:<Navigate to={"/signin"}/>} />
      <Route path="/messages" element={userData?<Messages/>:<Navigate to={"/signin"}/>} />
      <Route path="/messagearea" element={userData?<MessageArea/>:<Navigate to={"/signin"}/>} />
      <Route path="/search" element={userData?<Search/>:<Navigate to={"/signin"}/>} />
    </Routes>
  );
}

export default App;