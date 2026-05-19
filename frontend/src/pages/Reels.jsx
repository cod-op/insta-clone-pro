import React from 'react'
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import ReelCard from '../components/ReelCard';
import { useSelector } from 'react-redux';

const Reels = () => {
  const navigate=useNavigate()
  const {reelData}=useSelector(state=>state.reel)
  return (
    <div className='w-screen h-screen bg-black overflow-hidden flex justify-center items-center  '>
            <div className='w-full h-[80px]  flex items-center gap-[20px] px-[20px] fixed top-[1px] md:top-[20px]  left-[20px] z-100' ><IoArrowBackSharp onClick={()=>navigate(`/`)} className='text-white w-[25px] h-[25px] cursor-pointer '/>
                <h1 className='text-white text-[20px] font-semibold'>Reels</h1>
            </div>
           
           <div className='h-[100vh]  overflow-y-scroll snap-y snap-mandatory scrollbar-hide'>
                 {reelData.map((reel,index)=>(
                  <div className='h-screen snap-start'>
                    <ReelCard reel={reel} key={reel._id || index}/>
                  </div>
                 ))}
           </div>
   </div>
  )
}

export default Reels