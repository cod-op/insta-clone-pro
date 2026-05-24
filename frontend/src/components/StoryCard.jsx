import React, { useEffect, useState } from "react";
import dp from '../assets/dp.png'
import { useSelector } from "react-redux";
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";
import { IoIosEye } from "react-icons/io";

const StoryCard = () => {
    const {storyData}=useSelector(state=>state.story)
    const {userData}=useSelector(state=>state.user)
    const navigate=useNavigate()
    const [progress,setProgress]=useState(0)
    const[showViewers,setShowViewers]=useState(false)

    useEffect(()=>{
           if (!storyData) return
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
        },[navigate,storyData])

   if (!storyData) {
    return <div className="text-white text-center h-screen flex items-center justify-center">Loading Story...</div>
   }

  return (
    <div className="w-full md:w-[500px] mx-auto h-[100vh] border-x-2 border-gray-800 pt-[10px] relative flex flex-col justify-center">
         <div className="flex items-center gap-[10px] absolute top-[20px] px-[10px] z-[500]"> 
                <IoArrowBackSharp onClick={()=>navigate(`/`)} className='text-white w-[25px] h-[25px] cursor-pointer '/>      
            <div onClick={() => navigate(`/profile/${storyData?.author?.userName}`)} 
               className="w-[30px] h-[30px] md:w-[50px] md:h-[50px] border-2 border-black rounded-full cursor-pointer overflow-hidden ml-[10px]">
               <img src={storyData?.author?.profileImage || dp} alt="" className="w-full h-full object-cover "/>
            </div>
            <div className="w-[100px] font-semibold truncate text-white ">
              {storyData?.author?.userName}
            </div>
         </div>

         <div className='absolute top-[10px]  w-full h-[3px] bg-gray-900 z-1'>
             <div className='w-[200px] h-full bg-white transition-all duration-200 ease-linear' style={{width:`${progress}%`}}>
             </div>
         </div>

        {!showViewers && 
        <>
            <div onClick={()=>setShowViewers(true)} className="w-full h-full flex items-center justify-center"> 
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

         {storyData?.author?.userName===userData?.userName && 
            <div onClick={()=>setShowViewers(true)}  className="w-full flex h-[70px] p-2 left-0 absolute bottom-0 text-white cursor-pointer">
                <div className="text-white flex items-center gap-[5px] font-semibold "><IoIosEye className="w-[30px] h-[30px] text-gray-400 "/>{storyData?.viewers?.length}</div>
               <div >
                 <div className='flex  justify-center items-center gap-[20px]'>
                     <div className='flex justify-start relative '>
                        {storyData?.viewers?.slice(0,3).map((viewer,index)=>(
                        <div key={viewer?._id} className={`w-[40px] h-[40px]  border-2 border-black rounded-full cursor-pointer overflow-hidden ${index>0?`absolute `:""}`} style={{ left: `${index * 12}px`,zIndex: 10 - index}}>
                           <img src={viewer?.profileImage || dp} alt="" className='w-full object-cover' />
                       </div>
                   ))}                      
                </div>
                </div>
                              
               </div>
            </div>}
        </>}

        {showViewers  && <>
              <div onClick={()=>setShowViewers(false)} className="w-full h-[30%] flex items-center justify-center mt-[80px] mb-[10px] cursor-pointer overflow-hidden"> 
             {storyData.mediaType==="image" && 
                <div className='h-full  flex items-center justify-center'>
                  <img src={storyData.media} alt="" className='h-full  object-cover' />
                 </div>
               }   
               {storyData.mediaType==="video" && 
                 <div className='h-full flex  items-center justify-center'>
                    <VideoPlayer media={storyData.media}/>
                  </div>
               }        
            </div>

            <div className="w-full h-[70%] border-t-2 border-t-gray-800 p-[20px] pt-[30px]">
                <div className="text-white flex items-center gap-[10px]">
                    <IoIosEye/>
                    <span>{storyData?.viewers?.length}</span>
                    <span>Viewers</span>
                </div>
                <div className="w-full max-h-full flex  flex-col gap-[10px] overflow-auto pt--[20px]">
               {storyData?.viewers?.map((viewer,index)=>(      
                     <div key={viewer?._id || index} className="w-full flex items-center gap-[15px] p-1 hover:bg-zinc-900 rounded-lg transition-colors">
                <div className="w-[35px] h-[35px] md:w-[45px] md:h-[45px] border-2 border-black rounded-full cursor-pointer overflow-hidden flex-shrink-0">
                    <img src={viewer?.profileImage || dp} alt="viewer" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 font-semibold truncate text-white text-sm md:text-base">
                    {viewer?.userName}
                </div>
            </div>
               ))}
               </div>
            </div>  
          </>}

    </div>
  );
};

export default StoryCard;