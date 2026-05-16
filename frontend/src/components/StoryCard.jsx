import React, { useEffect, useState } from "react";
import dp from '../assets/dp.png'
import { useSelector } from "react-redux";
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";

const StoryCard = () => {
    const {storyData}=useSelector(state=>state.story)
    const navigate=useNavigate()
    const [progress,setProgress]=useState(0)

    useEffect(()=>{
            setProgress(0)
            const interval=setInterval(()=>{
                setProgress(prev=>
                    {if(prev>=100){
                        clearInterval(interval)
                        navigate('/')
                        return 100
                    }
                    return prev+1})
            },150)
            return ()=>clearInterval(interval)
        },[navigate])

   if (!storyData) {
    return <div className="text-white text-center h-screen flex items-center justify-center">Loading Story...</div>
   }
  return (
    <div className="w-full md:w-[500px] h-[100vh] border-x-2 border-gray-800 pt-[10px] relative flex flex-col justify-center">
         <div className="flex items-center gap-[10px] absolute top-[20px] px-[10px] z-[500]"> 
                <IoArrowBackSharp onClick={()=>navigate(`/`)} className='text-white w-[25px] h-[25px] cursor-pointer '/>      
            <div onClick={() => navigate(`/profile/${storyData?.author?.userName}`)} className="w-[30px] h-[30px] md:w-[50px] md:h-[50px] border-2 border-black rounded-full cursor-pointer overflow-hidden ml-[10px]">
               <img src={storyData?.author?.profileImage || dp} alt="" className="w-full h-full object-cover "/>
            </div>
            <div className="w-[100px] font-semibold truncate text-white ">
              {storyData?.author?.userName}
            </div>
         </div>

         <div className="w-full h-full flex items-center justify-center"> 
             {storyData.mediaType==="image" && 
                <div className='w-full h-[100vh]  flex items-center justify-center'>
                  <img src={storyData.media} alt="" className='h-[300px] max-w-full object-cover' />
                 </div>
               }   
               {storyData.mediaType==="video" && 
                 <div className='w-full h-[100vh]  flex  items-center justify-center'>
                    <VideoPlayer media={storyData.media}/>
                  </div>
               }        
         </div>

         <div className='absolute top-[10px]  w-full h-[3px] bg-gray-900'>
             <div className='w-[200px] h-full bg-white transition-all duration-200 ease-linear' style={{width:`${progress}%`}}>
             </div>
         </div>
    </div>
  );
};

export default StoryCard;
