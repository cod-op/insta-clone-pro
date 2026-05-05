import React from 'react'
import { IoMdHome } from "react-icons/io";
import { IoSearchSharp } from "react-icons/io5";
import { RxVideo } from "react-icons/rx";
import { FaRegSquarePlus } from "react-icons/fa6";
import dp from '../assets/dp.png'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navbar = () => {

  const navigate=useNavigate()
  const {userData}=useSelector(state=>state.user)

  return (
    <div className='w-[90%] left-1/2 -translate-x-1/2 lg:w-[40%] h-[55px] bg-black flex justify-around items-center fixed bottom-[20px] rounded-full shadow-2xl shadow-[#000000] z-[100]'>
       <div ><IoMdHome  className='text-white w-[30px] h-[30px]'/></div>
       <div  ><IoSearchSharp className='text-white w-[30px] h-[30px]'/></div>
       <div  ><FaRegSquarePlus  className='text-white w-[30px] h-[30px]'/></div>
       <div  ><RxVideo  className='text-white w-[30px] h-[30px]'/></div>
       <div className='w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden' onClick={()=>navigate(`/profile/${userData.userName}`)}>
           <img src={dp} alt="" className='w-full object-cover' />
       </div>
    </div>
  )
}

export default Navbar