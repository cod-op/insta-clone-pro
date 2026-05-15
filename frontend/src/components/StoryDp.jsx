import React from 'react'
import dp from '../assets/dp.png'
import { FiPlusCircle } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';


const StoryCard = ({profileImage,userName,story}) => {
   const navigate=useNavigate()
  return (
   <div className='flex flex-col w-[80px]'>
      <div className={`w-[80px] h-[80px] rounded-full flex justify-center items-center relative ${story?.length>0 ?"bg-gradient-to-b from-blue-500 to-blue-950 ":" "}`}>
        <div className='w-[70px] h-[70px] border-2 border-black rounded-full cursor-pointer overflow-hidden '>
           <img src={profileImage||dp} alt="" className='w-full object-cover' />
            {!story && userName==="You Story" && <div className='text-white absolute'>
              
            </div> }
            <FiPlusCircle  className='absolute bottom-[8px] right-[10px] rounded-full text-black bg-white  w-[25px] h-[25px] '/>
        </div>
       </div>

        <div className='text-[14px] text-center truncate w-full text-white '>
           {userName}
        </div> 
   </div>
  )
}

export default StoryCard