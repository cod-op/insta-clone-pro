import React, { useEffect, useState } from 'react'
import dp from '../assets/dp.png'
import { FiPlusCircle } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { backendUrl } from '../App';
import { setStoryData } from '../redux/storySlice';

const StoryDp = ({profileImage,userName,story}) => {
   const navigate=useNavigate()
   const {userData}=useSelector(state=>state.user)
   const {storyData}=useSelector(state=>state.story)
   const dispatch = useDispatch()
   const [viewed,setViewed]=useState(false)

   useEffect(()=>{
      if(story?.viewers?.some((viewer)=>
      viewer?._id?.toString()===userData?._id?.toString())){
         setViewed(true);
      }
      else{
         setViewed(false)
      }
   },[story,userData,storyData])

   const hasValidStory = story && story._id && story._id !== "undefined";

   const handleViwewers=async()=>{
      if (!hasValidStory) return;
      
      try{
        const result = await axios.get(`${backendUrl}/api/story/view/${story._id}`,{ withCredentials: true })
        console.log("Viewer added ", result.data)
        if (result?.data?.story) {
         dispatch(setStoryData(result?.data?.story))
      }
      }catch(error){
         console.log("Error updating viewers list:", error.response?.data || error.message)
      }
   }

   const handleClick=async()=>{
      if(userName==="Your Story" && !hasValidStory){
         navigate('/upload')
      }else if(userName === "Your Story" && hasValidStory){
           await handleViwewers()
           navigate(`/story/${userData.userName}`) 
      }else{
         if (hasValidStory) {
            await handleViwewers()
            navigate(`/story/${story?.author?.userName}`)
        }
      }
   }



  return (
   <div className='flex flex-col w-[80px]'>
      <div className={`w-[80px] h-[80px] rounded-full flex justify-center items-center relative ${!story ?null:!viewed?"bg-gradient-to-b from-blue-500 to-blue-950 ":"bg-zinc-700"}`}>
        <div className='w-[70px] h-[70px] border-2 border-black rounded-full cursor-pointer overflow-hidden' onClick={handleClick}>
           <img src={profileImage||dp} alt="" className='w-full object-cover' />
            {!story && userName==="Your Story" && <div className='text-white absolute'>
              
            </div> }
             {userName==="Your Story" &&<FiPlusCircle  className='absolute bottom-[6px] right-[5px] rounded-full text-black bg-white  w-[25px] h-[25px] '/>}
        </div>
       </div>

        <div className='text-[14px] text-center truncate w-full text-white '>
           {userName}
        </div> 
   </div>
  )
}


export default StoryDp