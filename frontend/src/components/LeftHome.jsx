import React from 'react'
import logo from '../assets/logo.png'
import dp from '../assets/dp.png'
import { IoMdHeartEmpty } from "react-icons/io";
import axios from 'axios';
import { backendUrl } from '../App';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import OtherUser from './OtherUser';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Notifications from '../pages/Notifications';


const LeftHome = () => {
    const {userData,suggestedUsers}=useSelector(state=>state.user)
    const [showNotifications,setShowNotifications]=useState(false)
    const {notificationData}=useSelector(state=>state.user)
    const dispatch=useDispatch()


    const handleLogout=async()=>{
        try{
           const result=await axios.get(`${backendUrl}/api/auth/signout`,{withCredentials:true})
           dispatch(setUserData(null))
        }catch(error){
             console.log(error);
        }
    }
    
  return (
    <div className={`w-[25%] hidden lg:block h-[100vh] bg-black border-r-2 border-gray-900  ${showNotifications?"overflow-hidden":"overflow-auto"}`}>

       <div className='w-full h-[100px] flex items-center justify-between p-[20px]'>
          <img src={logo} alt="" className='w-[150px]' />
          <div className='relative' onClick={()=>setShowNotifications(prev=>!prev)}>
            <IoMdHeartEmpty  className='text-white w-[25px] h-[25px] cursor-pointer'/>
            {(notificationData?.length>0 && notificationData.some((noti)=>
              noti.isRead===false)) &&
              <div className='w-[10px] h-[10px] bg-[#ED4956] rounded-full absolute top-0 right-0'>

            </div>
            }
          </div>
        </div>
    
       {!showNotifications &&
       <>
          <div className='flex items-center justify-between px-[10px] border-b-2 border-gray-900 py-[10px]'>
          <div className='flex items-center gap-[10px]'>
              <div className='w-[70px] h-[70px] border-2 border-black rounded-full cursor-pointer overflow-hidden'>
                <img src={userData.profileImage || dp} alt="" className='w-full object-cover' />
              </div>
             <div>
               <div className='text-[18px] text-white font-bold'>{userData.userName}</div>
               <div className='text-[18px] text-gray-400 font-bold'>{userData.name}</div>
             </div>
          </div>

          <div onClick={handleLogout} className='text-blue-500 font-semibold cursor-pointer'>Logout </div>

         </div>
      
         <div className='w-full flex flex-col gap-[20px] p-[20px]'>
          <h1 className='text-white text -[19px]'>Suggested Users</h1>
           {suggestedUsers && suggestedUsers.slice(0,3).map((user,index)=>(
            <OtherUser key={index} user={user}/>
           ))}
         </div>
       </>
       }

       {showNotifications  && <Notifications/>}


    </div>
  )
}

export default LeftHome