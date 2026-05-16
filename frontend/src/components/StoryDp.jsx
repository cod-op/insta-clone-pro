import React from 'react'
import dp from '../assets/dp.png'
import { FiPlusCircle } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const StoryDp = ({profileImage,userName,story}) => {
   const navigate=useNavigate()
   const {userData}=useSelector(state=>state.user)

   const handleClick=async()=>{
      if(!story && userName==="Your Story"){
         navigate('/upload')
      }else if(story && userName==="Your Story"){
           navigate(`/story/${userData.userName}`)
      }else{
         if (story) {
            navigate(`/story/${story?.author?.userName}`)
        }
      }
   }

  return (
   <div className='flex flex-col w-[80px]'>
      <div className={`w-[80px] h-[80px] rounded-full flex justify-center items-center relative ${story ?"bg-gradient-to-b from-blue-500 to-blue-950 ":" "}`}>
        <div className='w-[70px] h-[70px] border-2 border-black rounded-full cursor-pointer overflow-hidden' onClick={handleClick}>
           <img src={profileImage||dp} alt="" className='w-full object-cover' />
            {!story && userName==="Your Story" && <div className='text-white absolute'>
              
            </div> }
             {userName==="Your Story" &&<FiPlusCircle  className='absolute bottom-[8px] right-[10px] rounded-full text-black bg-white  w-[25px] h-[25px] '/>}
        </div>
       </div>

        <div className='text-[14px] text-center truncate w-full text-white '>
           {userName}
        </div> 
   </div>
  )
}

export default StoryDp