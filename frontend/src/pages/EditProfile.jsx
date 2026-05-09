import React, { useRef, useState } from 'react'
import dp from '../assets/dp.png'
import { IoArrowBackSharp } from "react-icons/io5";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { backendUrl } from '../App';
import { setProfileData, setUserData } from '../redux/userSlice';
import { ClipLoader } from 'react-spinners';


const EditProfile = () => {
    const {userData}=useSelector(state=>state.user)
    const navigate=useNavigate()
    const imageInput=useRef()
    
    const [frontendImage,setFrontendImage]=useState(userData.profileImage || dp)
    const [backendImage,setBackendImage]=useState(null)
    const [name,setName]=useState(userData.name ||"")
    const [userName,setUserName]=useState(userData.userName ||"")
    const [bio,setBio]=useState(userData.bio ||"")
    const [profession,setProfession]=useState(userData.profession ||"")
    const [gender,setGender]=useState(userData.gender ||"")
    const dispatch=useDispatch()
    const [loading,setLoading]=useState(false);
    const handleImage=(e)=>{
         const file=e.target.files[0]
         setBackendImage(file)
         setFrontendImage(URL.createObjectURL(file))
    }

    const handleEditProfile=async()=>{
      setLoading(true)
         try{
           const formdata= new FormData()
           formdata.append("name",name)
           formdata.append("userName",userName)
           formdata.append("bio",bio)
           formdata.append("profession",profession)
           formdata.append("gender",gender)
           // Check if a new image was actually selected
           if(backendImage){
                formdata.append("profileImage", backendImage);
           }
            const result=await axios.post(`${backendUrl}/api/user/editprofile`,formdata,{withCredentials:true})
            console.log("edit profile data",result);
          
            if (result.data.success) {
              dispatch(setProfileData(result.data.user));
              dispatch(setUserData(result.data.user));
                 setLoading(false)
                navigate(`/profile/${userData.userName}`);
          }
         }catch(error){
               console.error("Edit Profile Error:", error);
                console.log("FULL ERROR =>", error)
                setLoading(false)
         }
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

        <div onClick={()=>imageInput.current.click()} className='text-blue-500 text-center text-[18px font-semibold cursor-pointer'>Change Your Profile Picture</div>
       

        <input onChange={(e)=>setName(e.target.value)} value={name} type="text" 
          className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2 border-gray-700 rounded-2xl px-[20px] outline-none text-white font-semibold'
          placeholder='Enter your name'/>
        <input onChange={(e)=>setUserName(e.target.value)} value={userName} type="text"
           className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2 border-gray-700 rounded-2xl px-[20px] outline-none text-white font-semibold'
           placeholder='Enter your username '/>
        <input onChange={(e)=>setBio(e.target.value)} value={bio}  type="text"  
          className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2 border-gray-700 rounded-2xl px-[20px] outline-none text-white font-semibold' 
          placeholder='Enter your bio'/>
        <input onChange={(e)=>setProfession(e.target.value)} value={profession}  type="text"  
          className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2 border-gray-700 rounded-2xl px-[20px] outline-none text-white font-semibold' 
          placeholder='Enter your profession'/>
        <input onChange={(e)=>setGender(e.target.value)} value={gender}  type="text"  
          className='w-[90%] max-w-[600px] h-[60px] bg-[#0a1010] border-2 border-gray-700 rounded-2xl px-[20px] outline-none text-white font-semibold'
          placeholder='Enter your gender'/>
        
        <button onClick={handleEditProfile} className='px-[10px] w-[60%] max-w-[400px] py-[5px] h-[50px] bg-white cursor-pointer rounded-2xl'>
          {loading?<ClipLoader size={30} color='blue'/>:"Save Profile"}
        </button>
    </div>
  )
}

export default EditProfile