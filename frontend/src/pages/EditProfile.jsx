import React, { useRef, useState } from 'react'
import dp from '../assets/dp.png'
import { IoArrowBackSharp } from "react-icons/io5";
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


const EditProfile = () => {
    const {userData}=useSelector(state=>state.user)
    const navigate=useNavigate()

    const imageInput=useRef()

    const [frontendImage,setFrontendImage]=useState(userData.profileImage || dp)
    const [backendImage,setBackendImage]=useState(null)
    const handleImage=(e)=>{
         const file=e.target.files[0]
         setBackendImage(file)
         setFrontendImage(URL.createObjectURL(file))
    }

    
   

  return (
    <div className='w-full min-h-[100vh] bg-black flex items-center flex-col gap-[20px] '>
       <div className='w-full h-[80px]  flex items-center gap-[20px] px-[20px]' ><IoArrowBackSharp onClick={()=>navigate(`/profile/${userData.userName}`)} className='text-white w-[25px] h-[25px] cursor-pointer '/>
          <h1 className='text-white text-[20px] font-semibold'>Edit Profile</h1>
        </div>

        <div onClick={()=>imageInput.current.click()} className='w-[80px] h-[80px] md:w-[100px] md:h-[100px] border-2 border-black rounded-full cursor-pointer overflow-hidden '>
            <input type="file" accept='image/*' ref={imageInput} hidden onChange={handleImage}/>
           <img src={frontendImage} alt="" className='w-full object-cover' />
        </div>

        <div className='text-blue-500 text-center text-[18px]'>Change Your Profile Picture</div>
       

        <input type="text"  className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2 border-gray-700 rounded-2xl px-[20px] outline-none text-white font-semibold' placeholder='Enter your name'/>
        <input type="text"  className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2 border-gray-700 rounded-2xl px-[20px] outline-none text-white font-semibold' placeholder='Enter your username '/>
        <input type="text"  className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2 border-gray-700 rounded-2xl px-[20px] outline-none text-white font-semibold' placeholder='Enter your bio'/>
        <input type="text"  className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2 border-gray-700 rounded-2xl px-[20px] outline-none text-white font-semibold' placeholder='Enter your profession'/>
        <input type="text"  className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2 border-gray-700 rounded-2xl px-[20px] outline-none text-white font-semibold' placeholder='Enter your gender'/>
        
        <button className='px-[10px] w-[60%] max-w-[400px] py-[5px] h-[50px] bg-white cursor-pointer rounded-2xl'>Save Profile</button>
    </div>
  )
}

export default EditProfile