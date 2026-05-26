import React, { useEffect, useState } from 'react'
import { IoArrowBackSharp } from "react-icons/io5";
import { useNavigate } from 'react-router-dom';
import { IoSearchSharp } from "react-icons/io5";
import axios from 'axios';
import dp from '../assets/dp.png'
import { backendUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchData } from '../redux/userSlice';


const Search = () => {
    const navigate=useNavigate()
    const [input,setInput]=useState("")
    const dispatch=useDispatch()
    const {searchData}=useSelector(state=>state.user)


     useEffect(() => {
  const searchUsers = async () => {
    if (!input.trim()) {
      dispatch(setSearchData([]));
      return;
    }

    try {
      const result = await axios.get(`${backendUrl}/api/user/search?keyword=${input}`,{withCredentials: true});
        console.log(result.data)
        dispatch(setSearchData(result.data || []));
    } catch (error) {
      console.log("Status:", error.response?.status);
      console.log("Data:", error.response?.data);
      console.log("Message:", error.message);
    }
  };

  const timer = setTimeout(searchUsers, 500);

  return () => clearTimeout(timer);
}, [input, dispatch]);

   
    
  return (
    <div className='w-full min-h-[100vh] bg-black flex items-center flex-col gap-[20px]'>
        <div className='w-full h-[80px]  flex items-center gap-[20px] px-[20px] ' >
            <IoArrowBackSharp onClick={()=>navigate('/')} className='text-white w-[25px] h-[25px] cursor-pointer '/>
        </div>
        <div className='w-full h-[80px] flex items-center justify-center'>
            <form  onSubmit={(e)=>e.preventDefault()} className='w-[90%] z-50 max-w-[800px] h-[80%] rounded-full bg-[#0f1414] flex items-center px-[20px]'>
                <IoSearchSharp  className='w-[25px] h-[25px] text-white'/>
                <input onChange={(e)=>setInput(e.target.value)} value={input} type="text" placeholder='search . . .' className='w-full h-full outline-0 rounded-full px-[20px] cursor-pointer text-white text-2xl '/>
            </form>
        </div>
        {searchData?.map((user)=>(
            <div key={user._id} 
              className='w-[90%] max-w-[700px] flex items-center gap-[20px] bg-white px-[20px] rounded-xl cursor-pointer'>
                <div onClick={() => navigate(`/profile/${user.userName}`)} className='w-[40px] h-[40px] border-2 border-black rounded-full cursor-pointer overflow-hidden '>
                     <img src={user.profileImage || dp} alt="" className='w-full object-cover' />
                </div>

              <div className='text-black text-[18px] font-semibold'>
                <div className='font-semibold'>{user.userName}</div>
                <div className='text-gray-400 text-[14px]'>{user.name}</div>
              </div>
            </div>
        ))}
    </div>
  )
}

export default Search